-- ============================================================
-- Homeowners Aligned — Web App Schema Migration
-- Run AFTER scraper schema (hoas, hoa_officers, hoa_fees exist)
-- ============================================================

-- ─── Extend hoas table with web app fields ───
ALTER TABLE hoas ADD COLUMN IF NOT EXISTS display_name text;
ALTER TABLE hoas ADD COLUMN IF NOT EXISTS health_score integer;
ALTER TABLE hoas ADD COLUMN IF NOT EXISTS health_score_updated_at timestamptz;
ALTER TABLE hoas ADD COLUMN IF NOT EXISTS data_completeness_percent integer DEFAULT 0;
ALTER TABLE hoas ADD COLUMN IF NOT EXISTS total_units integer;
ALTER TABLE hoas ADD COLUMN IF NOT EXISTS claimed boolean DEFAULT false;
ALTER TABLE hoas ADD COLUMN IF NOT EXISTS claimed_by uuid;
ALTER TABLE hoas ADD COLUMN IF NOT EXISTS lat double precision;
ALTER TABLE hoas ADD COLUMN IF NOT EXISTS lng double precision;
ALTER TABLE hoas ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now();

-- Index for sorting by completeness (landing page "Try" chips)
CREATE INDEX IF NOT EXISTS idx_hoas_completeness ON hoas (data_completeness_percent DESC);

-- ─── Profiles (extends auth.users) ───
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name text NOT NULL DEFAULT '',
  last_name text NOT NULL DEFAULT '',
  display_preference text NOT NULL DEFAULT 'named'
    CHECK (display_preference IN ('named','anonymous_verified','anonymous_basic')),
  email text,
  role text NOT NULL DEFAULT 'user'
    CHECK (role IN ('user','agent','inspector','admin')),
  is_premium boolean DEFAULT false,
  premium_expires_at timestamptz,
  referral_token text UNIQUE,
  avatar_type text,
  -- Agent fields
  agent_license_number text,
  agent_brokerage text,
  agent_verified_at timestamptz,
  agent_status text CHECK (agent_status IN ('pending','verified','rejected')),
  agent_referral_code text UNIQUE,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles FOR SELECT USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE USING (auth.uid() = id);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO profiles (id, email)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ─── Waitlist ───
CREATE TABLE IF NOT EXISTS waitlist (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  first_name text NOT NULL DEFAULT '',
  state text NOT NULL,
  zip text NOT NULL DEFAULT '',
  county text,
  hoa_name text,
  created_at timestamptz DEFAULT now(),
  source text NOT NULL DEFAULT 'organic'
    CHECK (source IN ('organic','state_page','404_page','referral','county_missing')),
  notified boolean DEFAULT false,
  notified_at timestamptz,
  UNIQUE(email, state)
);

ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;

-- Anyone can insert (signup), only admin can read
CREATE POLICY "Anyone can join waitlist"
  ON waitlist FOR INSERT WITH CHECK (true);

CREATE POLICY "Admin can read waitlist"
  ON waitlist FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ─── Health Scores ───
CREATE TABLE IF NOT EXISTS health_scores (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  hoa_id uuid NOT NULL REFERENCES hoas(id) ON DELETE CASCADE,
  score_total integer,
  score_financial integer,
  score_governance integer,
  score_legal integer,
  score_sentiment integer,
  dimensions_scored integer DEFAULT 0,
  is_preliminary boolean DEFAULT true,
  data_completeness_percent integer DEFAULT 0,
  review_count integer DEFAULT 0,
  calculated_at timestamptz DEFAULT now(),
  UNIQUE(hoa_id)
);

ALTER TABLE health_scores ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Health scores are public"
  ON health_scores FOR SELECT USING (true);

-- ─── Health Score History ───
CREATE TABLE IF NOT EXISTS health_score_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  hoa_id uuid NOT NULL REFERENCES hoas(id) ON DELETE CASCADE,
  score_total integer,
  dimensions_scored integer DEFAULT 0,
  calculated_at timestamptz DEFAULT now()
);

ALTER TABLE health_score_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Score history is public"
  ON health_score_history FOR SELECT USING (true);

-- ─── User Properties (address verification) ───
CREATE TABLE IF NOT EXISTS user_properties (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  hoa_id uuid REFERENCES hoas(id),
  address text NOT NULL,
  unit_number text,
  verification_status text NOT NULL DEFAULT 'pending'
    CHECK (verification_status IN ('pending','verified','rejected','flagged')),
  verification_method text
    CHECK (verification_method IN ('utility_bill','deed','plaid','manual')),
  verified_at timestamptz,
  ownership_status text
    CHECK (ownership_status IN ('current_owner','former_owner','renter')),
  tenure_start date,
  tenure_end date,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE user_properties ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own properties"
  ON user_properties FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own properties"
  ON user_properties FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ─── Reviews ───
CREATE TABLE IF NOT EXISTS reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  hoa_id uuid NOT NULL REFERENCES hoas(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  user_property_id uuid REFERENCES user_properties(id),
  rating_financial smallint NOT NULL CHECK (rating_financial BETWEEN 1 AND 5),
  rating_communication smallint NOT NULL CHECK (rating_communication BETWEEN 1 AND 5),
  rating_maintenance smallint NOT NULL CHECK (rating_maintenance BETWEEN 1 AND 5),
  rating_enforcement smallint NOT NULL CHECK (rating_enforcement BETWEEN 1 AND 5),
  rating_responsiveness smallint NOT NULL CHECK (rating_responsiveness BETWEEN 1 AND 5),
  ownership_status text NOT NULL
    CHECK (ownership_status IN ('current_owner','former_owner','renter')),
  tenure_years text
    CHECK (tenure_years IN ('<1yr','1-3yr','3-5yr','5+yr')),
  meetings_attended text
    CHECK (meetings_attended IN ('regularly','few','never','board_member')),
  whats_working text NOT NULL CHECK (length(whats_working) BETWEEN 50 AND 500),
  what_could_improve text NOT NULL CHECK (length(what_could_improve) BETWEEN 50 AND 500),
  would_recommend text NOT NULL
    CHECK (would_recommend IN ('yes','with_reservations','no')),
  display_preference text NOT NULL DEFAULT 'named',
  is_flagged boolean DEFAULT false,
  flag_reason text,
  moderation_status text NOT NULL DEFAULT 'pending'
    CHECK (moderation_status IN ('pending','approved','flagged','rejected')),
  created_at timestamptz DEFAULT now()
);

-- One review per address per year
CREATE UNIQUE INDEX IF NOT EXISTS idx_reviews_one_per_year
  ON reviews (user_property_id, (EXTRACT(YEAR FROM created_at)));

ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Approved reviews are public"
  ON reviews FOR SELECT USING (moderation_status = 'approved');

CREATE POLICY "Users can insert own reviews"
  ON reviews FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ─── Admin Audit Log (append-only, immutable) ───
CREATE TABLE IF NOT EXISTS admin_audit_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_user_id uuid,
  action text NOT NULL,
  record_type text,
  record_id uuid,
  details_json jsonb,
  ip_address text,
  user_agent text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE admin_audit_log ENABLE ROW LEVEL SECURITY;

-- Only admin can read, no one can update/delete
CREATE POLICY "Admin can read audit log"
  ON admin_audit_log FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Service role can insert audit log"
  ON admin_audit_log FOR INSERT WITH CHECK (true);

-- Revoke delete/update from all roles
REVOKE UPDATE, DELETE ON admin_audit_log FROM anon, authenticated;

-- ─── Corrections Queue ───
CREATE TABLE IF NOT EXISTS corrections_queue (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  hoa_id uuid NOT NULL REFERENCES hoas(id) ON DELETE CASCADE,
  field_name text NOT NULL,
  current_value text,
  suggested_value text NOT NULL,
  submitter_user_id uuid REFERENCES profiles(id),
  submitter_type text NOT NULL DEFAULT 'anonymous'
    CHECK (submitter_type IN ('verified_resident','registered_user','anonymous')),
  supporting_doc_url text,
  status text NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending','applied','dismissed')),
  reviewed_by uuid,
  reviewed_at timestamptz,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE corrections_queue ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit corrections"
  ON corrections_queue FOR INSERT WITH CHECK (true);

CREATE POLICY "Admin can read corrections"
  ON corrections_queue FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

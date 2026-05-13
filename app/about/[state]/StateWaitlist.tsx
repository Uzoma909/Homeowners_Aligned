"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

interface StateWaitlistProps {
  stateCode: string;
  stateName: string;
}

export function StateWaitlist({ stateCode, stateName }: StateWaitlistProps) {
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [zip, setZip] = useState("");
  const [hoaName, setHoaName] = useState("");
  const [password, setPassword] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  async function handleSubmit() {
    if (!firstName.trim() || !email.trim() || !password.trim()) {
      setError("Name, email, and password are required.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    setError(null);

    // Create auth account
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: email.trim().toLowerCase(),
      password: password,
      options: {
        data: { first_name: firstName.trim() },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (authError) {
      if (authError.message.includes("already registered")) {
        setError("This email already has an account. Sign in instead.");
      } else {
        setError(authError.message);
      }
      setLoading(false);
      return;
    }

    // Also add to waitlist table for state tracking
    await supabase.from("waitlist").insert({
      first_name: firstName.trim(),
      email: email.trim().toLowerCase(),
      zip: zip.trim() || null,
      state: stateCode.toUpperCase(),
      hoa_name: hoaName.trim() || null,
      source: "state_page",
    });

    setSubmitted(true);
    setLoading(false);
  }

  if (submitted) {
    return (
      <div className="text-center py-4">
        <div className="flex justify-center mb-4">
          <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="var(--color-ha-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 6 9 17l-5-5" />
          </svg>
        </div>
        <p
          className="text-[17px] font-semibold"
          style={{ fontFamily: "var(--font-outfit)", color: "var(--color-ha-text)" }}
        >
          {"You\u2019re on the list!"}
        </p>
        <p className="text-[14px] mt-2" style={{ color: "var(--color-ha-text-soft)" }}>
          {"We\u2019ll notify you when Homeowners Aligned launches in "}
          <strong style={{ color: "var(--color-ha-text)" }}>{stateName}</strong>.
        </p>
        <p className="text-[13px] mt-3" style={{ color: "var(--color-ha-primary)", fontWeight: 600 }}>
          Check your email to verify your account.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col gap-3">
        {error && (
          <div
            className="rounded-xl p-3 text-[13px]"
            style={{
              background: "transparent",
              border: "1px solid var(--color-ha-border-strong)",
              color: "var(--color-ha-text-soft)",
            }}
          >
            {error}
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="First name"
            required
            className="text-[14px] py-3 px-3.5 border-0 outline-0"
            style={{
              fontFamily: "var(--font-outfit)",
              color: "var(--color-ha-text)",
              background: "var(--color-ha-surface)",
              borderRadius: "var(--radius-input)",
              border: "1px solid var(--color-ha-border)",
            }}
          />
          <input
            type="text"
            value={zip}
            onChange={(e) => setZip(e.target.value)}
            placeholder="Zip code"
            className="text-[14px] py-3 px-3.5 border-0 outline-0"
            style={{
              fontFamily: "var(--font-outfit)",
              color: "var(--color-ha-text)",
              background: "var(--color-ha-surface)",
              borderRadius: "var(--radius-input)",
              border: "1px solid var(--color-ha-border)",
            }}
          />
        </div>

        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email address"
          required
          className="text-[14px] py-3 px-3.5 border-0 outline-0 w-full"
          style={{
            fontFamily: "var(--font-outfit)",
            color: "var(--color-ha-text)",
            background: "var(--color-ha-surface)",
            borderRadius: "var(--radius-input)",
            border: "1px solid var(--color-ha-border)",
          }}
        />

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Create a password"
          required
          minLength={6}
          className="text-[14px] py-3 px-3.5 border-0 outline-0 w-full"
          style={{
            fontFamily: "var(--font-outfit)",
            color: "var(--color-ha-text)",
            background: "var(--color-ha-surface)",
            borderRadius: "var(--radius-input)",
            border: "1px solid var(--color-ha-border)",
          }}
        />

        <input
          type="text"
          value={hoaName}
          onChange={(e) => setHoaName(e.target.value)}
          placeholder="HOA name (optional)"
          className="text-[14px] py-3 px-3.5 border-0 outline-0 w-full"
          style={{
            fontFamily: "var(--font-outfit)",
            color: "var(--color-ha-text)",
            background: "var(--color-ha-surface)",
            borderRadius: "var(--radius-input)",
            border: "1px solid var(--color-ha-border)",
          }}
        />

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full text-[14px] font-semibold py-3 rounded-[10px] cursor-pointer mt-1 transition-opacity border-0"
          style={{
            background: "var(--color-ha-primary)",
            color: "white",
            fontFamily: "var(--font-outfit)",
            opacity: loading ? 0.7 : 1,
          }}
        >
          {loading ? "Creating account..." : "Join the waitlist"}
        </button>
      </div>
    </div>
  );
}
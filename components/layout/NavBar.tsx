"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { WordMark } from "@/components/icons/Logo";
import { createClient } from "@/lib/supabase/client";
import { Menu, X } from "lucide-react";

const NAV_LINKS = [
  { href: "/", label: "Search" },
  { href: "/about", label: "About" },
  { href: "/blog", label: "Blog" },
] as const;

interface NavBarProps {
  activePath?: string;
}

export function NavBar({ activePath }: NavBarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState<{ email?: string; full_name?: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    async function checkAuth() {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (authUser) {
        setUser({
          email: authUser.email,
          full_name: authUser.user_metadata?.full_name || authUser.email?.split("@")[0],
        });
      }
      setLoading(false);
    }
    checkAuth();
  }, []);

  async function handleSignOut() {
    await supabase.auth.signOut();
    setUser(null);
    router.push("/");
    router.refresh();
  }

  const initials = user?.full_name
    ? user.full_name.split(" ").map((w: string) => w[0]).slice(0, 2).join("").toUpperCase()
    : "?";

  return (
    <header
      className="sticky top-0 z-50"
      style={{
        background: "rgba(255, 255, 255, 0.85)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        borderBottom: "1px solid var(--color-ha-border)",
      }}
    >
      <div className="max-w-[1180px] mx-auto px-4 md:px-6 flex items-center h-14 md:h-16 relative">
        {/* Logo */}
        <Link href="/" className="flex-shrink-0">
          {/* Mobile: compact */}
          <div className="md:hidden flex items-end gap-1.5">
            <img src="/icons/mark-purple-transparent.svg" alt="" width={24} height={24} />
            <span
              className="font-semibold leading-none"
              style={{
                fontFamily: "var(--font-outfit)",
                fontSize: 18,
                color: "var(--color-ha-primary)",
                letterSpacing: "-0.02em",
                transform: "translateY(-1px)",
              }}
            >
              HOAligned
            </span>
          </div>
          {/* Desktop: full wordmark */}
          <span className="hidden md:block">
            <WordMark size={20} />
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6 absolute left-1/2 -translate-x-1/2">
          {NAV_LINKS.map(({ href, label }) => {
            const isActive = activePath === href;
            return (
              <Link
                key={href}
                href={href}
                className="text-sm transition-colors"
                style={{
                  color: isActive
                    ? "var(--color-ha-primary)"
                    : "var(--color-ha-text-soft)",
                  fontWeight: isActive ? 600 : 500,
                  borderBottom: isActive
                    ? "2px solid var(--color-ha-primary)"
                    : "2px solid transparent",
                  paddingBottom: 4,
                }}
              >
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Desktop actions */}
        <div className="hidden md:flex items-center gap-3 ml-auto mr-0">
          {!loading && (
            <>
              {user ? (
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleSignOut}
                    className="text-sm font-medium cursor-pointer bg-transparent border-0"
                    style={{ color: "var(--color-ha-text-soft)", fontFamily: "inherit" }}
                  >
                    Sign out
                  </button>
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold"
                    style={{
                      background: "linear-gradient(135deg, #a78bfa, #7c3aed)",
                      color: "white",
                    }}
                  >
                    {initials}
                  </div>
                </div>
              ) : (
                <>
                  <Link
                    href="/auth/login"
                    className="text-sm font-medium"
                    style={{ color: "var(--color-ha-text-soft)" }}
                  >
                    Sign in
                  </Link>
                  <Link
                    href="/auth/register"
                    className="text-sm font-semibold px-4 py-2 rounded-[10px]"
                    style={{
                      background: "var(--color-ha-text)",
                      color: "white",
                    }}
                  >
                    Get started
                  </Link>
                </>
              )}
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden ml-auto p-2 -mr-2"
          style={{ color: "var(--color-ha-text)" }}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div
          className="md:hidden border-t"
          style={{
            borderColor: "var(--color-ha-border)",
            background: "white",
          }}
        >
          <nav className="flex flex-col px-4 py-3 gap-1">
            {NAV_LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setMobileOpen(false)}
                className="py-3 text-[15px] font-medium"
                style={{
                  color:
                    activePath === href
                      ? "var(--color-ha-primary)"
                      : "var(--color-ha-text)",
                  borderBottom: "1px solid var(--color-ha-border)",
                }}
              >
                {label}
              </Link>
            ))}

            {!loading && (
              <div className="flex flex-col gap-2 pt-4 pb-2">
                {user ? (
                  <>
                    <div className="flex items-center gap-3 py-2">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold"
                        style={{ background: "linear-gradient(135deg, #a78bfa, #7c3aed)", color: "white" }}
                      >
                        {initials}
                      </div>
                      <div>
                        <div className="text-[14px] font-semibold" style={{ color: "var(--color-ha-text)" }}>
                          {user.full_name}
                        </div>
                        <div className="text-[12px]" style={{ color: "var(--color-ha-gray)" }}>
                          {user.email}
                        </div>
                      </div>
                    </div>
                    <span />
                    <button
                      onClick={() => { handleSignOut(); setMobileOpen(false); }}
                      className="py-3 text-sm font-semibold rounded-[10px] cursor-pointer"
                      style={{
                        border: "1px solid var(--color-ha-border)",
                        background: "white",
                        color: "var(--color-ha-text)",
                        fontFamily: "inherit",
                      }}
                    >
                      Sign out
                    </button>
                  </>
                ) : (
                  <div className="flex gap-3">
                    <Link
                      href="/auth/login"
                      onClick={() => setMobileOpen(false)}
                      className="flex-1 text-center py-3 text-sm font-semibold rounded-[10px]"
                      style={{
                        border: "1px solid var(--color-ha-border)",
                        color: "var(--color-ha-text)",
                      }}
                    >
                      Sign in
                    </Link>
                    <Link
                      href="/auth/register"
                      onClick={() => setMobileOpen(false)}
                      className="flex-1 text-center py-3 text-sm font-semibold rounded-[10px]"
                      style={{
                        background: "var(--color-ha-primary)",
                        color: "white",
                      }}
                    >
                      Get started
                    </Link>
                  </div>
                )}
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
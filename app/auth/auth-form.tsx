"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

interface AuthFormProps {
  mode: "login" | "register";
}

export function AuthForm({ mode }: AuthFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [confirmationSent, setConfirmationSent] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const isRegister = mode === "register";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isRegister) {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: fullName },
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          },
        });

        if (signUpError) {
          setError(signUpError.message);
          setLoading(false);
          return;
        }

        // Check if user needs email confirmation
        if (data.user && !data.session) {
          setConfirmationSent(true);
          setLoading(false);
          return;
        }

        // Auto-confirmed (e.g. if email confirmations disabled in Supabase)
        router.push("/");
        router.refresh();
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (signInError) {
          if (signInError.message === "Invalid login credentials") {
            setError("Incorrect email or password. Please try again.");
          } else {
            setError(signInError.message);
          }
          setLoading(false);
          return;
        }

        router.push("/");
        router.refresh();
      }
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  if (confirmationSent) {
    return (
      <div className="flex flex-col items-center text-center gap-4 py-4">
        <div className="flex justify-center" style={{ color: "var(--color-ha-primary)" }}>
          <svg
            width={24}
            height={24}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M22 12.98V15.5C22 19 20 20.5 17 20.5H7" />
            <path d="M2 8.5C2 5 4 3.5 7 3.5H17C20 3.5 22 5 22 8.5" />
            <path d="M17 9L13.87 11.5C12.84 12.32 11.15 12.32 10.12 11.5L7 9" />
            <path d="M2 16.5H8" />
            <path d="M2 12.5H5" />
          </svg>
        </div>
        <div>
          <h2
            className="text-xl font-semibold"
            style={{ fontFamily: "var(--font-outfit)", color: "var(--color-ha-text)" }}
          >
            Check your email
          </h2>
          <p
            className="text-[14px] mt-2 leading-relaxed max-w-[360px]"
            style={{ color: "var(--color-ha-text-soft)" }}
          >
            We sent a confirmation link to{" "}
            <strong style={{ color: "var(--color-ha-text)" }}>{email}</strong>.
            Click the link to activate your account.
          </p>
        </div>
        <p className="text-[12px] mt-2" style={{ color: "var(--color-ha-gray)" }}>
          {"Didn\u2019t get it? Check your spam folder or "}
          <button
            onClick={() => {
              setConfirmationSent(false);
              setEmail("");
              setPassword("");
              setFullName("");
            }}
            className="font-semibold bg-transparent border-0 cursor-pointer p-0"
            style={{ color: "var(--color-ha-primary)", fontFamily: "inherit" }}
          >
            try again
          </button>
          .
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1
          className="text-2xl font-semibold"
          style={{
            fontFamily: "var(--font-outfit)",
            color: "var(--color-ha-text)",
            letterSpacing: "-0.02em",
          }}
        >
          {isRegister ? "Create your account" : "Welcome back"}
        </h1>
        <p className="text-[14px] mt-1.5" style={{ color: "var(--color-ha-text-soft)" }}>
          {isRegister
            ? "Join the community. Help make HOAs transparent."
            : "Sign in to your Homeowners Aligned account."}
        </p>
      </div>

      {error && (
        <div
          className="rounded-xl p-3.5 mb-5 text-[13px]"
          style={{
            background: "transparent",
            border: "1px solid var(--color-ha-border-strong)",
            color: "var(--color-ha-text-soft)",
          }}
        >
          {error}
        </div>
      )}

      <div className="flex flex-col gap-4">
        {isRegister && (
          <div>
            <label
              className="block text-[13px] font-medium mb-1.5"
              style={{ color: "var(--color-ha-text)" }}
            >
              Full name
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Your name"
              required
              className="w-full text-[15px] border-0 outline-0 bg-transparent py-3 px-3.5"
              style={{
                fontFamily: "var(--font-outfit)",
                color: "var(--color-ha-text)",
                background: "var(--color-ha-surface)",
                borderRadius: "var(--radius-input)",
                border: "1px solid var(--color-ha-border)",
              }}
            />
          </div>
        )}

        <div>
          <label
            className="block text-[13px] font-medium mb-1.5"
            style={{ color: "var(--color-ha-text)" }}
          >
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
            className="w-full text-[15px] border-0 outline-0 bg-transparent py-3 px-3.5"
            style={{
              fontFamily: "var(--font-outfit)",
              color: "var(--color-ha-text)",
              background: "var(--color-ha-surface)",
              borderRadius: "var(--radius-input)",
              border: "1px solid var(--color-ha-border)",
            }}
          />
        </div>

        <div>
          <label
            className="block text-[13px] font-medium mb-1.5"
            style={{ color: "var(--color-ha-text)" }}
          >
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={isRegister ? "At least 6 characters" : "Your password"}
            required
            minLength={6}
            className="w-full text-[15px] border-0 outline-0 bg-transparent py-3 px-3.5"
            style={{
              fontFamily: "var(--font-outfit)",
              color: "var(--color-ha-text)",
              background: "var(--color-ha-surface)",
              borderRadius: "var(--radius-input)",
              border: "1px solid var(--color-ha-border)",
            }}
          />
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full text-[15px] font-semibold py-3 rounded-[10px] cursor-pointer mt-1 transition-opacity"
          style={{
            background: "var(--color-ha-primary)",
            color: "white",
            border: "none",
            fontFamily: "var(--font-outfit)",
            opacity: loading ? 0.7 : 1,
          }}
        >
          {loading
            ? isRegister
              ? "Creating account\u2026"
              : "Signing in\u2026"
            : isRegister
              ? "Create account"
              : "Sign in"}
        </button>
      </div>

      <div className="mt-6 text-center">
        {isRegister ? (
          <p className="text-[13px]" style={{ color: "var(--color-ha-gray)" }}>
            {"Already have an account? "}
            <Link
              href="/auth/login"
              className="font-semibold no-underline hover:underline"
              style={{ color: "var(--color-ha-primary)" }}
            >
              Sign in
            </Link>
          </p>
        ) : (
          <p className="text-[13px]" style={{ color: "var(--color-ha-gray)" }}>
            {"Don\u2019t have an account? "}
            <Link
              href="/auth/register"
              className="font-semibold no-underline hover:underline"
              style={{ color: "var(--color-ha-primary)" }}
            >
              Create one free
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}
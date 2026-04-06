"use client";

import { createClient } from "@/lib/supabase-browser";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";

function LoginForm() {
  const supabase = createClient();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/dashboard";
  const authError = searchParams.get("error");

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(
    authError === "auth" ? "Authentication failed. Please try again." : null
  );

  async function handleMagicLink(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback?redirect=${redirect}`,
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      setSent(true);
      setLoading(false);
    }
  }

  async function handleGitHub() {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?redirect=${redirect}`,
      },
    });
    if (error) setError(error.message);
  }

  if (sent) {
    return (
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-indigo-mist">
          <svg className="h-6 w-6 text-brain-indigo" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        <h2 className="font-display text-xl font-normal text-deep-ink">Check your email</h2>
        <p className="mt-2 text-sm text-body">
          We sent a magic link to <span className="font-medium text-deep-ink">{email}</span>
        </p>
        <p className="mt-1 text-xs text-muted">Click the link in your email to sign in. Check spam if you don&apos;t see it.</p>
        <button
          onClick={() => { setSent(false); setEmail(""); }}
          className="mt-6 text-sm text-brain-indigo hover:underline"
        >
          Use a different email
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="text-center">
        <h1 className="font-display text-3xl font-light tracking-[-1px] text-deep-ink">
          Sign in
        </h1>
        <p className="mt-2 text-sm text-body">
          Access your brains, track your collection, and vote on what we build next.
        </p>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* GitHub OAuth */}
      <button
        onClick={handleGitHub}
        className="flex w-full items-center justify-center gap-3 rounded-lg border border-border-default bg-white py-3 text-[15px] font-medium text-deep-ink transition-all hover:border-border-indigo hover:shadow-brain"
      >
        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
        </svg>
        Continue with GitHub
      </button>

      <div className="flex items-center gap-4">
        <div className="h-px flex-1 bg-border-default" />
        <span className="text-xs text-muted">or</span>
        <div className="h-px flex-1 bg-border-default" />
      </div>

      {/* Magic link */}
      <form onSubmit={handleMagicLink} className="space-y-3">
        <input
          type="email"
          required
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-lg border border-border-default bg-white px-4 py-3 text-sm text-deep-ink placeholder-muted outline-none transition-all focus:border-brain-indigo focus:ring-[3px] focus:ring-brain-indigo/20"
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-brain-indigo py-3 text-[15px] font-semibold text-white shadow-brain-cta transition-all hover:bg-indigo-hover active:scale-[0.98] disabled:opacity-60"
        >
          {loading ? "Sending..." : "Send magic link"}
        </button>
      </form>

      <p className="text-center text-xs text-muted">
        No password needed. We&apos;ll email you a sign-in link.
      </p>
    </>
  );
}

export default function LoginPage() {
  return (
    <section className="flex min-h-[calc(100vh-200px)] items-center justify-center px-6 py-16">
      <div className="w-full max-w-[400px] space-y-6">
        <Suspense fallback={<div className="text-center text-sm text-muted">Loading...</div>}>
          <LoginForm />
        </Suspense>

        <div className="text-center">
          <Link href="/" className="text-sm text-brain-indigo hover:underline">
            &larr; Back to home
          </Link>
        </div>
      </div>
    </section>
  );
}

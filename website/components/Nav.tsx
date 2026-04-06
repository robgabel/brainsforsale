"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase-browser";
import type { User } from "@supabase/supabase-js";

export function Nav() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => setUser(session?.user ?? null)
    );

    return () => subscription.unsubscribe();
  }, [supabase.auth]);

  return (
    <nav className="sticky top-0 z-50 border-b border-[var(--border-whisper)] bg-white/85 backdrop-blur-xl">
      <div className="mx-auto flex max-w-[1140px] items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link href="/" className="font-display text-base font-semibold tracking-tight text-deep-ink">
          brainsforsale<span className="text-brain-indigo">.com</span>
        </Link>

        {/* Desktop links */}
        <div className="hidden items-center gap-8 md:flex">
          <Link href="/brains" className="text-[15px] font-medium text-body hover:text-deep-ink transition-colors">
            Brains
          </Link>
          <Link href="/pricing" className="text-[15px] font-medium text-body hover:text-deep-ink transition-colors">
            Pricing
          </Link>

          {user ? (
            <Link
              href="/dashboard"
              className="rounded-lg bg-brain-indigo px-5 py-2.5 text-[15px] font-semibold text-white shadow-brain-cta transition-all hover:bg-indigo-hover active:scale-[0.98]"
            >
              Dashboard
            </Link>
          ) : (
            <>
              <Link href="/login" className="text-[15px] font-medium text-body hover:text-deep-ink transition-colors">
                Sign in
              </Link>
              <Link
                href="/login"
                className="rounded-lg bg-brain-indigo px-5 py-2.5 text-[15px] font-semibold text-white shadow-brain-cta transition-all hover:bg-indigo-hover active:scale-[0.98]"
              >
                Get started
              </Link>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="rounded-lg p-2 text-body hover:text-deep-ink md:hidden"
          aria-label="Toggle menu"
        >
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            {mobileOpen ? (
              <path d="M6 6l12 12M6 18L18 6" />
            ) : (
              <path d="M4 8h16M4 16h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-[var(--border-default)] bg-white px-6 py-4 md:hidden">
          <div className="flex flex-col gap-4">
            <Link href="/brains" className="text-[15px] font-medium text-body" onClick={() => setMobileOpen(false)}>
              Brains
            </Link>
            <Link href="/pricing" className="text-[15px] font-medium text-body" onClick={() => setMobileOpen(false)}>
              Pricing
            </Link>
            {user ? (
              <Link
                href="/dashboard"
                className="rounded-lg bg-brain-indigo px-5 py-2.5 text-center text-[15px] font-semibold text-white"
                onClick={() => setMobileOpen(false)}
              >
                Dashboard
              </Link>
            ) : (
              <>
                <Link href="/login" className="text-[15px] font-medium text-body" onClick={() => setMobileOpen(false)}>
                  Sign in
                </Link>
                <Link
                  href="/login"
                  className="rounded-lg bg-brain-indigo px-5 py-2.5 text-center text-[15px] font-semibold text-white"
                  onClick={() => setMobileOpen(false)}
                >
                  Get started
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

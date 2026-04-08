"use client";

import Link from "next/link";
import { useState } from "react";

export function Nav() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 border-b border-[var(--border-whisper)] bg-white/85 backdrop-blur-xl">
      <div className="mx-auto flex max-w-[1140px] items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link href="/" className="font-display text-xl font-semibold tracking-tight text-deep-ink">
          brainsfor<span className="text-brain-indigo">.dev</span>
        </Link>

        {/* Desktop links */}
        <div className="hidden items-center gap-8 md:flex">
          <Link href="/brains" className="text-[15px] font-medium text-body hover:text-deep-ink transition-colors">
            Brains
          </Link>
          <Link href="/skills" className="text-[15px] font-medium text-body hover:text-deep-ink transition-colors">
            Skills
          </Link>
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
            <Link href="/skills" className="text-[15px] font-medium text-body" onClick={() => setMobileOpen(false)}>
              Skills
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}

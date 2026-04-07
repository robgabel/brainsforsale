import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-[var(--border-default)] bg-white">
      <div className="mx-auto max-w-[1140px] px-6 py-16">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <p className="font-display text-base font-semibold tracking-tight text-deep-ink">
              brainsfor<span className="text-brain-indigo">.dev</span>
            </p>
            <p className="mt-3 text-sm leading-relaxed text-body">
              Knowledge graphs of the world&apos;s best thinkers, packaged as AI skills.
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted">Product</h4>
            <ul className="mt-4 space-y-3">
              <li><Link href="/brains" className="text-sm text-body hover:text-deep-ink transition-colors">Brains</Link></li>
              <li><Link href="/pricing" className="text-sm text-body hover:text-deep-ink transition-colors">Pricing</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted">Resources</h4>
            <ul className="mt-4 space-y-3">
              <li><span className="text-sm text-muted">Docs (coming soon)</span></li>
              <li><span className="text-sm text-muted">API (coming soon)</span></li>
            </ul>
          </div>

          {/* Community */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted">Community</h4>
            <ul className="mt-4 space-y-3">
              <li><span className="text-sm text-muted">Discord (coming soon)</span></li>
              <li><span className="text-sm text-muted">Newsletter (coming soon)</span></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-[var(--border-default)] pt-8 text-center">
          <p className="text-xs text-muted">
            All brains built from freely available, public sources only. No commercial transcripts or paywalled content.
          </p>
          <p className="mt-2 text-xs text-muted">
            Built by Rob Gabel. &copy; {new Date().getFullYear()} BrainsFor.Dev
          </p>
        </div>
      </div>
    </footer>
  );
}

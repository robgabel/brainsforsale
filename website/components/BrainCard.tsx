import Link from "next/link";
import type { Brain } from "@/lib/brains";
import { SkillBadge } from "./SkillBadge";

export function BrainCard({ brain }: { brain: Brain }) {
  const isLive = brain.status === "live";

  return (
    <Link
      href={`/brains/${brain.slug}`}
      className="group block rounded-xl border-[1.5px] border-border-indigo bg-white brain-stripe-top shadow-brain transition-all hover:shadow-brain-hover hover:-translate-y-0.5"
    >
      <div className="p-6">
        {/* Status + price */}
        <div className="mb-4 flex items-center justify-between">
          <span
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold tracking-wide ${
              isLive
                ? "bg-[rgba(5,150,105,0.1)] text-success"
                : "bg-indigo-mist text-indigo-deep"
            }`}
          >
            {isLive ? "Live" : "Building"}
          </span>
          <span className="rounded-full bg-indigo-mist px-2 py-0.5 text-xs font-semibold text-indigo-deep">
            Free in Beta
          </span>
        </div>

        {/* Name + source */}
        <h3 className="font-display text-[22px] font-normal tracking-tight text-deep-ink leading-tight">
          {brain.name}
        </h3>
        <p className="mt-1 font-mono text-xs text-muted">{brain.source}</p>
        <p className="mt-3 text-sm leading-relaxed text-body">{brain.tagline}</p>

        {/* Stats */}
        {isLive && (
          <div className="mt-4 flex gap-4 text-xs text-muted">
            <span><strong className="text-label">{brain.atomCount}</strong> atoms</span>
            <span><strong className="text-label">{brain.connectionCount}</strong> connections</span>
            <span><strong className="text-label">{brain.clusterCount}</strong> clusters</span>
          </div>
        )}
        {!isLive && (
          <div className="mt-4 text-xs text-muted">
            <strong className="text-label">{brain.editionCount}+</strong> source documents queued
          </div>
        )}

        {/* Topics */}
        <div className="mt-4 flex flex-wrap gap-1.5">
          {brain.topics.slice(0, 4).map((t) => (
            <SkillBadge key={t} label={t} />
          ))}
          {brain.topics.length > 4 && (
            <span className="rounded-full bg-cool-surface px-2.5 py-0.5 text-[11px] font-medium text-muted">
              +{brain.topics.length - 4}
            </span>
          )}
        </div>

        {/* CTA hint */}
        <div className="mt-5 text-sm font-semibold text-brain-indigo group-hover:underline">
          {isLive ? "Explore this brain" : "View details"} &rarr;
        </div>
      </div>
    </Link>
  );
}

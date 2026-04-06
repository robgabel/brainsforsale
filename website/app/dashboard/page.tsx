import { createClient } from "@/lib/supabase-server";
import { BRAINS } from "@/lib/brains";
import Link from "next/link";
import { redirect } from "next/navigation";
import { SignOutButton } from "@/components/SignOutButton";

export const metadata = {
  title: "Dashboard — BrainsForSale",
};

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const { data: brainAccess } = await supabase
    .from("brain_access")
    .select("*")
    .eq("user_id", user.id)
    .order("acquired_at", { ascending: false });

  const ownedSlugs = new Set((brainAccess || []).map((b) => b.brain_slug));
  const ownedBrains = BRAINS.filter((b) => ownedSlugs.has(b.slug));
  const availableBrains = BRAINS.filter((b) => !ownedSlugs.has(b.slug));

  return (
    <>
      {/* Header */}
      <section className="px-6 pb-8 pt-16 md:pt-20">
        <div className="mx-auto max-w-[900px]">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-display text-3xl font-light tracking-[-1px] text-deep-ink md:text-4xl">
                {profile?.display_name ? `Hey, ${profile.display_name}` : "Your dashboard"}
              </h1>
              <p className="mt-1 text-sm text-muted">{user.email}</p>
            </div>
            <SignOutButton />
          </div>

          {profile?.is_founding_supporter && (
            <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-knowledge-gold/30 bg-gold-light px-3.5 py-1.5 text-xs font-semibold text-knowledge-gold">
              <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
              Founding Supporter
            </div>
          )}
        </div>
      </section>

      {/* My Brains */}
      <section className="px-6 pb-12">
        <div className="mx-auto max-w-[900px]">
          <h2 className="mb-6 font-display text-xl font-normal tracking-tight text-deep-ink">
            My Brains
          </h2>

          {ownedBrains.length === 0 ? (
            <div className="rounded-xl border border-border-default bg-cool-surface p-8 text-center">
              <p className="text-sm text-body">You haven&apos;t claimed any brains yet.</p>
              <Link
                href="/brains"
                className="mt-4 inline-block rounded-lg bg-brain-indigo px-5 py-2.5 text-sm font-semibold text-white shadow-brain-cta transition-all hover:bg-indigo-hover"
              >
                Browse brains
              </Link>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {ownedBrains.map((brain) => {
                const access = brainAccess?.find((a) => a.brain_slug === brain.slug);
                return (
                  <div
                    key={brain.slug}
                    className="rounded-xl border border-border-indigo bg-white p-5 shadow-brain brain-stripe-top"
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="font-display text-lg font-normal text-deep-ink">{brain.name}</h3>
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                        brain.status === "live"
                          ? "bg-[rgba(5,150,105,0.1)] text-success"
                          : "bg-indigo-mist text-indigo-deep"
                      }`}>
                        {brain.status === "live" ? "Live" : "Building"}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-muted">{brain.source}</p>
                    {access && (
                      <p className="mt-2 text-[10px] text-muted">
                        Claimed {new Date(access.acquired_at).toLocaleDateString()}
                      </p>
                    )}
                    {brain.status === "live" && (
                      <div className="mt-3 rounded-lg bg-deep-ink px-3 py-2 font-mono text-xs text-success">
                        $ npx skills add brainsforsale/{brain.slug}
                      </div>
                    )}
                    <Link
                      href={`/brains/${brain.slug}`}
                      className="mt-3 block text-center text-sm font-medium text-brain-indigo hover:underline"
                    >
                      Explore &rarr;
                    </Link>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Available Brains */}
      {availableBrains.length > 0 && (
        <section className="bg-warm-paper px-6 py-12">
          <div className="mx-auto max-w-[900px]">
            <h2 className="mb-6 font-display text-xl font-normal tracking-tight text-deep-ink">
              Available Brains
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {availableBrains.map((brain) => (
                <div
                  key={brain.slug}
                  className="rounded-xl border border-border-default bg-white p-5 shadow-brain"
                >
                  <h3 className="font-display text-lg font-normal text-deep-ink">{brain.name}</h3>
                  <p className="mt-1 text-xs text-body">{brain.tagline}</p>
                  <div className="mt-3 flex items-center gap-2">
                    <span className="text-sm text-muted line-through">${brain.price}</span>
                    <span className="rounded-full bg-indigo-mist px-2 py-0.5 text-[10px] font-semibold text-indigo-deep">
                      Free in Beta
                    </span>
                  </div>
                  <Link
                    href={`/brains/${brain.slug}`}
                    className="mt-4 block rounded-lg bg-brain-indigo py-2.5 text-center text-sm font-semibold text-white shadow-brain-cta transition-all hover:bg-indigo-hover"
                  >
                    Get this brain
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}

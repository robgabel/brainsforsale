"use client";

import { createClient } from "@/lib/supabase-browser";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export function GetBrainButton({ brainSlug }: { brainSlug: string }) {
  const supabase = createClient();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [owned, setOwned] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    async function checkAccess() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setChecking(false);
        return;
      }
      const { data } = await supabase
        .from("brain_access")
        .select("id")
        .eq("user_id", user.id)
        .eq("brain_slug", brainSlug)
        .maybeSingle();
      setOwned(!!data);
      setChecking(false);
    }
    checkAccess();
  }, [brainSlug, supabase]);

  async function handleClaim() {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      router.push(`/login?redirect=/brains/${brainSlug}`);
      return;
    }

    const { error } = await supabase
      .from("brain_access")
      .insert({ user_id: user.id, brain_slug: brainSlug });

    if (error && error.code === "23505") {
      // Already owned (duplicate key)
      setOwned(true);
    } else if (error) {
      console.error("Failed to claim brain:", error);
    } else {
      setOwned(true);
    }
    setLoading(false);
  }

  if (checking) {
    return (
      <button
        disabled
        className="w-full rounded-lg bg-brain-indigo/60 py-3 text-[15px] font-semibold text-white"
      >
        ...
      </button>
    );
  }

  if (owned) {
    return (
      <div className="space-y-2">
        <button
          onClick={() => router.push("/dashboard")}
          className="w-full rounded-lg border border-border-indigo bg-indigo-mist py-3 text-[15px] font-semibold text-indigo-deep transition-all hover:bg-brain-indigo hover:text-white"
        >
          In your collection
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={handleClaim}
      disabled={loading}
      className="w-full rounded-lg bg-brain-indigo py-3 text-[15px] font-semibold text-white shadow-brain-cta transition-all hover:bg-indigo-hover active:scale-[0.98] disabled:opacity-60"
    >
      {loading ? "Claiming..." : "Get this brain"}
    </button>
  );
}

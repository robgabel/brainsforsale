"use client";

import { createClient } from "@/lib/supabase-browser";
import { useState, useEffect } from "react";

interface BrainRequest {
  id: string;
  thinker_name: string;
  vote_count: number;
}

export function RequestBrainForm() {
  const supabase = createClient();
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [topRequests, setTopRequests] = useState<BrainRequest[]>([]);

  useEffect(() => {
    loadTopRequests();
  }, []);

  async function loadTopRequests() {
    const { data } = await supabase
      .from("brain_requests")
      .select("id, thinker_name, vote_count")
      .order("vote_count", { ascending: false })
      .limit(8);
    if (data) setTopRequests(data);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setLoading(true);
    setMessage(null);

    const { data: { user } } = await supabase.auth.getUser();

    // Try to find existing request (case-insensitive)
    const { data: existing } = await supabase
      .from("brain_requests")
      .select("id, vote_count")
      .ilike("thinker_name", name.trim())
      .maybeSingle();

    if (existing) {
      // Vote for existing
      if (user) {
        const { error: voteError } = await supabase
          .from("brain_request_votes")
          .insert({ request_id: existing.id, user_id: user.id });

        if (voteError && voteError.code === "23505") {
          setMessage("You already voted for this brain!");
        } else if (!voteError) {
          await supabase
            .from("brain_requests")
            .update({ vote_count: existing.vote_count + 1 })
            .eq("id", existing.id);
          setMessage("Vote counted! Thanks for the support.");
        }
      } else {
        setMessage("Sign in to vote for this brain request.");
      }
    } else {
      // Create new request
      const { error } = await supabase
        .from("brain_requests")
        .insert({
          thinker_name: name.trim(),
          requested_by: user?.id || null,
        });

      if (error) {
        if (error.code === "42501") {
          setMessage("Sign in to request a brain.");
        } else {
          setMessage("Something went wrong. Try again.");
        }
      } else {
        setMessage("Brain requested! We'll build it when it hits 50 votes.");
      }
    }

    setName("");
    setLoading(false);
    loadTopRequests();
  }

  async function handleVote(request: BrainRequest) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setMessage("Sign in to vote.");
      return;
    }

    const { error } = await supabase
      .from("brain_request_votes")
      .insert({ request_id: request.id, user_id: user.id });

    if (error && error.code === "23505") {
      setMessage("You already voted for this one!");
    } else if (!error) {
      await supabase
        .from("brain_requests")
        .update({ vote_count: request.vote_count + 1 })
        .eq("id", request.id);
      setMessage(`Voted for ${request.thinker_name}!`);
      loadTopRequests();
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className="flex gap-3">
        <input
          type="text"
          placeholder="e.g. Naval Ravikant, Brene Brown, Ray Dalio..."
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="flex-1 rounded-lg border border-border-default bg-white px-4 py-3 text-sm text-deep-ink placeholder-muted outline-none transition-all focus:border-brain-indigo focus:ring-[3px] focus:ring-brain-indigo/20"
        />
        <button
          type="submit"
          disabled={loading || !name.trim()}
          className="rounded-lg bg-brain-indigo px-5 py-3 text-sm font-semibold text-white shadow-brain-cta transition-all hover:bg-indigo-hover active:scale-[0.98] disabled:opacity-60"
        >
          {loading ? "..." : "Request"}
        </button>
      </form>

      {message && (
        <p className="mt-3 text-sm font-medium text-brain-indigo">{message}</p>
      )}

      <div className="mt-4 flex flex-wrap justify-center gap-2">
        {topRequests.length > 0
          ? topRequests.map((req) => (
              <button
                key={req.id}
                onClick={() => handleVote(req)}
                className="group flex items-center gap-1.5 rounded-full border border-border-default bg-cool-surface px-3 py-1 text-xs text-label transition-all hover:border-border-indigo hover:bg-indigo-mist"
              >
                {req.thinker_name}
                <span className="rounded-full bg-white px-1.5 py-0.5 text-[10px] font-semibold text-brain-indigo group-hover:bg-brain-indigo group-hover:text-white">
                  {req.vote_count}
                </span>
              </button>
            ))
          : ["Scott Galloway", "Naval Ravikant", "Marc Andreessen", "Brene Brown", "Malcolm Gladwell"].map((n) => (
              <span
                key={n}
                className="rounded-full border border-border-default bg-cool-surface px-3 py-1 text-xs text-label"
              >
                {n}
              </span>
            ))}
      </div>
    </div>
  );
}

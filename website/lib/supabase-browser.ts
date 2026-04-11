import { createBrowserClient } from "@supabase/ssr";

type SupabaseBrowserClient = ReturnType<typeof createBrowserClient>;

/**
 * Returns a Supabase browser client.
 *
 * Safe to call from the top of a "use client" component body: during
 * server-side prerender (next build / SSG), this returns a Proxy stub that
 * defers construction. All real Supabase usage in our components happens
 * inside useEffect or event handlers (browser-only), so the stub is never
 * actually touched during prerender — it just lets the component body
 * execute without crashing if env vars are missing at build time.
 *
 * In the browser, returns a real client. Env vars are required; if they
 * are missing the constructor will throw with a clear Supabase error.
 */
export function createClient(): SupabaseBrowserClient {
  if (typeof window === "undefined") {
    return new Proxy({} as SupabaseBrowserClient, {
      get() {
        throw new Error(
          "Supabase browser client was accessed during server-side render. " +
            "Move the call into useEffect or an event handler."
        );
      },
    });
  }

  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

"use client";

export function SignOutButton() {
  return (
    <form action="/auth/signout" method="POST">
      <button
        type="submit"
        className="rounded-lg border border-border-default px-4 py-2 text-sm font-medium text-body transition-all hover:border-border-indigo hover:text-deep-ink"
      >
        Sign out
      </button>
    </form>
  );
}

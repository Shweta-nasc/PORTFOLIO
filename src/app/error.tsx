"use client";

import { useEffect } from "react";

/**
 * Route-level error UI. Next.js renders this if a Server/Client Component in
 * the route throws during render — instead of a blank or stuck screen the
 * visitor gets a recoverable message with a retry.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-5 px-6 text-center">
      <div>
        <h1 className="font-display text-2xl font-bold">Something went wrong</h1>
        <p className="mt-2 max-w-sm text-sm text-muted-foreground">
          A part of the page failed to load. Try again — this only reloads the
          affected view.
        </p>
      </div>
      <button
        type="button"
        onClick={reset}
        className="rounded-full bg-gradient-to-r from-ember-from to-ember-to px-5 py-2.5 text-sm font-medium text-white shadow-glow transition-all hover:brightness-110"
      >
        Try again
      </button>
    </div>
  );
}

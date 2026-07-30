/**
 * Small fetch helper shared by the coding-stats services.
 * - Honors an external AbortSignal (so React can cancel on unmount).
 * - Adds a per-request timeout so a hung upstream can't leave a card spinning.
 * - Throws a readable Error on non-2xx so the UI can show a graceful message.
 */

const DEFAULT_TIMEOUT = 9000;

/** Combine an optional caller signal with a timeout signal. */
function withTimeout(ms: number, signal?: AbortSignal): AbortSignal {
  const timeout = AbortSignal.timeout(ms);
  if (!signal) return timeout;
  // AbortSignal.any short-circuits on whichever aborts first.
  if (typeof AbortSignal.any === "function") return AbortSignal.any([signal, timeout]);
  return signal;
}

export async function fetchJson<T>(
  url: string,
  signal?: AbortSignal,
  init?: RequestInit,
): Promise<T> {
  const res = await fetch(url, {
    ...init,
    signal: withTimeout(DEFAULT_TIMEOUT, signal),
    headers: { Accept: "application/json", ...init?.headers },
  });
  if (!res.ok) {
    throw new Error(`Request to ${new URL(url, "http://x").pathname} failed (${res.status})`);
  }
  return (await res.json()) as T;
}

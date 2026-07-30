"use client";

import { useEffect, useState } from "react";

export type AsyncStatus = "loading" | "success" | "error";

export interface AsyncState<T> {
  status: AsyncStatus;
  data?: T;
  error?: string;
}

/**
 * Runs an async function on mount (and whenever `deps` change), exposing a
 * `{ status, data, error }` state. The in-flight request is aborted on unmount
 * or when deps change, so a slow response can't set state on a dead component.
 */
export function useAsync<T>(
  fn: (signal: AbortSignal) => Promise<T>,
  deps: unknown[],
): AsyncState<T> {
  const [state, setState] = useState<AsyncState<T>>({ status: "loading" });

  useEffect(() => {
    const controller = new AbortController();
    let active = true;
    setState({ status: "loading" });

    fn(controller.signal)
      .then((data) => {
        if (active) setState({ status: "success", data });
      })
      .catch((err: unknown) => {
        if (!active) return;
        if (err instanceof Error && err.name === "AbortError") return;
        const message = err instanceof Error ? err.message : "Something went wrong";
        setState({ status: "error", error: message });
      });

    return () => {
      active = false;
      controller.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return state;
}

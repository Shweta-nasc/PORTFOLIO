"use client";

import { Component, type ErrorInfo, type ReactNode } from "react";

interface Props {
  children: ReactNode;
  /** Rendered instead of the children when they throw. Defaults to nothing. */
  fallback?: ReactNode;
  /** Label used in dev console diagnostics. */
  name?: string;
}

interface State {
  hasError: boolean;
}

/**
 * Client-side error boundary for heavy / optional sections — chiefly the WebGL
 * 3D scenes. If a wrapped section throws while rendering or mounting, it is
 * contained here and an optional fallback is shown, so one failing section
 * never blanks or freezes the whole page.
 *
 * (Note: errors thrown inside an R3F render loop run outside React and aren't
 * caught here — but mount/setup errors, the common failure mode, are.)
 */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    if (process.env.NODE_ENV !== "production") {
      // eslint-disable-next-line no-console
      console.error(
        `[ErrorBoundary${this.props.name ? `: ${this.props.name}` : ""}]`,
        error,
        info.componentStack,
      );
    }
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback ?? null;
    }
    return this.props.children;
  }
}

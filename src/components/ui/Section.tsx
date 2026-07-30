import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SectionProps {
  id: string;
  children: ReactNode;
  className?: string;
  /** Extra vertical rhythm control. */
  spacing?: "default" | "tight" | "loose";
}

const spacingMap = {
  tight: "py-16 sm:py-20",
  default: "py-20 sm:py-28",
  loose: "py-24 sm:py-36",
};

export function Section({
  id,
  children,
  className,
  spacing = "default",
}: SectionProps) {
  return (
    <section
      id={id}
      className={cn(
        "relative scroll-mt-24 section-padding",
        spacingMap[spacing],
        className,
      )}
    >
      <div className="container-max">{children}</div>
    </section>
  );
}

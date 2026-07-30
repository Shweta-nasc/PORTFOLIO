import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface BadgeProps {
  children: ReactNode;
  className?: string;
  variant?: "default" | "accent" | "outline";
}

const variants = {
  default: "bg-white/[0.06] text-muted-foreground border-white/10",
  accent: "bg-accent/12 text-accent border-accent/25",
  outline: "bg-transparent text-foreground/80 border-white/15",
};

export function Badge({ children, className, variant = "default" }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium tracking-tight backdrop-blur-sm",
        variants[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}

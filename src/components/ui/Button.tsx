"use client";

import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "outline" | "ghost";
type Size = "sm" | "md" | "lg";

interface BaseProps {
  variant?: Variant;
  size?: Size;
  icon?: ReactNode;
  iconRight?: ReactNode;
  className?: string;
  children: ReactNode;
}

const base =
  "group relative inline-flex items-center justify-center gap-2 rounded-full font-medium tracking-tight transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50";

const variants: Record<Variant, string> = {
  primary:
    "bg-gradient-to-r from-ember-from to-ember-to text-white shadow-glow hover:shadow-glow-lg hover:brightness-110",
  outline:
    "border border-white/15 bg-white/[0.03] text-foreground backdrop-blur-md hover:border-accent/60 hover:bg-white/[0.06]",
  ghost: "text-muted-foreground hover:text-foreground hover:bg-white/[0.05]",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-6 text-sm",
  lg: "h-[3.25rem] px-8 text-base",
};

function Inner({ icon, iconRight, children }: Pick<BaseProps, "icon" | "iconRight" | "children">) {
  return (
    <>
      {icon && <span className="transition-transform duration-300 group-hover:-translate-x-0.5">{icon}</span>}
      <span>{children}</span>
      {iconRight && (
        <span className="transition-transform duration-300 group-hover:translate-x-0.5">
          {iconRight}
        </span>
      )}
    </>
  );
}

type ButtonProps = BaseProps & ButtonHTMLAttributes<HTMLButtonElement>;

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = "primary", size = "md", icon, iconRight, className, children, ...props },
  ref,
) {
  return (
    <button ref={ref} className={cn(base, variants[variant], sizes[size], className)} {...props}>
      <Inner icon={icon} iconRight={iconRight}>
        {children}
      </Inner>
    </button>
  );
});

interface LinkButtonProps extends BaseProps {
  href: string;
  external?: boolean;
  download?: boolean;
  ariaLabel?: string;
}

export function LinkButton({
  href,
  external,
  download,
  variant = "primary",
  size = "md",
  icon,
  iconRight,
  className,
  children,
  ariaLabel,
}: LinkButtonProps) {
  return (
    <a
      href={href}
      aria-label={ariaLabel}
      download={download}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className={cn(base, variants[variant], sizes[size], className)}
    >
      <Inner icon={icon} iconRight={iconRight}>
        {children}
      </Inner>
    </a>
  );
}

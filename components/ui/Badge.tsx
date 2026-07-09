import { type ReactNode, type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type BadgeVariant = "primary" | "gold" | "neutral";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  children: ReactNode;
}

const variantStyles: Record<BadgeVariant, string> = {
  primary: "bg-primary/10 text-primary border border-primary/20",
  gold: "bg-gold/15 text-primary-dark border border-gold/30",
  neutral: "bg-cream-dark text-slate-light border border-border",
};

export function Badge({
  variant = "primary",
  className,
  children,
  ...props
}: BadgeProps): ReactNode {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-sans font-semibold uppercase tracking-wider",
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
"use client";

import { forwardRef, type ButtonHTMLAttributes } from "react";
import { motion, type HTMLMotionProps } from "motion/react";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

// 1. On crée un type qui contient tous les attributs de bouton SAUF les événements
// qui entrent en conflit avec motion (onAnimationStart, onDrag, etc.)
type ButtonAttributes = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "onAnimationStart" | "onDrag" | "onDragStart" | "onDragEnd" | "onDragEnter" | "onDragLeave" | "onDragOver"
>;

interface ButtonProps extends ButtonAttributes {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: "bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-dark)] border border-[var(--color-primary)]",
  secondary: "bg-[var(--color-gold)] text-black hover:bg-[var(--color-gold-light)] border border-[var(--color-gold)]",
  outline: "bg-transparent text-[var(--color-primary)] border border-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white",
  ghost: "bg-transparent text-[var(--color-slate)] border border-transparent hover:bg-[var(--color-cream-dark)]",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "px-4 py-2 text-sm",
  md: "px-6 py-3 text-base",
  lg: "px-8 py-4 text-lg",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", isLoading = false, disabled, children, ...props }, ref) => {
    
    // 2. On type explicitement motion.button avec HTMLMotionProps<"button">
    return (
      <motion.button
        ref={ref}
        whileHover={{ y: -2 }}
        whileTap={{ y: 0, scale: 0.98 }}
        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
        disabled={disabled || isLoading}
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-lg font-sans font-medium tracking-wide transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-50",
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        {...(props as HTMLMotionProps<"button">)} // 3. Cast forcé pour rassurer TypeScript
      >
        {isLoading ? (
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        ) : null}
        {children}
      </motion.button>
    );
  }
);

Button.displayName = "Button";
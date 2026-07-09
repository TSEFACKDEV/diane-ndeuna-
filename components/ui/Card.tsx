"use client";

import { type ReactNode, type HTMLAttributes } from "react";
import { motion, type HTMLMotionProps } from "motion/react";
import { cn } from "@/lib/utils";

type CardVariant = "default" | "elevated" | "bordered";

// On exclut les événements qui entrent en conflit avec motion/react
type CardBaseProps = Omit<
  HTMLAttributes<HTMLDivElement>, 
  "onAnimationStart" | "onDrag" | "onDragStart" | "onDragEnd" | "onDragEnter" | "onDragLeave" | "onDragOver"
>;

interface CardProps extends CardBaseProps {
  variant?: CardVariant;
  children: ReactNode;
  hoverable?: boolean;
}

const variantStyles: Record<CardVariant, string> = {
  default: "bg-white shadow-[var(--shadow-card)]",
  elevated: "bg-white shadow-[var(--shadow-card-hover)]",
  bordered: "bg-white border border-[var(--color-border)]",
};

export function Card({
  variant = "default",
  hoverable = true,
  className,
  children,
  ...props
}: CardProps): ReactNode {
  return (
    <motion.div
      whileHover={
        hoverable
          ? { y: -6, boxShadow: "0 16px 40px rgba(107,30,60,0.15)" }
          : undefined
      }
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "rounded-xl p-6 md:p-8",
        variantStyles[variant],
        className
      )}
      // Cast forcé vers HTMLMotionProps pour résoudre les conflits de types
      {...(props as HTMLMotionProps<"div">)}
    >
      {children}
    </motion.div>
  );
}
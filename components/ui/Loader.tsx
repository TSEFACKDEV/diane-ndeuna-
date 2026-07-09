"use client";

import { type ReactNode } from "react";
import { motion } from "motion/react";

interface LoaderProps {
  size?: "sm" | "md" | "lg";
  fullScreen?: boolean;
}

const sizeMap: Record<NonNullable<LoaderProps["size"]>, string> = {
  sm: "h-5 w-5 border-2",
  md: "h-8 w-8 border-3",
  lg: "h-12 w-12 border-4",
};

export function Loader({ size = "md", fullScreen = false }: LoaderProps): ReactNode {
  const spinner = (
    <motion.span
      animate={{ rotate: 360 }}
      transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
      className={`inline-block rounded-full border-gold border-t-transparent ${sizeMap[size]}`}
    />
  );

  if (fullScreen) {
    return (
      <div className="flex min-h-[50vh] w-full items-center justify-center">
        {spinner}
      </div>
    );
  }

  return spinner;
}
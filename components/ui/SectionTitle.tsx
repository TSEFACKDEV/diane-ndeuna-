"use client";

import { type ReactNode } from "react";
import { motion } from "motion/react";

interface SectionTitleProps {
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  light?: boolean;
}

export function SectionTitle({
  title,
  subtitle,
  align = "center",
  light = false,
}: SectionTitleProps): ReactNode {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className={align === "center" ? "text-center" : "text-left"}
    >
      {subtitle ? (
        <p
          className={`mb-3 font-sans text-sm font-semibold uppercase tracking-[0.2em] ${
            light ? "text-gold-light" : "text-gold"
          }`}
        >
          {subtitle}
        </p>
      ) : null}
      <h2
        className={`font-serif text-3xl font-semibold md:text-4xl lg:text-5xl ${
          light ? "text-white" : "text-black"
        }`}
      >
        {title}
      </h2>
      <div
        className={`mt-5 h-px w-16 bg-gold ${
          align === "center" ? "mx-auto" : ""
        }`}
      />
    </motion.div>
  );
}
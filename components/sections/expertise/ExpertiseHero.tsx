"use client";

import { type ReactNode } from "react";
import { motion } from "motion/react";
import { Link } from "@/i18n/navigation";
import { IoArrowBack } from "react-icons/io5";

interface ExpertiseHeroProps {
  eyebrow: string;
  title: string;
  description: string;
  icon: ReactNode;
  backLabel: string;
}

export function ExpertiseHero({
  eyebrow,
  title,
  description,
  icon,
  backLabel,
}: ExpertiseHeroProps): ReactNode {
  return (
    <section className="bg-primary-dark pt-32 pb-20 md:pt-44 md:pb-28">
      <div className="container-site">
        <Link
          href="/expertise"
          className="inline-flex items-center gap-2 font-sans text-sm font-medium text-cream/70 transition-colors hover:text-white"
        >
          <IoArrowBack size={14} />
          {backLabel}
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mt-8 max-w-3xl"
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-gold/15">
            {icon}
          </div>
          <p className="mt-6 font-sans text-sm font-semibold uppercase tracking-[0.2em] text-gold-light">
            {eyebrow}
          </p>
          <h1 className="mt-3 font-serif text-3xl font-semibold text-white md:text-4xl lg:text-5xl">
            {title}
          </h1>
          <p className="mt-5 font-body text-base leading-relaxed text-cream/80 md:text-lg">
            {description}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
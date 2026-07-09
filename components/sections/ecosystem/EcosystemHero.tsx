"use client";

import { type ReactNode } from "react";
import { motion } from "motion/react";
import { Link } from "@/i18n/navigation";
import { ImageSlot } from "@/components/ui/ImageSlot";
import { BrochureDownloadButton } from "@/components/sections/ecosystem/BrochureDownloadButton";
import { IoArrowBack } from "react-icons/io5";

interface EcosystemHeroProps {
  code: string;
  logoFile: string;
  name: string;
  slogan?: string;
  description: string;
  backLabel: string;
}

export function EcosystemHero({
  code,
  logoFile,
  name,
  slogan,
  description,
  backLabel,
}: EcosystemHeroProps): ReactNode {
  return (
    <section className="bg-primary-dark pt-32 pb-20 md:pt-44 md:pb-28">
      <div className="container-site">
        <Link
          href="/ecosysteme"
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
          <div className="relative h-16 w-40 rounded-lg bg-white/95 p-3">
            {/* IMAGE ATTENDUE : public/images/logo-{entite}.png */}
            <ImageSlot
              src={logoFile}
              alt={name}
              fill
              sizes="160px"
              expectedFile={logoFile}
              className="object-contain p-1"
            />
          </div>

          <h1 className="mt-6 font-serif text-3xl font-semibold text-white md:text-4xl lg:text-5xl">
            {name}
          </h1>
          {slogan ? (
            <p className="text-accent mt-3 text-xl text-gold-light">{slogan}</p>
          ) : null}
          <p className="mt-5 font-body text-base leading-relaxed text-cream/80 md:text-lg">
            {description}
          </p>

          <div className="mt-8">
            <BrochureDownloadButton code={code} />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
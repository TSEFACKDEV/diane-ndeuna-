"use client";

import { type ReactNode } from "react";
import { useTranslations } from "next-intl";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { ImageSlot } from "@/components/ui/ImageSlot";
import { Badge } from "@/components/ui/Badge";
import { FaLanguage, FaEarthAfrica } from "react-icons/fa6";

export function BioSection(): ReactNode {
  const t = useTranslations("about.bio");

  return (
    <section className="relative overflow-hidden bg-cream pt-32 pb-16 md:pt-44 md:pb-24">
      <div className="container-site grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">
        <AnimatedSection>
          <p className="font-sans text-sm font-semibold uppercase tracking-[0.2em] text-gold">
            {t("eyebrow")}
          </p>
          <h1 className="mt-3 font-serif text-3xl font-semibold text-black md:text-4xl lg:text-5xl">
            {t("title")}
          </h1>
          <p className="text-accent mt-6 text-xl text-primary">
            {t("summary")}
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Badge variant="gold">{t("badges.experience")}</Badge>
            <Badge variant="primary">{t("badges.eden")}</Badge>
            <Badge variant="neutral">{t("badges.movement")}</Badge>
          </div>

          <p className="mt-6 font-body text-base leading-relaxed text-slate-light">
            {t("paragraph1")}
          </p>
          <p className="mt-4 font-body text-base leading-relaxed text-slate-light">
            {t("paragraph2")}
          </p>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="flex items-center gap-2 text-slate">
              <FaLanguage size={18} className="text-gold" />
              <span className="font-sans text-sm font-medium">{t("languages")}</span>
            </div>
            <div className="flex items-center gap-2 text-slate">
              <FaEarthAfrica size={18} className="text-gold" />
              <span className="font-sans text-sm font-medium">{t("experience")}</span>
            </div>
          </div>
        </AnimatedSection>

        <AnimatedSection delay={0.15} className="relative mx-auto aspect-[4/5] w-full max-w-md">
          {/* IMAGE ATTENDUE : public/images/portrait-diane-ndeuna.jpg — Remplacer ce fichier pour afficher l'image */}
          <div className="absolute -inset-3 rounded-xl border border-gold/40" />
          <div className="relative h-full w-full overflow-hidden rounded-xl shadow-[var(--shadow-card-hover)]">
            <ImageSlot
              src="/images/portrait-diane-ndeuna.jpg"
              alt="Portrait de Diane NDEUNA"
              fill
              sizes="(max-width: 768px) 90vw, 480px"
              expectedFile="public/images/portrait-diane-ndeuna.jpg"
            />
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
"use client";

import { type ReactNode } from "react";
import { useTranslations } from "next-intl";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { ImageSlot } from "@/components/ui/ImageSlot";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Link } from "@/i18n/navigation";
import { FaCalendarDays } from "react-icons/fa6";

export function MediasSection(): ReactNode {
  const t = useTranslations("about.medias");

  return (
    <section className="section-padding bg-primary-dark">
      <div className="container-site grid gap-12 lg:grid-cols-2 lg:items-center">
        <AnimatedSection className="relative aspect-[16/10] w-full overflow-hidden rounded-xl shadow-[var(--shadow-card-hover)]">
          {/* IMAGE ATTENDUE : public/images/medias-diane-ndeuna.jpg — Remplacer ce fichier pour afficher l'image */}
          <ImageSlot
            src="/images/medias-diane-ndeuna.jpg"
            alt="Diane NDEUNA dans les médias"
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            expectedFile="public/images/medias-diane-ndeuna.jpg"
          />
        </AnimatedSection>

        <AnimatedSection delay={0.15}>
          <p className="font-sans text-sm font-semibold uppercase tracking-[0.2em] text-gold-light">
            {t("eyebrow")}
          </p>
          <h2 className="mt-3 font-serif text-3xl font-semibold text-white md:text-4xl">
            {t("title")}
          </h2>
          <p className="mt-5 font-body text-base leading-relaxed text-cream/80">
            {t("description")}
          </p>

          <div className="mt-7 flex items-start gap-3 rounded-xl bg-white/5 p-5">
            <FaCalendarDays size={20} className="mt-0.5 shrink-0 text-gold" />
            <div>
              <p className="font-sans text-sm font-semibold text-white">
                {t("upcomingEvent.title")}
              </p>
              <p className="mt-1 font-body text-sm text-cream/70">
                {t("upcomingEvent.date")}
              </p>
            </div>
          </div>

          <div className="mt-7 flex flex-wrap gap-3">
            <Badge variant="gold">LinkedIn</Badge>
            <Badge variant="gold">Facebook</Badge>
            <Badge variant="gold">YouTube</Badge>
          </div>

          <div className="mt-8">
            <Link href="/evenements/calendrier">
              <Button variant="secondary">{t("cta")}</Button>
            </Link>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
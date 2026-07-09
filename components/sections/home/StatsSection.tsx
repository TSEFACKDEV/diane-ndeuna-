"use client";

import { type ReactNode } from "react";
import { useTranslations } from "next-intl";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { StatCounter } from "@/components/ui/StatCounter";

const stats: { end: number; suffix: string; key: string }[] = [
  { end: 200, suffix: "+", key: "organizations" },
  { end: 85, suffix: "%", key: "sustainability" },
  { end: 2000, suffix: "+", key: "women" },
  { end: 50, suffix: "+", key: "partners" },
];

export function StatsSection(): ReactNode {
  const t = useTranslations("home.stats");

  return (
    <section className="section-padding bg-primary">
      <div className="container-site">
        <AnimatedSection className="mb-12 text-center">
          <p className="font-sans text-sm font-semibold uppercase tracking-[0.2em] text-gold-light">
            {t("eyebrow")}
          </p>
          <h2 className="mt-3 font-serif text-3xl font-semibold text-white md:text-4xl">
            {t("title")}
          </h2>
        </AnimatedSection>

        <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.key} className="rounded-xl bg-white/5 p-6 backdrop-blur-sm">
              <StatCounter
                end={stat.end}
                suffix={stat.suffix}
                label={t(`labels.${stat.key}`)}
                light
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
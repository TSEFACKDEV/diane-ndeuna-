"use client";

import { type ReactNode } from "react";
import { useTranslations } from "next-intl";
import { AnimatedSection, AnimatedItem } from "@/components/ui/AnimatedSection";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { timelineEntries } from "@/lib/data/about";

export function TimelineSection(): ReactNode {
  const t = useTranslations("about.timeline");

  return (
    <section className="section-padding bg-white">
      <div className="container-site">
        <SectionTitle subtitle={t("eyebrow")} title={t("title")} />

        <AnimatedSection stagger className="relative mt-16 max-w-3xl mx-auto">
          <div className="absolute left-[19px] top-2 bottom-2 w-px bg-border md:left-1/2" />

          <div className="space-y-10">
            {timelineEntries.map(({ id, icon: Icon }, index) => (
              <AnimatedItem key={id}>
                <div
                  className={`relative flex gap-6 md:gap-0 ${
                    index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                  }`}
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary text-white shadow-[var(--shadow-card)] md:absolute md:left-1/2 md:-translate-x-1/2">
                    <Icon size={18} />
                  </div>

                  <div
                    className={`flex-1 md:w-[calc(50%-2.5rem)] ${
                      index % 2 === 0 ? "md:pr-12 md:text-right" : "md:pl-12 md:ml-auto"
                    }`}
                  >
                    <p className="font-sans text-xs font-semibold uppercase tracking-wider text-gold">
                      {t(`items.${id}.period`)}
                    </p>
                    <p className="mt-1 font-serif text-lg font-semibold text-black">
                      {t(`items.${id}.title`)}
                    </p>
                    <p className="mt-2 font-body text-sm leading-relaxed text-slate-light">
                      {t(`items.${id}.description`)}
                    </p>
                  </div>
                </div>
              </AnimatedItem>
            ))}
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
"use client";

import { type ReactNode } from "react";
import { useTranslations } from "next-intl";
import { AnimatedSection, AnimatedItem } from "@/components/ui/AnimatedSection";
import { Card } from "@/components/ui/Card";
import {
  FaScaleBalanced,
  FaHandsHolding,
  FaShieldHeart,
  FaSeedling,
} from "react-icons/fa6";
import type { IconType } from "react-icons";

const valueIcons: IconType[] = [FaScaleBalanced, FaHandsHolding, FaShieldHeart, FaSeedling];

export function VisionValuesSection(): ReactNode {
  const t = useTranslations("home.values");
  const valueKeys = ["excellence", "solidarity", "integrity", "legacy"] as const;

  return (
    <section className="section-padding bg-cream">
      <div className="container-site">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <AnimatedSection>
            <p className="mb-4 font-sans text-sm font-semibold uppercase tracking-[0.2em] text-gold">
              {t("eyebrow")}
            </p>
            <h2 className="font-serif text-3xl font-semibold text-black md:text-4xl">
              {t("title")}
            </h2>
            <p className="text-accent mt-6 text-xl text-primary">
              {t("visionQuote")}
            </p>
            <p className="mt-6 font-body text-base leading-relaxed text-slate-light">
              {t("description")}
            </p>
          </AnimatedSection>

          <AnimatedSection stagger className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            {valueKeys.map((key, index) => {
              const Icon = valueIcons[index];
              return (
                <AnimatedItem key={key}>
                  <Card variant="bordered" className="h-full">
                    {Icon ? <Icon size={28} className="text-gold" /> : null}
                    <p className="mt-4 font-serif text-lg font-semibold text-black">
                      {t(`items.${key}.title`)}
                    </p>
                    <p className="mt-2 font-body text-sm leading-relaxed text-slate-light">
                      {t(`items.${key}.description`)}
                    </p>
                  </Card>
                </AnimatedItem>
              );
            })}
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}
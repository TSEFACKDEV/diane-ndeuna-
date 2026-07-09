"use client";

import { type ReactNode } from "react";
import { useTranslations } from "next-intl";
import { AnimatedSection, AnimatedItem } from "@/components/ui/AnimatedSection";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { StatCounter } from "@/components/ui/StatCounter";
import { Card } from "@/components/ui/Card";
import { majorActionsKeys } from "@/lib/data/about";
import {
  FaUsersGear,
  FaCoins,
  FaBullhorn,
  FaCircleNodes,
} from "react-icons/fa6";
import type { IconType } from "react-icons";

const actionIcons: Record<(typeof majorActionsKeys)[number], IconType> = {
  governance: FaUsersGear,
  financing: FaCoins,
  advocacy: FaBullhorn,
  networks: FaCircleNodes,
};

const stats: { end: number; suffix: string; key: string }[] = [
  { end: 200, suffix: "+", key: "organizations" },
  { end: 85, suffix: "%", key: "sustainability" },
  { end: 2000, suffix: "+", key: "women" },
  { end: 50, suffix: "+", key: "partners" },
];

export function ImpactsSection(): ReactNode {
  const t = useTranslations("about.impacts");

  return (
    <section className="section-padding bg-cream-dark">
      <div className="container-site">
        <SectionTitle subtitle={t("eyebrow")} title={t("title")} />

        <div className="mt-14 grid grid-cols-2 gap-8 rounded-xl bg-white p-8 shadow-[var(--shadow-card)] lg:grid-cols-4">
          {stats.map((stat) => (
            <StatCounter
              key={stat.key}
              end={stat.end}
              suffix={stat.suffix}
              label={t(`stats.${stat.key}`)}
            />
          ))}
        </div>

        <AnimatedSection stagger className="mt-12 grid gap-6 sm:grid-cols-2">
          {majorActionsKeys.map((key) => {
            const Icon = actionIcons[key];
            return (
              <AnimatedItem key={key}>
                <Card variant="bordered" className="flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <Icon size={20} className="text-primary" />
                  </div>
                  <div>
                    <p className="font-serif text-lg font-semibold text-black">
                      {t(`actions.${key}.title`)}
                    </p>
                    <p className="mt-2 font-body text-sm leading-relaxed text-slate-light">
                      {t(`actions.${key}.description`)}
                    </p>
                  </div>
                </Card>
              </AnimatedItem>
            );
          })}
        </AnimatedSection>
      </div>
    </section>
  );
}
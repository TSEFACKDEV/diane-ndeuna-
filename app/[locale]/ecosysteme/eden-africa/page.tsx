import { type ReactNode } from "react";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { EcosystemHero } from "@/components/sections/ecosystem/EcosystemHero";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { Badge } from "@/components/ui/Badge";
import { StatCounter } from "@/components/ui/StatCounter";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "ecosystem.items.eden" });

  return {
    title: t("name"),
    description: t("description"),
  };
}

export default async function EdenAfricaPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<ReactNode> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "ecosystem" });

  return (
    <>
      <EcosystemHero
        code="EDEN_AFRICA"
        logoFile="/images/logo-eden-africa.png"
        name={t("items.eden.name")}
        slogan={t("items.eden.slogan")}
        description={t("items.eden.longDescription")}
        backLabel={t("index.backLabel")}
      />
      <section className="section-padding bg-cream">
        <div className="container-site">
          <div className="grid grid-cols-2 gap-8 rounded-xl bg-white p-8 shadow-[var(--shadow-card)] sm:grid-cols-3">
            <StatCounter end={14} suffix="" label={t("items.eden.stats.years")} />
            <StatCounter end={15} suffix="" label={t("items.eden.stats.countries")} />
            <StatCounter end={128} suffix="" label={t("items.eden.stats.organizations")} />
          </div>

          <AnimatedSection className="mt-10">
            <div className="flex flex-wrap gap-3">
              <Badge variant="gold">{t("items.eden.badges.oif")}</Badge>
              <Badge variant="primary">{t("items.eden.badges.coing")}</Badge>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </>
  );
}
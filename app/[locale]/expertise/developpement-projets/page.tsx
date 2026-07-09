import { type ReactNode } from "react";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { ExpertiseHero } from "@/components/sections/expertise/ExpertiseHero";
import { PhasesTimeline } from "@/components/sections/expertise/PhasesTimeline";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { Badge } from "@/components/ui/Badge";
import { FaChartLine } from "react-icons/fa6";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "expertise.items.developpement" });

  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function DeveloppementPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<ReactNode> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "expertise" });
  const phases = t.raw("items.developpement.phases") as string[];
  const sectors = t.raw("items.developpement.sectors") as string[];

  return (
    <>
      <ExpertiseHero
        eyebrow={t("index.eyebrow")}
        title={t("items.developpement.title")}
        description={t("items.developpement.longDescription")}
        icon={<FaChartLine size={26} className="text-gold" />}
        backLabel={t("index.backLabel")}
      />
      <section className="section-padding bg-cream">
        <div className="container-site space-y-14">
          <PhasesTimeline title={t("items.developpement.phasesTitle")} phases={phases} />

          <AnimatedSection>
            <h2 className="font-serif text-2xl font-semibold text-black md:text-3xl">
              {t("items.developpement.sectorsTitle")}
            </h2>
            <div className="mt-6 flex flex-wrap gap-3">
              {sectors.map((sector) => (
                <Badge key={sector} variant="primary">
                  {sector}
                </Badge>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>
    </>
  );
}
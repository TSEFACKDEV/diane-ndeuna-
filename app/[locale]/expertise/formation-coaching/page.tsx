import { type ReactNode } from "react";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { ExpertiseHero } from "@/components/sections/expertise/ExpertiseHero";
import { ServiceList } from "@/components/sections/expertise/ServiceList";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { Badge } from "@/components/ui/Badge";
import { FaChalkboardUser } from "react-icons/fa6";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "expertise.items.formation" });

  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function FormationPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<ReactNode> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "expertise" });
  const themes = t.raw("items.formation.themes") as string[];
  const coachingTypes = t.raw("items.formation.coachingTypes") as string[];

  return (
    <>
      <ExpertiseHero
        eyebrow={t("index.eyebrow")}
        title={t("items.formation.title")}
        description={t("items.formation.longDescription")}
        icon={<FaChalkboardUser size={26} className="text-gold" />}
        backLabel={t("index.backLabel")}
      />
      <section className="section-padding bg-cream">
        <div className="container-site space-y-14">
          <ServiceList title={t("items.formation.themesTitle")} items={themes} />

          <AnimatedSection>
            <h2 className="font-serif text-2xl font-semibold text-black md:text-3xl">
              {t("items.formation.coachingTitle")}
            </h2>
            <div className="mt-6 flex flex-wrap gap-3">
              {coachingTypes.map((type) => (
                <Badge key={type} variant="gold">
                  {type}
                </Badge>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>
    </>
  );
}
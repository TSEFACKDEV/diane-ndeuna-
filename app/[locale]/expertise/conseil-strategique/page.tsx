import { type ReactNode } from "react";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { ExpertiseHero } from "@/components/sections/expertise/ExpertiseHero";
import { AnimatedSection, AnimatedItem } from "@/components/ui/AnimatedSection";
import { Card } from "@/components/ui/Card";
import { AutoDiagnosticWidget } from "@/components/sections/expertise/AutoDiagnosticWidget";
import {
  FaHandshakeSimple,
  FaCompass,
  FaBuildingColumns,
  FaCircleNodes,
  FaCertificate,
} from "react-icons/fa6";
import type { IconType } from "react-icons";

const axisKeys = ["strategic", "institutional", "networking", "compliance"] as const;
const axisIcons: Record<(typeof axisKeys)[number], IconType> = {
  strategic: FaCompass,
  institutional: FaBuildingColumns,
  networking: FaCircleNodes,
  compliance: FaCertificate,
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "expertise.items.conseil" });

  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function ConseilPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<ReactNode> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "expertise" });

  return (
    <>
      <ExpertiseHero
        eyebrow={t("index.eyebrow")}
        title={t("items.conseil.title")}
        description={t("items.conseil.longDescription")}
        icon={<FaHandshakeSimple size={26} className="text-gold" />}
        backLabel={t("index.backLabel")}
      />
      <section className="section-padding bg-cream">
        <div className="container-site">
          <h2 className="font-serif text-2xl font-semibold text-black md:text-3xl">
            {t("items.conseil.axesTitle")}
          </h2>
          <AnimatedSection
            stagger
            className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4"
          >
            {axisKeys.map((key) => {
              const Icon = axisIcons[key];
              return (
                <AnimatedItem key={key}>
                  <Card variant="bordered" className="h-full">
                    <Icon size={24} className="text-gold" />
                    <p className="mt-4 font-serif text-base font-semibold text-black">
                      {t(`items.conseil.axes.${key}`)}
                    </p>
                  </Card>
                </AnimatedItem>
              );
            })}
          </AnimatedSection>
        </div>
      </section>

      <section className="section-padding bg-cream-dark">
        <div className="container-site">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <p className="font-sans text-sm font-semibold uppercase tracking-[0.2em] text-gold">
              {t("items.conseil.diagnostic.eyebrow")}
            </p>
            <h2 className="mt-3 font-serif text-3xl font-semibold text-black md:text-4xl">
              {t("items.conseil.diagnostic.title")}
            </h2>
          </div>
          <AutoDiagnosticWidget />
        </div>
      </section>
    </>
  );
}
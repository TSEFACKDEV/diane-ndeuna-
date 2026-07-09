import { type ReactNode } from "react";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { EcosystemHero } from "@/components/sections/ecosystem/EcosystemHero";
import { AnimatedSection, AnimatedItem } from "@/components/ui/AnimatedSection";
import { Card } from "@/components/ui/Card";
import { FaRocket, FaPeopleGroup, FaStore } from "react-icons/fa6";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "ecosystem.items.adef" });

  return {
    title: t("name"),
    description: t("description"),
  };
}

export default async function AdefPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<ReactNode> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "ecosystem" });
  const services = [
    { key: "incubation", icon: FaRocket },
    { key: "matchmaking", icon: FaPeopleGroup },
    { key: "marketAccess", icon: FaStore },
  ];

  return (
    <>
      <EcosystemHero
        code="ADEF"
        logoFile="/images/logo-adef.png"
        name={t("items.adef.name")}
        description={t("items.adef.longDescription")}
        backLabel={t("index.backLabel")}
      />
      <section className="section-padding bg-cream">
        <div className="container-site">
          <h2 className="font-serif text-2xl font-semibold text-black md:text-3xl">
            {t("items.adef.servicesTitle")}
          </h2>
          <AnimatedSection stagger className="mt-8 grid gap-6 sm:grid-cols-3">
            {services.map(({ key, icon: Icon }) => (
              <AnimatedItem key={key}>
                <Card variant="bordered" className="h-full text-center">
                  <Icon size={26} className="mx-auto text-primary" />
                  <p className="mt-4 font-serif text-base font-semibold text-black">
                    {t(`items.adef.services.${key}`)}
                  </p>
                </Card>
              </AnimatedItem>
            ))}
          </AnimatedSection>
        </div>
      </section>
    </>
  );
}
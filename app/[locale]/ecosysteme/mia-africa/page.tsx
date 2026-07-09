import { type ReactNode } from "react";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { EcosystemHero } from "@/components/sections/ecosystem/EcosystemHero";
import { AnimatedSection, AnimatedItem } from "@/components/ui/AnimatedSection";
import { Card } from "@/components/ui/Card";
import { FaChalkboardUser, FaUserGraduate, FaEye } from "react-icons/fa6";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "ecosystem.items.mia" });

  return {
    title: t("name"),
    description: t("description"),
  };
}

export default async function MiaAfricaPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<ReactNode> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "ecosystem" });
  const services = [
    { key: "training", icon: FaChalkboardUser },
    { key: "mentorship", icon: FaUserGraduate },
    { key: "visibility", icon: FaEye },
  ];

  return (
    <>
      <EcosystemHero
        code="MIA_AFRICA"
        logoFile="/images/logo-mia-africa.png"
        name={t("items.mia.name")}
        slogan={t("items.mia.slogan")}
        description={t("items.mia.longDescription")}
        backLabel={t("index.backLabel")}
      />
      <section className="section-padding bg-cream">
        <div className="container-site">
          <div className="rounded-xl bg-primary/5 p-6 text-center">
            <p className="font-serif text-3xl font-semibold text-primary">22%</p>
            <p className="mt-2 font-body text-sm text-slate-light">
              {t("items.mia.stat")}
            </p>
          </div>

          <AnimatedSection stagger className="mt-10 grid gap-6 sm:grid-cols-3">
            {services.map(({ key, icon: Icon }) => (
              <AnimatedItem key={key}>
                <Card variant="bordered" className="h-full text-center">
                  <Icon size={26} className="mx-auto text-primary" />
                  <p className="mt-4 font-serif text-base font-semibold text-black">
                    {t(`items.mia.services.${key}`)}
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
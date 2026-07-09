import { type ReactNode } from "react";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { ExpertiseHero } from "@/components/sections/expertise/ExpertiseHero";
import { ServiceList } from "@/components/sections/expertise/ServiceList";
import { FaSitemap } from "react-icons/fa6";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "expertise.items.structuration" });

  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function StructurationPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<ReactNode> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "expertise" });
  const items = t.raw("items.structuration.services") as string[];

  return (
    <>
      <ExpertiseHero
        eyebrow={t("index.eyebrow")}
        title={t("items.structuration.title")}
        description={t("items.structuration.longDescription")}
        icon={<FaSitemap size={26} className="text-gold" />}
        backLabel={t("index.backLabel")}
      />
      <section className="section-padding bg-cream">
        <div className="container-site">
          <ServiceList title={t("items.structuration.servicesTitle")} items={items} />
        </div>
      </section>
    </>
  );
}
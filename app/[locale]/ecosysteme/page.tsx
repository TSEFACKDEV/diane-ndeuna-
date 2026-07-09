import { type ReactNode } from "react";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { Card } from "@/components/ui/Card";
import { ImageSlot } from "@/components/ui/ImageSlot";
import { AnimatedSection, AnimatedItem } from "@/components/ui/AnimatedSection";
import { ecosystemDefinitions } from "@/lib/data/ecosystem";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "ecosystem.index" });

  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function EcosystemIndexPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<ReactNode> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "ecosystem" });

  return (
    <div className="bg-cream pt-32 pb-20 md:pt-44 md:pb-28">
      <div className="container-site">
        <SectionTitle
          subtitle={t("index.eyebrow")}
          title={t("index.title")}
          align="left"
        />
        <p className="mt-6 max-w-2xl font-body text-base leading-relaxed text-slate-light">
          {t("index.description")}
        </p>

        <AnimatedSection
          stagger
          className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          {ecosystemDefinitions.map(({ slug, key, logoFile }) => (
            <AnimatedItem key={slug}>
              <Link href={`/ecosysteme/${slug}`} className="block h-full">
                <Card variant="bordered" className="flex h-full flex-col items-center text-center">
                  <div className="relative h-16 w-32">
                    <ImageSlot
                      src={logoFile}
                      alt={t(`items.${key}.name`)}
                      fill
                      sizes="128px"
                      expectedFile={logoFile}
                      className="object-contain"
                    />
                  </div>
                  <p className="mt-5 font-serif text-lg font-semibold text-black">
                    {t(`items.${key}.name`)}
                  </p>
                  <p className="mt-2 font-body text-sm leading-relaxed text-slate-light">
                    {t(`items.${key}.tagline`)}
                  </p>
                </Card>
              </Link>
            </AnimatedItem>
          ))}
        </AnimatedSection>
      </div>
    </div>
  );
}
import { type ReactNode } from "react";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { Card } from "@/components/ui/Card";
import { AnimatedSection, AnimatedItem } from "@/components/ui/AnimatedSection";
import { expertiseDefinitions } from "@/lib/data/expertise";
import { IoArrowForward } from "react-icons/io5";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "expertise.index" });

  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function ExpertiseIndexPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<ReactNode> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "expertise" });

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
          className="mt-14 grid gap-6 sm:grid-cols-2"
        >
          {expertiseDefinitions.map(({ slug, key, icon: Icon }) => (
            <AnimatedItem key={slug}>
              <Link href={`/expertise/${slug}`} className="block h-full">
                <Card className="flex h-full flex-col">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <Icon size={22} className="text-primary" />
                  </div>
                  <p className="mt-5 font-serif text-xl font-semibold text-black">
                    {t(`items.${key}.title`)}
                  </p>
                  <p className="mt-3 flex-1 font-body text-sm leading-relaxed text-slate-light">
                    {t(`items.${key}.description`)}
                  </p>
                  <span className="mt-5 inline-flex items-center gap-2 font-sans text-sm font-semibold text-primary">
                    {t("index.readMore")}
                    <IoArrowForward size={14} />
                  </span>
                </Card>
              </Link>
            </AnimatedItem>
          ))}
        </AnimatedSection>
      </div>
    </div>
  );
}
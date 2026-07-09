// app/[locale]/partenariats/page.tsx
import { type ReactNode } from "react";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { prisma } from "@/lib/prisma";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { TestimonialCard } from "@/components/ui/TestimonialCard";
import { ImageSlot } from "@/components/ui/ImageSlot";
import { AnimatedSection, AnimatedItem } from "@/components/ui/AnimatedSection";
import { PartnershipForm } from "@/components/sections/partnerships/PartnershipForm";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/Button";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "partnerships.index" });

  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function PartnershipsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<ReactNode> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "partnerships" });

  // Récupération des témoignages (4 témoignages comme demandé)
  const testimonials = await prisma.testimonial.findMany({
    where: { isFeatured: true },
    orderBy: { order: "asc" },
    take: 4,
  });

  // Récupération des partenaires pour la section logos
  const partners = await prisma.partner.findMany({
    orderBy: { order: "asc" },
  });

  const testimonialsLocalized = testimonials.map((item) => ({
    ...item,
    content: locale === "fr" ? item.contentFr : item.contentEn,
  }));

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

        {/* Section témoignages */}
        <AnimatedSection stagger className="mt-14 grid gap-6 md:grid-cols-2">
          {testimonialsLocalized.map((testimonial) => (
            <AnimatedItem key={testimonial.id}>
              <TestimonialCard {...testimonial} />
            </AnimatedItem>
          ))}
        </AnimatedSection>

        {/* Section logos partenaires */}
        {partners.length > 0 ? (
          <div className="mt-20">
            <h2 className="font-serif text-2xl font-semibold text-black md:text-3xl">
              {t("partnersTitle")}
            </h2>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-8">
              {partners.map((partner) => (
                <div key={partner.id} className="relative h-16 w-32 opacity-70 transition-opacity hover:opacity-100">
                  {/* IMAGE ATTENDUE : public/images/partners/{partner.logoUrl} */}
                  <ImageSlot
                    src={partner.logoUrl}
                    alt={partner.name}
                    fill
                    sizes="128px"
                    className="object-contain"
                  />
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {/* Section collaboration / formulaire */}
        <div className="mt-20 rounded-xl bg-white p-8 shadow-[var(--shadow-card)] md:p-12">
          <div className="grid gap-10 lg:grid-cols-5 lg:gap-16">
            <div className="lg:col-span-2">
              <h2 className="font-serif text-2xl font-semibold text-black md:text-3xl">
                {t("collaboration.title")}
              </h2>
              <p className="mt-4 font-body text-base leading-relaxed text-slate-light">
                {t("collaboration.description")}
              </p>
              <div className="mt-6 space-y-3 font-body text-sm text-slate-light">
                <p className="flex items-center gap-2">
                  <span className="text-gold">✓</span> {t("collaboration.points.0")}
                </p>
                <p className="flex items-center gap-2">
                  <span className="text-gold">✓</span> {t("collaboration.points.1")}
                </p>
                <p className="flex items-center gap-2">
                  <span className="text-gold">✓</span> {t("collaboration.points.2")}
                </p>
              </div>
              <div className="mt-8">
                <Link href="/contact">
                  <Button variant="primary">{t("collaboration.cta")}</Button>
                </Link>
              </div>
            </div>
            <div className="lg:col-span-3">
              <PartnershipForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
// app/[locale]/contact/page.tsx
import { type ReactNode } from "react";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { ContactForm } from "@/components/sections/contact/ContactForm";
import { ContactInfo } from "@/components/sections/contact/ContactInfo";
import { AnimatedSection } from "@/components/ui/AnimatedSection";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "contact.index" });

  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<ReactNode> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "contact" });

  return (
    <div className="bg-cream pt-32 pb-20 md:pt-44 md:pb-28">
      <div className="container-site">
        <SectionTitle
          subtitle={t("index.eyebrow")}
          title={t("index.title")}
          align="left"
        />

        <div className="mt-10 grid gap-10 lg:grid-cols-5 lg:gap-16">
          <AnimatedSection className="lg:col-span-2">
            <ContactInfo />
          </AnimatedSection>
          <AnimatedSection delay={0.15} className="lg:col-span-3">
            <div className="rounded-xl bg-white p-8 shadow-[var(--shadow-card)] md:p-12">
              <h2 className="font-serif text-2xl font-semibold text-black">
                {t("form.title")}
              </h2>
              <p className="mt-2 font-body text-sm text-slate-light">
                {t("form.description")}
              </p>
              <div className="mt-6">
                <ContactForm />
              </div>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </div>
  );
}
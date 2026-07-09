// app/[locale]/communaute/newsletter-unsubscribed/page.tsx
"use client";

import { type ReactNode } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { IoCheckmarkCircle } from "react-icons/io5";

export default function UnsubscribedPage(): ReactNode {
  const t = useTranslations("community.newsletterUnsubscribed");

  return (
    <div className="bg-cream pt-32 pb-20 md:pt-44 md:pb-28">
      <div className="container-site max-w-md">
        <Card variant="elevated" className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-50">
            <IoCheckmarkCircle size={32} className="text-success" />
          </div>
          <h1 className="mt-4 font-serif text-2xl font-semibold text-black">
            {t("title")}
          </h1>
          <p className="mt-3 font-body text-base text-slate-light">
            {t("description")}
          </p>
          <div className="mt-6 flex flex-col gap-3">
            <Link href="/">
              <Button variant="primary" className="w-full">
                {t("home")}
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="outline" className="w-full">
                {t("contact")}
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
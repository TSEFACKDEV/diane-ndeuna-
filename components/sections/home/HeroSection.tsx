"use client";

import { type ReactNode } from "react";
import { motion } from "motion/react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/Button";
import { ImageSlot } from "@/components/ui/ImageSlot";
import { IoArrowDown } from "react-icons/io5";

export function HeroSection(): ReactNode {
  const t = useTranslations("home.hero");

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-primary-dark">
      {/* IMAGE ATTENDUE : public/images/hero-diane-ndeuna.jpg — Remplacer ce fichier pour afficher l'image */}
      <ImageSlot
        src="/images/hero-diane-ndeuna.jpg"
        alt="Diane NDEUNA — Architecte de systèmes organisationnels"
        fill
        priority
        sizes="100vw"
        expectedFile="public/images/hero-diane-ndeuna.jpg"
        className="absolute inset-0"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-primary-dark via-primary-dark/70 to-primary-dark/40" />

      <div className="container-site relative z-10 flex flex-col items-center px-4 text-center">
        <motion.span
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="mb-5 font-sans text-xs font-semibold uppercase tracking-[0.3em] text-gold-light"
        >
          {t("eyebrow")}
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-4xl font-serif text-3xl font-semibold leading-tight text-white md:text-5xl lg:text-6xl"
        >
          {t("tagline")}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="text-accent mt-6 max-w-2xl text-lg text-cream/90 md:text-xl"
        >
          {t("quote")}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.65, ease: [0.16, 1, 0.3, 1] }}
          className="mt-10 flex flex-col gap-4 sm:flex-row"
        >
          <Link href="/about">
            <Button variant="secondary" size="lg">
              {t("ctaPrimary")}
            </Button>
          </Link>
          <Link href="/contact">
            <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-primary">
              {t("ctaSecondary")}
            </Button>
          </Link>
        </motion.div>
      </div>

      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 text-white/70"
      >
        <IoArrowDown size={24} />
      </motion.div>
    </section>
  );
}
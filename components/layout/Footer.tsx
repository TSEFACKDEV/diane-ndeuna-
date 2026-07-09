// components/layout/Footer.tsx (Mise à jour — remplacer la section newsletter du footer)
// Remplacer le formulaire statique par un formulaire Formik fonctionnel

"use client";

import { type ReactNode, useState } from "react";
import { useTranslations } from "next-intl";
import { Formik, Form, Field, type FormikHelpers } from "formik";
import axios from "axios";
import { Link } from "@/i18n/navigation";
import { newsletterSchema, type NewsletterSchemaType } from "@/lib/validation/newsletter";
import {
  FaLinkedinIn,
  FaFacebookF,
  FaXTwitter,
  FaInstagram,
  FaYoutube,
  FaTiktok,
} from "react-icons/fa6";
import { IoMailOutline, IoLogoWhatsapp, IoCheckmarkCircle } from "react-icons/io5";

const socialLinks = [
  { href: "hhttps://www.linkedin.com/in/diane-ndeuna-26161241/", icon: FaLinkedinIn, label: "LinkedIn" },
  { href: "https://web.facebook.com/carine.ndeuna", icon: FaFacebookF, label: "Facebook" },
  { href: "https://x.com/ndeuna1", icon: FaXTwitter, label: "X" },
  { href: "https://www.instagram.com/dianendeuna/", icon: FaInstagram, label: "Instagram" },
  { href: "https://www.youtube.com/@dianendeuna", icon: FaYoutube, label: "YouTube" },
  { href: "https://www.tiktok.com/@diane.ndeuna", icon: FaTiktok, label: "TikTok" },
];

const initialValues: NewsletterSchemaType = { email: "", fullName: "" };

export function Footer(): ReactNode {
  const t = useTranslations("footer");
  const currentYear = new Date().getFullYear();
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(
    values: NewsletterSchemaType,
    helpers: FormikHelpers<NewsletterSchemaType>
  ): Promise<void> {
    setError(null);
    try {
      await axios.post("/api/newsletter/subscribe", values);
      setIsSuccess(true);
      helpers.resetForm();
    } catch {
      setError(t("newsletter.error"));
    } finally {
      helpers.setSubmitting(false);
    }
  }

  return (
    <footer className="bg-primary-dark text-cream">
      <div className="container-site section-padding grid gap-10 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="font-serif text-2xl font-semibold text-white">
            Diane NDEUNA
          </p>
          <p className="mt-3 max-w-xs font-body text-sm text-cream/70">
            {t("tagline")}
          </p>
          <div className="mt-5 flex gap-3">
            {socialLinks.map(({ href, icon: Icon, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 text-white transition-colors duration-200 hover:bg-gold hover:text-black"
              >
                <Icon size={15} />
              </a>
            ))}
          </div>
        </div>

        <div>
          <p className="mb-4 font-sans text-sm font-semibold uppercase tracking-wider text-gold-light">
            {t("explore")}
          </p>
          <ul className="space-y-2 font-body text-sm text-cream/80">
            <li><Link href="/about" className="transition-colors hover:text-white">{t("links.about")}</Link></li>
            <li><Link href="/expertise" className="transition-colors hover:text-white">{t("links.expertise")}</Link></li>
            <li><Link href="/ecosysteme" className="transition-colors hover:text-white">{t("links.ecosystem")}</Link></li>
            <li><Link href="/ressources" className="transition-colors hover:text-white">{t("links.resources")}</Link></li>
            <li><Link href="/blog" className="transition-colors hover:text-white">{t("links.blog")}</Link></li>
          </ul>
        </div>

        <div>
          <p className="mb-4 font-sans text-sm font-semibold uppercase tracking-wider text-gold-light">
            {t("contact")}
          </p>
          <ul className="space-y-3 font-body text-sm text-cream/80">
            <li className="flex items-center gap-2">
              <IoMailOutline size={16} className="text-gold" />
              <a href="mailto:contact@heritage-expertise.com" className="transition-colors hover:text-white">
                contact@heritage-expertise.com
              </a>
            </li>
            <li className="flex items-center gap-2">
              <IoMailOutline size={16} className="text-gold" />
              <a href="mailto:contact@dianendeuna.com" className="transition-colors hover:text-white">
                contact@dianendeuna.com
              </a>
            </li>
            <li className="flex items-center gap-2">
              <IoLogoWhatsapp size={16} className="text-gold" />
              <a href="https://wa.me/237679660706" className="transition-colors hover:text-white">
                +237 679 66 07 06
              </a>
            </li>
          </ul>
        </div>

        <div>
          <p className="mb-4 font-sans text-sm font-semibold uppercase tracking-wider text-gold-light">
            {t("newsletter.title")}
          </p>
          <p className="mb-4 font-body text-sm text-cream/70">
            {t("newsletter.description")}
          </p>

          {isSuccess ? (
            <div className="flex items-center gap-2 rounded-lg bg-white/10 px-4 py-3 text-gold-light">
              <IoCheckmarkCircle size={20} />
              <span className="font-body text-sm">{t("newsletter.success")}</span>
            </div>
          ) : (
            <Formik
              initialValues={initialValues}
              validationSchema={newsletterSchema}
              onSubmit={handleSubmit}
            >
              {({ errors, touched, isSubmitting }) => (
                <Form>
                  <div className="flex flex-col gap-2">
                    <div>
                      <Field
                        name="email"
                        type="email"
                        placeholder={t("newsletter.placeholder")}
                        className="w-full rounded-lg border border-white/20 bg-white/5 px-3 py-2 font-body text-sm text-white placeholder:text-cream/50 focus:border-gold focus:outline-none"
                      />
                      {errors.email && touched.email ? (
                        <p className="mt-1 font-body text-xs text-error">{errors.email}</p>
                      ) : null}
                    </div>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="rounded-lg bg-gold px-4 py-2 font-sans text-sm font-semibold text-black transition-colors duration-200 hover:bg-gold-light disabled:opacity-50"
                    >
                      {isSubmitting ? t("newsletter.sending") : t("newsletter.button")}
                    </button>
                    {error ? (
                      <p className="mt-1 font-body text-xs text-error">{error}</p>
                    ) : null}
                  </div>
                </Form>
              )}
            </Formik>
          )}
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-site flex flex-col items-center justify-between gap-2 py-5 text-center font-body text-xs text-cream/60 md:flex-row md:text-left">
          <p>{currentYear} – Diane NDEUNA | {t("rights")}</p>
          <p>{t("madeWith")}</p>
        </div>
      </div>
    </footer>
  );
}
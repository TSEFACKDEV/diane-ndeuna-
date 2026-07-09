// components/sections/contact/ContactInfo.tsx
"use client";

import { type ReactNode } from "react";
import { useTranslations } from "next-intl";
import { Card } from "@/components/ui/Card";
import { IoMailOutline, IoLogoWhatsapp } from "react-icons/io5";
import {
  FaRegEnvelope,
  FaLinkedinIn,
  FaFacebookF,
  FaXTwitter,
  FaInstagram,
  FaYoutube,
  FaTiktok,
} from "react-icons/fa6";

const socialLinks = [
  { href: "hhttps://www.linkedin.com/in/diane-ndeuna-26161241/", icon: FaLinkedinIn, label: "LinkedIn" },
  { href: "https://web.facebook.com/carine.ndeuna", icon: FaFacebookF, label: "Facebook" },
  { href: "https://x.com/ndeuna1", icon: FaXTwitter, label: "X" },
  { href: "https://www.instagram.com/dianendeuna/", icon: FaInstagram, label: "Instagram" },
  { href: "https://www.youtube.com/@dianendeuna", icon: FaYoutube, label: "YouTube" },
  { href: "https://www.tiktok.com/@diane.ndeuna", icon: FaTiktok, label: "TikTok" },
];

export function ContactInfo(): ReactNode {
  const t = useTranslations("contact.info");

  return (
    <div className="space-y-6">
      <Card variant="bordered" className="space-y-4">
        <p className="font-serif text-lg font-semibold text-black">
          {t("title")}
        </p>

        <div className="space-y-3 font-body text-sm text-slate">
          <div className="flex items-start gap-3">
            <IoMailOutline size={18} className="mt-0.5 shrink-0 text-gold" />
            <div>
              <p className="font-medium">Email principal</p>
              <a
                href="mailto:contact@heritage-expertise.com"
                className="hover:text-primary transition-colors"
              >
                contact@heritage-expertise.com
              </a>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <FaRegEnvelope size={18} className="mt-0.5 shrink-0 text-gold" />
            <div>
              <p className="font-medium">Email secondaire</p>
              <a
                href="mailto:contact@dianendeuna.com"
                className="hover:text-primary transition-colors"
              >
                contact@dianendeuna.com
              </a>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <IoLogoWhatsapp size={18} className="mt-0.5 shrink-0 text-gold" />
            <div>
              <p className="font-medium">WhatsApp Business</p>
              <a
                href="https://wa.me/237679660706"
                className="hover:text-primary transition-colors"
              >
                +237 679 66 07 06
              </a>
            </div>
          </div>
        </div>
      </Card>

      <Card variant="bordered" className="space-y-4">
        <p className="font-serif text-lg font-semibold text-black">
          {t("social")}
        </p>
        <div className="flex flex-wrap gap-3">
          {socialLinks.map(({ href, icon: Icon, label }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className="flex h-10 w-10 items-center justify-center rounded-lg bg-cream-dark text-slate-light transition-colors duration-200 hover:bg-primary hover:text-white"
            >
              <Icon size={18} />
            </a>
          ))}
        </div>
      </Card>

    </div>
  );
}

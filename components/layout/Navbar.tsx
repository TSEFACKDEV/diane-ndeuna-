"use client";

import { type ReactNode, useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import { Link } from "@/i18n/navigation";
import type { AppPathnames } from "@/i18n/routing";
import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher";
import { Button } from "@/components/ui/Button";
import { IoMenu, IoClose } from "react-icons/io5";

type StaticAppPathnames = Exclude<AppPathnames, `${string}[${string}]${string}`>;

interface NavLink {
  href: StaticAppPathnames;
  labelKey: string;
}

const navLinks: NavLink[] = [
  { href: "/about", labelKey: "about" },
  { href: "/ecosysteme", labelKey: "ecosystem" },
  { href: "/ressources", labelKey: "resources" },
  { href: "/blog", labelKey: "blog" },
  { href: "/evenements/calendrier", labelKey: "events" },
  { href: "/partenariats", labelKey: "partnerships" },
  { href: "/contact", labelKey: "contact" },
];

export function Navbar(): ReactNode {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  useEffect(() => {
    function handleScroll(): void {
      setIsScrolled(window.scrollY > 40);
    }
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (): void => {
    setIsMobileMenuOpen(false);
  };

  const isHome = pathname === "/" || /^\/(fr|en)\/?$/.test(pathname);
  const isSolid = isScrolled || !isHome || isMobileMenuOpen;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-all duration-300 ${
        isSolid
          ? "bg-cream shadow-(--shadow-nav)"
          : "bg-transparent"
      }`}
    >
      <div className="container-site flex h-20 items-center justify-between">
        <Link
          href="/"
          className={`font-serif text-2xl font-semibold tracking-wide transition-colors duration-300 ${
            isSolid ? "text-primary" : "text-white"
          }`}
        >
          Diane NDEUNA
        </Link>

        <nav className="hidden items-center gap-7 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={handleNavClick}
              className={`font-sans text-sm font-medium tracking-wide transition-colors duration-300 ${
                isSolid
                  ? "text-slate hover:text-primary"
                  : "text-white/90 hover:text-white"
              }`}
            >
              {t(link.labelKey)}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-5  lg:flex">
          <LanguageSwitcher />
          <Link href="/communaute/connexion" className="hidden" >
            <Button variant="secondary" size="sm">
              {t("community")}
            </Button>
          </Link>
        </div>

        <button
          type="button"
          aria-label="Menu"
          onClick={() => setIsMobileMenuOpen((prev) => !prev)}
          className={`lg:hidden ${isSolid ? "text-primary" : "text-white"}`}
        >
          {isMobileMenuOpen ? <IoClose size={28} /> : <IoMenu size={28} />}
        </button>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen ? (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden bg-cream lg:hidden"
          >
            <nav className="container-site flex flex-col gap-1 pb-6">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={handleNavClick}
                  className="rounded-lg px-3 py-3 font-sans text-base font-medium text-slate transition-colors duration-200 hover:bg-cream-dark hover:text-primary"
                >
                  {t(link.labelKey)}
                </Link>
              ))}
              <div className="mt-3 flex items-center justify-between border-t border-border pt-4">
                <LanguageSwitcher />
                <Link href="/communaute/connexion" className="hidden" onClick={handleNavClick}>
                  <Button variant="secondary" size="sm">
                    {t("community")}
                  </Button>
                </Link>
              </div>
            </nav>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
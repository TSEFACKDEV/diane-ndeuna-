"use client";

import { type ReactNode, useState } from "react";
import { useTranslations } from "next-intl";
import { usePathname } from "@/i18n/navigation";
import NextLink from "next/link";
import {
  IoGrid, IoPeople, IoCalendar, IoBook, IoNewspaper, IoMail, IoChatbubbles, IoLogOut, IoMenu, IoClose,
} from "react-icons/io5";

interface NavItem {
  href: string;
  icon: ReactNode;
  label: string;
}

export function AdminSidebar(): ReactNode {
  const t = useTranslations("admin.sidebar");
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = useState<boolean>(false);

  const handleNavClick = (): void => {
    setIsMobileOpen(false);
  };

  const navItems: NavItem[] = [
    { href: "/admin/dashboard", icon: <IoGrid size={20} />, label: t("dashboard") },
    { href: "/admin/membres", icon: <IoPeople size={20} />, label: t("members") },
    { href: "/admin/evenements", icon: <IoCalendar size={20} />, label: t("events") },
    { href: "/admin/ressources", icon: <IoBook size={20} />, label: t("resources") },
    { href: "/admin/blog", icon: <IoNewspaper size={20} />, label: t("blog") },
    { href: "/admin/newsletter", icon: <IoMail size={20} />, label: t("newsletter") },
    { href: "/admin/messages", icon: <IoChatbubbles size={20} />, label: t("messages") },
  ];

  // 2. Correction radicale de la comparaison : 
  // On compare des chaines de caractères brutes en forçant le typage
  const isActive = (href: string): boolean => {
    return pathname === href || (href !== "/admin/dashboard" && pathname.startsWith(href));
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="fixed left-4 top-4 z-50 rounded-lg bg-primary p-2 text-white lg:hidden"
      >
        {isMobileOpen ? <IoClose size={24} /> : <IoMenu size={24} />}
      </button>

      {isMobileOpen ? (
        <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={handleNavClick} />
      ) : null}

      <aside className={`fixed inset-y-0 left-0 z-40 w-64 transform bg-primary-dark text-cream transition-transform duration-300 lg:translate-x-0 ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex h-20 items-center border-b border-white/10 px-6">
          {/* 3. Utilisation de NextLink standard pour les routes hors i18n */}
          <NextLink href="/admin/dashboard" className="font-serif text-xl font-semibold text-white">
            Diane NDEUNA
          </NextLink>
          <span className="ml-2 rounded-full bg-gold/20 px-2 py-0.5 font-sans text-xs font-bold uppercase text-gold">Admin</span>
        </div>

        <nav className="mt-6 px-4 space-y-1">
          {navItems.map((item) => (
            <NextLink
              key={item.href}
              href={item.href}
              onClick={handleNavClick}
              className={`flex items-center gap-3 rounded-lg px-4 py-3 font-sans text-sm font-medium transition-colors duration-200 ${
                isActive(item.href) ? "bg-gold/20 text-gold-light" : "text-cream/70 hover:bg-white/5 hover:text-white"
              }`}
            >
              {item.icon}
              {item.label}
            </NextLink>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 border-t border-white/10 p-4">
          <button
            type="button"
            onClick={async () => {
              await fetch("/api/auth/logout", { method: "POST" });
              window.location.href = "/fr";
            }}
            className="flex w-full items-center gap-3 rounded-lg px-4 py-3 font-sans text-sm font-medium text-cream/60 transition-colors hover:bg-white/5 hover:text-white"
          >
            <IoLogOut size={20} />
            {t("logout")}
          </button>
        </div>
      </aside>
    </>
  );
}
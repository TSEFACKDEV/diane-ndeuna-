// components/admin/AdminHeader.tsx
"use client";

import { type ReactNode } from "react";
import { useTranslations } from "next-intl";
import type { AuthenticatedUser } from "@/types/auth";
import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher";

interface AdminHeaderProps {
  user: AuthenticatedUser;
}

export function AdminHeader({ user }: AdminHeaderProps): ReactNode {
  const t = useTranslations("admin.header");

  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-sm border-b border-border px-6 py-4 lg:px-8">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-sans text-sm text-slate-light">{t("welcome")}</p>
          <p className="font-serif text-xl font-semibold text-black">{user.fullName}</p>
        </div>
        <div className="flex items-center gap-4">
          <LanguageSwitcher />
          <div className="hidden sm:block h-8 w-px bg-border" />
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-white font-serif font-semibold text-sm">
            {user.fullName.charAt(0)}
          </div>
        </div>
      </div>
    </header>
  );
}
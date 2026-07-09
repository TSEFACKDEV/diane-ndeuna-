"use client";

import { type ReactNode } from "react";
import { useLocale } from "next-intl";
import { useParams } from "next/navigation";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

export function LanguageSwitcher(): ReactNode {
  const locale = useLocale();
  const pathname = usePathname();
  const params = useParams();
  const router = useRouter();

  function handleSwitch(nextLocale: string): void {
    router.replace(
      // @ts-expect-error -- TypeScript can't verify that `params` matches the
      // dynamic segments of the current `pathname`, but they always do since
      // both come from the same route at runtime.
      { pathname, params },
      { locale: nextLocale }
    );
  }

  return (
    <div className="flex items-center gap-1 font-sans text-sm font-medium">
      {routing.locales.map((loc) => (
        <button
          key={loc}
          type="button"
          onClick={() => handleSwitch(loc)}
          aria-current={locale === loc}
          className={`rounded-md px-2 py-1 uppercase transition-colors duration-200 ${
            locale === loc
              ? "text-[var(--color-primary)]"
              : "text-[var(--color-slate-light)] hover:text-[var(--color-primary)]"
          }`}
        >
          {loc}
        </button>
      ))}
    </div>
  );
}
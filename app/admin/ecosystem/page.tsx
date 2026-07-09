// app/admin/ecosystem/page.tsx
import { type ReactNode } from "react";
import { getTranslations } from "next-intl/server";
import { prisma } from "@/lib/prisma";
import { EcosystemBrochureUpload } from "@/components/admin/EcosystemBrochureUpload";

export default async function AdminEcosystemPage(): Promise<ReactNode> {
  const t = await getTranslations("admin.ecosystem");

  const entities = await prisma.ecosystemEntity.findMany({
    orderBy: { code: "asc" },
  });

  return (
    <div>
      <h1 className="font-serif text-2xl font-semibold text-black md:text-3xl">
        {t("title")}
      </h1>
      <p className="mt-2 font-body text-sm text-slate-light">{t("description")}</p>

      <div className="mt-8 space-y-6">
        {entities.map((entity) => {
          const name = entity.nameFr;
          return (
            <EcosystemBrochureUpload
              key={entity.code}
              entityCode={entity.code}
              entityName={name}
              currentBrochureUrl={entity.brochureUrl ? `/api/ecosystem/${entity.code}/brochure` : null}
              currentBrochurePublicId={entity.brochureUrl}
              onUpdate={async () => {
                "use server";
                // Revalidation via revalidatePath ou redirect
              }}
            />
          );
        })}
      </div>
    </div>
  );
}
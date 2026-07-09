// app/admin/membres/page.tsx
import { type ReactNode } from "react";
import { getTranslations } from "next-intl/server";
import { prisma } from "@/lib/prisma";
import { AdminTable, type Column } from "@/components/admin/AdminTable";
import { Badge } from "@/components/ui/Badge";

export default async function AdminMembersPage(): Promise<ReactNode> {
  const t = await getTranslations("admin.members");
  const members = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      email: true,
      fullName: true,
      role: true,
      membershipStatus: true,
      organization: true,
      country: true,
      createdAt: true,
    },
  });

  const columns: Column<(typeof members)[0]>[] = [
    {
      key: "fullName",
      header: t("columns.fullName"),
    },
    {
      key: "email",
      header: t("columns.email"),
    },
    {
      key: "organization",
      header: t("columns.organization"),
      render: (item) => item.organization || "-",
    },
    {
      key: "role",
      header: t("columns.role"),
      render: (item) => (
        <Badge variant={item.role === "ADMIN" ? "gold" : "primary"}>
          {item.role === "ADMIN" ? "Admin" : "Membre"}
        </Badge>
      ),
    },
    {
      key: "membershipStatus",
      header: t("columns.status"),
      render: (item) => {
        const variant =
          item.membershipStatus === "ACTIVE"
            ? "gold"
            : item.membershipStatus === "PENDING"
            ? "neutral"
            : "primary";
        return <Badge variant={variant}>{item.membershipStatus}</Badge>;
      },
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-2xl font-semibold text-black md:text-3xl">
          {t("title")}
        </h1>
      </div>
      <p className="mt-2 font-body text-sm text-slate-light">{t("description")}</p>

      <div className="mt-8">
        <AdminTable data={members} columns={columns} actions={false} />
      </div>
    </div>
  );
}
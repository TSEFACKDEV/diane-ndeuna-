// app/admin/layout.tsx
import { type ReactNode } from "react";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";
import "../../app/globals.css";

interface AdminLayoutProps {
  children: ReactNode;
}

export default async function AdminLayout({ children }: AdminLayoutProps): Promise<ReactNode> {
  const user = await getCurrentUser();

  if (!user || user.role !== "ADMIN") {
    redirect("/fr/communaute/connexion");
  }

  return (
    <div className="min-h-screen bg-cream">
      <AdminSidebar />
      <div className="lg:pl-64">
        <AdminHeader user={user} />
        <main className="p-6 md:p-8">{children}</main>
      </div>
    </div>
  );
}
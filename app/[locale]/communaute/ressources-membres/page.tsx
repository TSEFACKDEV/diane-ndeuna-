// app/[locale]/communaute/ressources-membres/page.tsx
"use client";

import { type ReactNode, useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useUser } from "@/hooks/useUser";
import { useRouter } from "@/i18n/navigation";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { AuthGuard } from "@/components/ui/AuthGuard";
import { Loader } from "@/components/ui/Loader";
import {
  FaUser,
  FaCrown,
  FaDownload,
  FaBook,
  FaVideo,
  FaFilePdf,
} from "react-icons/fa6";

// Données statiques pour la démo — à remplacer par des données réelles de l'API
const memberResources = [
  { id: "1", title: "Guide de structuration organisationnelle", type: "pdf", icon: FaFilePdf },
  { id: "2", title: "Modèle de plan stratégique", type: "pdf", icon: FaFilePdf },
  { id: "3", title: "Webinaire : Mobilisation de ressources", type: "video", icon: FaVideo },
  { id: "4", title: "Kit de gouvernance pour CA", type: "pdf", icon: FaFilePdf },
  { id: "5", title: "E-book : Leadership féminin en Afrique", type: "pdf", icon: FaBook },
  { id: "6", title: "Template de rapport d'activités", type: "pdf", icon: FaFilePdf },
];

export default function MemberDashboardPage(): ReactNode {
  const t = useTranslations("community.dashboard");
  const { user, isLoading } = useUser();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"resources" | "profile">("resources");

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/communaute/connexion");
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center bg-cream pt-32">
        <Loader size="lg" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const membershipBadge =
    user.membershipStatus === "ACTIVE" ? (
      <Badge variant="gold">Actif</Badge>
    ) : user.membershipStatus === "EXPIRED" ? (
      <Badge variant="neutral">Expiré</Badge>
    ) : (
      <Badge variant="primary">En attente</Badge>
    );

  return (
    <AuthGuard fallback={<Loader fullScreen />}>
      <div className="bg-cream pt-32 pb-20 md:pt-44 md:pb-28">
        <div className="container-site">
          <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
            <SectionTitle
              subtitle={t("eyebrow")}
              title={t("title")}
              align="left"
            />
            <Button
              variant="outline"
              onClick={() => {
                /* Logique de déconnexion */
              }}
            >
              {t("logout")}
            </Button>
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-3">
            <Card variant="bordered" className="md:col-span-1">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <FaUser size={28} />
                </div>
                <div>
                  <p className="font-serif text-lg font-semibold text-black">{user.fullName}</p>
                  <p className="font-sans text-sm text-slate-light">{user.email}</p>
                </div>
              </div>

              <div className="mt-6 space-y-3 border-t border-border pt-6">
                <div className="flex items-center gap-2">
                  {membershipBadge}
                  <span className="font-sans text-xs text-slate-light">
                    {user.membershipStatus === "ACTIVE"
                      ? t("membershipActive")
                      : user.membershipStatus === "EXPIRED"
                      ? t("membershipExpired")
                      : t("membershipPending")}
                  </span>
                </div>

                <button
                  onClick={() => setActiveTab("profile")}
                  className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 font-sans text-sm font-medium transition-colors ${
                    activeTab === "profile"
                      ? "bg-primary/10 text-primary"
                      : "text-slate-light hover:bg-cream-dark"
                  }`}
                >
                  <FaUser size={16} />
                  {t("profile")}
                </button>
                <button
                  onClick={() => setActiveTab("resources")}
                  className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 font-sans text-sm font-medium transition-colors ${
                    activeTab === "resources"
                      ? "bg-primary/10 text-primary"
                      : "text-slate-light hover:bg-cream-dark"
                  }`}
                >
                  <FaBook size={16} />
                  {t("resources")}
                </button>
              </div>
            </Card>

            <div className="md:col-span-2">
              {activeTab === "profile" ? (
                <Card variant="bordered">
                  <h3 className="font-serif text-xl font-semibold text-black">{t("profile")}</h3>
                  <div className="mt-6 space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <p className="font-sans text-xs font-medium uppercase tracking-wider text-slate-light">
                          {t("fullName")}
                        </p>
                        <p className="font-body text-base text-slate">{user.fullName}</p>
                      </div>
                      <div>
                        <p className="font-sans text-xs font-medium uppercase tracking-wider text-slate-light">
                          {t("email")}
                        </p>
                        <p className="font-body text-base text-slate">{user.email}</p>
                      </div>
                      <div>
                        <p className="font-sans text-xs font-medium uppercase tracking-wider text-slate-light">
                          {t("organization")}
                        </p>
                        <p className="font-body text-base text-slate">{user.organization || "-"}</p>
                      </div>
                      <div>
                        <p className="font-sans text-xs font-medium uppercase tracking-wider text-slate-light">
                          {t("country")}
                        </p>
                        <p className="font-body text-base text-slate">{user.country || "-"}</p>
                      </div>
                    </div>
                  </div>
                </Card>
              ) : (
                <Card variant="bordered">
                  <h3 className="font-serif text-xl font-semibold text-black">{t("resourcesTitle")}</h3>
                  <p className="mt-2 font-body text-sm text-slate-light">{t("resourcesDescription")}</p>
                  <div className="mt-6 space-y-4">
                    {memberResources.map((resource) => {
                      const Icon = resource.icon;
                      return (
                        <div
                          key={resource.id}
                          className="flex items-center justify-between rounded-lg border border-border bg-white p-4 transition-shadow hover:shadow-card"
                        >
                          <div className="flex items-center gap-3">
                            <Icon size={20} className="text-primary" />
                            <div>
                              <p className="font-body text-sm font-medium text-black">{resource.title}</p>
                              <p className="font-sans text-xs uppercase text-slate-light">{resource.type}</p>
                            </div>
                          </div>
                          <Button variant="outline" size="sm">
                            <FaDownload size={14} />
                            {t("download")}
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                  <div className="mt-6 border-t border-border pt-6">
                    <Button variant="secondary" className="w-full">
                      {t("upgrade")}
                      <FaCrown size={16} />
                    </Button>
                  </div>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
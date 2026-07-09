// app/admin/newsletter/page.tsx
"use client";

import { type ReactNode, useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import axios from "axios";
import { AdminTable, type Column } from "@/components/admin/AdminTable";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { NewsletterSendForm } from "@/components/admin/NewsletterSendForm";
import { IoAdd } from "react-icons/io5";
import { NewsletterSubscriber } from "@/lib/generated/prisma/browser";

export default function AdminNewsletterPage(): ReactNode {
  const t = useTranslations("admin.newsletter");
  const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const loadSubscribers = async (): Promise<void> => {
    setIsLoading(true);
    try {
      const { data } = await axios.get("/api/newsletter/subscribers");
      setSubscribers(data);
    } catch (error) {
      console.error("Erreur chargement abonnés:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadSubscribers();
  }, []);

  const handleDelete = async (subscriber: NewsletterSubscriber): Promise<void> => {
    if (!confirm(t("confirmDelete"))) return;
    try {
      await axios.delete("/api/newsletter/subscribers", { data: { id: subscriber.id } });
      await loadSubscribers();
    } catch (error) {
      console.error("Erreur suppression:", error);
    }
  };

  const columns: Column<NewsletterSubscriber>[] = [
    {
      key: "email",
      header: t("columns.email"),
    },
    {
      key: "fullName",
      header: t("columns.fullName"),
      render: (item) => item.fullName || "-",
    },
    {
      key: "subscribedAt",
      header: t("columns.subscribedAt"),
      render: (item) =>
        new Intl.DateTimeFormat("fr-FR", {
          day: "numeric",
          month: "short",
          year: "numeric",
        }).format(item.subscribedAt),
    },
    {
      key: "isActive",
      header: t("columns.status"),
      render: (item) => (
        <Badge variant={item.isActive ? "gold" : "neutral"}>
          {item.isActive ? t("active") : t("inactive")}
        </Badge>
      ),
    },
  ];

  if (isLoading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gold border-t-transparent" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-serif text-2xl font-semibold text-black md:text-3xl">
            {t("title")}
          </h1>
          <p className="mt-2 font-body text-sm text-slate-light">{t("description")}</p>
        </div>
        <Button variant="primary" onClick={() => setIsModalOpen(true)}>
          <IoAdd size={18} />
          {t("send")}
        </Button>
      </div>

      <div className="mt-8">
        <AdminTable
          data={subscribers}
          columns={columns}
          onDelete={handleDelete}
        />
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={t("send")}
      >
        <NewsletterSendForm
          onSuccess={() => setIsModalOpen(false)}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
  );
}
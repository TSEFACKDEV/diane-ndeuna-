// app/admin/messages/page.tsx
"use client";

import { type ReactNode, useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import axios from "axios";
import { AdminTable, type Column } from "@/components/admin/AdminTable";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { ContactMessage } from "@/lib/generated/prisma/browser";


export default function AdminMessagesPage(): ReactNode {
  const t = useTranslations("admin.messages");
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const loadMessages = async (): Promise<void> => {
    setIsLoading(true);
    try {
      const { data } = await axios.get("/api/contact");
      setMessages(data);
    } catch (error) {
      console.error("Erreur chargement messages:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadMessages();
  }, []);

  const handleView = (message: ContactMessage): void => {
    setSelectedMessage(message);
    setIsModalOpen(true);
    // Marquer comme lu
    if (message.status === "NEW") {
      axios.patch("/api/contact", { id: message.id, status: "READ" })
        .then(() => loadMessages())
        .catch(console.error);
    }
  };

  const handleStatusChange = async (id: string, status: string): Promise<void> => {
    try {
      await axios.patch("/api/contact", { id, status });
      await loadMessages();
    } catch (error) {
      console.error("Erreur mise à jour statut:", error);
    }
  };

  const columns: Column<ContactMessage>[] = [
    {
      key: "fullName",
      header: t("columns.fullName"),
    },
    {
      key: "email",
      header: t("columns.email"),
    },
    {
      key: "subject",
      header: t("columns.subject"),
    },
    {
      key: "createdAt",
      header: t("columns.date"),
      render: (item) =>
        new Intl.DateTimeFormat("fr-FR", {
          day: "numeric",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }).format(item.createdAt),
    },
    {
      key: "status",
      header: t("columns.status"),
      render: (item) => {
        const variant =
          item.status === "NEW" ? "primary"
          : item.status === "READ" ? "neutral"
          : item.status === "REPLIED" ? "gold"
          : "neutral";
        return <Badge variant={variant}>{item.status}</Badge>;
      },
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
      <div>
        <h1 className="font-serif text-2xl font-semibold text-black md:text-3xl">
          {t("title")}
        </h1>
        <p className="mt-2 font-body text-sm text-slate-light">{t("description")}</p>
      </div>

      <div className="mt-8">
        <AdminTable
          data={messages}
          columns={columns}
          onView={handleView}
        />
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setSelectedMessage(null); }}
        title={selectedMessage?.subject}
      >
        {selectedMessage ? (
          <div className="space-y-4">
            <div className="grid gap-2 sm:grid-cols-2">
              <div>
                <p className="font-sans text-xs font-medium uppercase tracking-wider text-slate-light">
                  {t("fullName")}
                </p>
                <p className="font-body text-base text-slate">{selectedMessage.fullName}</p>
              </div>
              <div>
                <p className="font-sans text-xs font-medium uppercase tracking-wider text-slate-light">
                  {t("email")}
                </p>
                <a
                  href={`mailto:${selectedMessage.email}`}
                  className="font-body text-base text-primary hover:underline"
                >
                  {selectedMessage.email}
                </a>
              </div>
              {selectedMessage.phone ? (
                <div>
                  <p className="font-sans text-xs font-medium uppercase tracking-wider text-slate-light">
                    {t("phone")}
                  </p>
                  <p className="font-body text-base text-slate">{selectedMessage.phone}</p>
                </div>
              ) : null}
              {selectedMessage.organization ? (
                <div>
                  <p className="font-sans text-xs font-medium uppercase tracking-wider text-slate-light">
                    {t("organization")}
                  </p>
                  <p className="font-body text-base text-slate">{selectedMessage.organization}</p>
                </div>
              ) : null}
            </div>

            <div>
              <p className="font-sans text-xs font-medium uppercase tracking-wider text-slate-light">
                {t("message")}
              </p>
              <div className="mt-2 rounded-lg bg-cream p-4 font-body text-sm text-slate whitespace-pre-wrap">
                {selectedMessage.message}
              </div>
            </div>

            <div className="flex items-center gap-3 pt-4 border-t border-border">
              <p className="font-sans text-xs font-medium uppercase tracking-wider text-slate-light">
                {t("status")}
              </p>
              <select
                value={selectedMessage.status}
                onChange={(e) => handleStatusChange(selectedMessage.id, e.target.value)}
                className="rounded-lg border border-border px-3 py-1.5 font-body text-sm focus:border-primary focus:outline-none"
              >
                <option value="NEW">Nouveau</option>
                <option value="READ">Lu</option>
                <option value="REPLIED">Répondu</option>
                <option value="ARCHIVED">Archivé</option>
              </select>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-border">
              <a
                href={`mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject}`}
                className="rounded-lg bg-primary px-4 py-2 font-sans text-sm font-semibold text-white transition-colors hover:bg-primary-dark"
              >
                {t("reply")}
              </a>
            </div>
          </div>
        ) : null}
      </Modal>
    </div>
  );
}
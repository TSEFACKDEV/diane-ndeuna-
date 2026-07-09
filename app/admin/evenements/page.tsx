// app/admin/evenements/page.tsx
"use client";

import { type ReactNode, useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import axios from "axios";
import { AdminTable, type Column } from "@/components/admin/AdminTable";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { EventForm } from "@/components/admin/EventForm";
import { IoAdd } from "react-icons/io5";
import { Event } from "@/lib/generated/prisma/client";


export default function AdminEventsPage(): ReactNode {
  const t = useTranslations("admin.events");
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);

  const loadEvents = async (): Promise<void> => {
    setIsLoading(true);
    try {
      const { data } = await axios.get("/api/events");
      setEvents(data);
    } catch (error) {
      console.error("Erreur chargement événements:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadEvents();
  }, []);

  const handleDelete = async (event: Event): Promise<void> => {
    if (!confirm(t("confirmDelete"))) return;
    try {
      await axios.delete(`/api/events/${event.id}`);
      await loadEvents();
    } catch (error) {
      console.error("Erreur suppression:", error);
    }
  };

  const handleEdit = (event: Event): void => {
    setEditingEvent(event);
    setIsModalOpen(true);
  };

  const handleFormSuccess = async (): Promise<void> => {
    setIsModalOpen(false);
    setEditingEvent(null);
    await loadEvents();
  };

  const columns: Column<Event>[] = [
    {
      key: "titleFr",
      header: t("columns.title"),
      render: (item) => item.titleFr,
    },
    {
      key: "location",
      header: t("columns.location"),
    },
    {
      key: "startDate",
      header: t("columns.date"),
      render: (item) =>
        new Intl.DateTimeFormat("fr-FR", {
          day: "numeric",
          month: "short",
          year: "numeric",
        }).format(item.startDate),
    },
    {
      key: "status",
      header: t("columns.status"),
      render: (item) => {
        const variant =
          item.status === "UPCOMING"
            ? "gold"
            : item.status === "ONGOING"
            ? "primary"
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
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-serif text-2xl font-semibold text-black md:text-3xl">
            {t("title")}
          </h1>
          <p className="mt-2 font-body text-sm text-slate-light">{t("description")}</p>
        </div>
        <Button variant="primary" onClick={() => { setEditingEvent(null); setIsModalOpen(true); }}>
          <IoAdd size={18} />
          {t("add")}
        </Button>
      </div>

      <div className="mt-8">
        <AdminTable
          data={events}
          columns={columns}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setEditingEvent(null); }}
        title={editingEvent ? t("edit") : t("add")}
      >
        <EventForm
          initialData={editingEvent}
          onSuccess={handleFormSuccess}
          onCancel={() => { setIsModalOpen(false); setEditingEvent(null); }}
        />
      </Modal>
    </div>
  );
}
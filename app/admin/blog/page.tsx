// app/admin/blog/page.tsx
"use client";

import { type ReactNode, useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import axios from "axios";
import { AdminTable, type Column } from "@/components/admin/AdminTable";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { BlogForm } from "@/components/admin/BlogForm";
import { IoAdd } from "react-icons/io5";
import { BlogPost } from "@/lib/generated/prisma/client";


export default function AdminBlogPage(): ReactNode {
  const t = useTranslations("admin.blog");
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);

  const loadPosts = async (): Promise<void> => {
    setIsLoading(true);
    try {
      const { data } = await axios.get("/api/blog");
      setPosts(data);
    } catch (error) {
      console.error("Erreur chargement articles:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadPosts();
  }, []);

  const handleDelete = async (post: BlogPost): Promise<void> => {
    if (!confirm(t("confirmDelete"))) return;
    try {
      await axios.delete(`/api/blog/${post.slug}`);
      await loadPosts();
    } catch (error) {
      console.error("Erreur suppression:", error);
    }
  };

  const handleEdit = (post: BlogPost): void => {
    setEditingPost(post);
    setIsModalOpen(true);
  };

  const handleFormSuccess = async (): Promise<void> => {
    setIsModalOpen(false);
    setEditingPost(null);
    await loadPosts();
  };

  const columns: Column<BlogPost>[] = [
    {
      key: "titleFr",
      header: t("columns.title"),
      render: (item) => item.titleFr,
    },
    {
      key: "slug",
      header: t("columns.slug"),
    },
    {
      key: "isPublished",
      header: t("columns.status"),
      render: (item) => (
        <Badge variant={item.isPublished ? "gold" : "neutral"}>
          {item.isPublished ? t("published") : t("draft")}
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
        <Button variant="primary" onClick={() => { setEditingPost(null); setIsModalOpen(true); }}>
          <IoAdd size={18} />
          {t("add")}
        </Button>
      </div>

      <div className="mt-8">
        <AdminTable
          data={posts}
          columns={columns}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setEditingPost(null); }}
        title={editingPost ? t("edit") : t("add")}
      >
        <BlogForm
          initialData={editingPost}
          onSuccess={handleFormSuccess}
          onCancel={() => { setIsModalOpen(false); setEditingPost(null); }}
        />
      </Modal>
    </div>
  );
}
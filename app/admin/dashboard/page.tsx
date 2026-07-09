// app/admin/dashboard/page.tsx
import { type ReactNode } from "react";
import { getTranslations } from "next-intl/server";
import { prisma } from "@/lib/prisma";
import { StatCard } from "@/components/admin/StatCard";
import {
  IoPeople,
  IoCalendar,
  IoBook,
  IoNewspaper,
  IoMail,
  IoChatbubbles,
} from "react-icons/io5";

export default async function AdminDashboardPage(): Promise<ReactNode> {
  const t = await getTranslations("admin.dashboard");

  const [
    membersCount,
    eventsCount,
    resourcesCount,
    blogPostsCount,
    subscribersCount,
    messagesCount,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.event.count(),
    prisma.resource.count(),
    prisma.blogPost.count({ where: { isPublished: true } }),
    prisma.newsletterSubscriber.count({ where: { isActive: true } }),
    prisma.contactMessage.count({ where: { status: "NEW" } }),
  ]);

  const stats = [
    {
      label: t("stats.members"),
      value: membersCount,
      icon: IoPeople,
      color: "primary",
    },
    {
      label: t("stats.events"),
      value: eventsCount,
      icon: IoCalendar,
      color: "gold",
    },
    {
      label: t("stats.resources"),
      value: resourcesCount,
      icon: IoBook,
      color: "slate",
    },
    {
      label: t("stats.blogPosts"),
      value: blogPostsCount,
      icon: IoNewspaper,
      color: "primary",
    },
    {
      label: t("stats.subscribers"),
      value: subscribersCount,
      icon: IoMail,
      color: "gold",
    },
    {
      label: t("stats.messages"),
      value: messagesCount,
      icon: IoChatbubbles,
      color: "slate",
    },
  ];

  return (
    <div>
      <h1 className="font-serif text-2xl font-semibold text-black md:text-3xl">
        {t("title")}
      </h1>
      <p className="mt-2 font-body text-sm text-slate-light">{t("description")}</p>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>
    </div>
  );
}
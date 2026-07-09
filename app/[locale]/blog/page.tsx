// app/[locale]/blog/page.tsx
import { type ReactNode } from "react";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { prisma } from "@/lib/prisma";
import { BlogCard } from "@/components/ui/BlogCard";
import { SectionTitle } from "@/components/ui/SectionTitle";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "blog.index" });

  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function BlogPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<ReactNode> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "blog" });

  const posts = await prisma.blogPost.findMany({
    where: { isPublished: true },
    orderBy: { publishedAt: "desc" },
    include: {
      author: {
        select: {
          fullName: true,
        },
      },
    },
  });

  const postsLocalized = posts.map((post) => ({
    slug: post.slug,
    title: locale === "fr" ? post.titleFr : post.titleEn,
    excerpt: locale === "fr" ? post.excerptFr : post.excerptEn,
    coverImageUrl: post.coverImageUrl,
    publishedAt: post.publishedAt!,
    authorName: post.author.fullName,
  }));

  return (
    <div className="bg-cream pt-32 pb-20 md:pt-44 md:pb-28">
      <div className="container-site">
        <SectionTitle
          subtitle={t("index.eyebrow")}
          title={t("index.title")}
          align="left"
        />
        <p className="mt-6 max-w-2xl font-body text-base leading-relaxed text-slate-light">
          {t("index.description")}
        </p>

        {postsLocalized.length === 0 ? (
          <p className="mt-8 font-body text-sm text-slate-light">{t("noPosts")}</p>
        ) : (
          <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {postsLocalized.map((post) => (
              <BlogCard key={post.slug} {...post} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
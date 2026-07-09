// app/[locale]/blog/[slug]/page.tsx
import { type ReactNode } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { prisma } from "@/lib/prisma";
import { ImageSlot } from "@/components/ui/ImageSlot";
import { Link } from "@/i18n/navigation";
import { IoArrowBack, IoCalendarOutline, IoPersonOutline } from "react-icons/io5";

interface BlogPostPageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const post = await prisma.blogPost.findUnique({
    where: { slug },
    select: {
      titleFr: true,
      titleEn: true,
      excerptFr: true,
      excerptEn: true,
    },
  });

  if (!post) {
    return { title: "Article non trouvé" };
  }

  const title = locale === "fr" ? post.titleFr : post.titleEn;
  const description = locale === "fr" ? post.excerptFr : post.excerptEn;

  return {
    title,
    description,
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps): Promise<ReactNode> {
  const { locale, slug } = await params;
  const t = await getTranslations({ locale, namespace: "blog" });

  const post = await prisma.blogPost.findUnique({
    where: { slug },
    include: {
      author: {
        select: {
          fullName: true,
        },
      },
    },
  });

  if (!post || !post.isPublished) {
    notFound();
  }

  const title = locale === "fr" ? post.titleFr : post.titleEn;
  const content = locale === "fr" ? post.contentFr : post.contentEn;
  const formattedDate = new Intl.DateTimeFormat(locale === "fr" ? "fr-FR" : "en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(post.publishedAt!);

  return (
    <article className="bg-cream pt-32 pb-20 md:pt-44 md:pb-28">
      <div className="container-site max-w-3xl">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 font-sans text-sm font-medium text-slate-light transition-colors hover:text-primary"
        >
          <IoArrowBack size={14} />
          {t("backToBlog")}
        </Link>

        {post.coverImageUrl ? (
          <div className="relative mt-8 h-72 w-full overflow-hidden rounded-xl">
            <ImageSlot
              src={post.coverImageUrl}
              alt={title}
              fill
              priority
              className="object-cover"
            />
          </div>
        ) : null}

        <h1 className="mt-8 font-serif text-3xl font-semibold text-black md:text-4xl">
          {title}
        </h1>

        <div className="mt-4 flex flex-wrap items-center gap-4 font-sans text-sm text-slate-light">
          <span className="flex items-center gap-1">
            <IoCalendarOutline size={16} />
            {formattedDate}
          </span>
          <span className="flex items-center gap-1">
            <IoPersonOutline size={16} />
            {post.author.fullName}
          </span>
        </div>

        <div
          className="prose prose-slate mt-8 max-w-none font-body text-base leading-relaxed text-slate"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </div>
    </article>
  );
}
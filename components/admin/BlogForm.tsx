// components/admin/BlogForm.tsx
"use client";

import { type ReactNode, useState } from "react";
import { useTranslations } from "next-intl";
import { Formik, Form, Field, type FormikHelpers } from "formik";
import * as yup from "yup";
import axios from "axios";
import { Button } from "@/components/ui/Button";
import { BlogPost } from "@/lib/generated/prisma/browser";
import { FileUpload } from "../ui/FileUpload";


const blogSchema = yup.object({
  slug: yup.string().trim().required("Slug requis")
    .matches(/^[a-z0-9-]+$/, "Slug invalide (minuscules, chiffres, tirets)"),
  titleFr: yup.string().trim().required("Titre FR requis"),
  titleEn: yup.string().trim().required("Titre EN requis"),
  excerptFr: yup.string().trim().required("Extrait FR requis"),
  excerptEn: yup.string().trim().required("Extrait EN requis"),
  contentFr: yup.string().trim().required("Contenu FR requis"),
  contentEn: yup.string().trim().required("Contenu EN requis"),
  isPublished: yup.boolean().optional(),
  coverImageUrl: yup.string().trim().url().optional().nullable(),
});

type BlogFormValues = yup.InferType<typeof blogSchema>;

interface BlogFormProps {
  initialData?: BlogPost | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export function BlogForm({ initialData, onSuccess, onCancel }: BlogFormProps): ReactNode {
  const t = useTranslations("admin.blog.form");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const initialValues: BlogFormValues = initialData
    ? {
        slug: initialData.slug,
        titleFr: initialData.titleFr,
        titleEn: initialData.titleEn,
        excerptFr: initialData.excerptFr,
        excerptEn: initialData.excerptEn,
        contentFr: initialData.contentFr,
        contentEn: initialData.contentEn,
        isPublished: initialData.isPublished,
        coverImageUrl: initialData.coverImageUrl,
      }
    : {
        slug: "",
        titleFr: "",
        titleEn: "",
        excerptFr: "",
        excerptEn: "",
        contentFr: "",
        contentEn: "",
        isPublished: false,
        coverImageUrl: "",
      };

  async function handleSubmit(
    values: BlogFormValues,
    helpers: FormikHelpers<BlogFormValues>
  ): Promise<void> {
    setIsSubmitting(true);
    setError(null);

    try {
      const payload = {
        ...values,
        publishedAt: values.isPublished ? new Date().toISOString() : null,
      };

      if (initialData) {
        await axios.put(`/api/blog/${initialData.slug}`, payload);
      } else {
        await axios.post("/api/blog", payload);
      }

      onSuccess();
    } catch (err) {
      const message = axios.isAxiosError(err)
        ? err.response?.data?.error || t("error")
        : t("error");
      setError(message);
    } finally {
      setIsSubmitting(false);
      helpers.setSubmitting(false);
    }
  }

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={blogSchema}
      onSubmit={handleSubmit}
    >
      {({ errors, touched , setFieldValue}) => (
        <Form className="space-y-4">
          <div>
            <label className="block font-sans text-sm font-medium text-slate">
              {t("slug")} *
            </label>
            <Field
              name="slug"
              placeholder="mon-article"
              className="mt-1 w-full rounded-lg border border-border px-4 py-2 font-body text-sm focus:border-primary focus:outline-none"
            />
            {errors.slug && touched.slug ? (
              <p className="mt-1 font-body text-xs text-error">{errors.slug}</p>
            ) : null}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block font-sans text-sm font-medium text-slate">
                {t("titleFr")} *
              </label>
              <Field
                name="titleFr"
                className="mt-1 w-full rounded-lg border border-border px-4 py-2 font-body text-sm focus:border-primary focus:outline-none"
              />
              {errors.titleFr && touched.titleFr ? (
                <p className="mt-1 font-body text-xs text-error">{errors.titleFr}</p>
              ) : null}
            </div>
            <div>
              <label className="block font-sans text-sm font-medium text-slate">
                {t("titleEn")} *
              </label>
              <Field
                name="titleEn"
                className="mt-1 w-full rounded-lg border border-border px-4 py-2 font-body text-sm focus:border-primary focus:outline-none"
              />
              {errors.titleEn && touched.titleEn ? (
                <p className="mt-1 font-body text-xs text-error">{errors.titleEn}</p>
              ) : null}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block font-sans text-sm font-medium text-slate">
                {t("excerptFr")} *
              </label>
              <Field
                as="textarea"
                name="excerptFr"
                rows={2}
                className="mt-1 w-full rounded-lg border border-border px-4 py-2 font-body text-sm focus:border-primary focus:outline-none"
              />
              {errors.excerptFr && touched.excerptFr ? (
                <p className="mt-1 font-body text-xs text-error">{errors.excerptFr}</p>
              ) : null}
            </div>
            <div>
              <label className="block font-sans text-sm font-medium text-slate">
                {t("excerptEn")} *
              </label>
              <Field
                as="textarea"
                name="excerptEn"
                rows={2}
                className="mt-1 w-full rounded-lg border border-border px-4 py-2 font-body text-sm focus:border-primary focus:outline-none"
              />
              {errors.excerptEn && touched.excerptEn ? (
                <p className="mt-1 font-body text-xs text-error">{errors.excerptEn}</p>
              ) : null}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block font-sans text-sm font-medium text-slate">
                {t("contentFr")} *
              </label>
              <Field
                as="textarea"
                name="contentFr"
                rows={6}
                className="mt-1 w-full rounded-lg border border-border px-4 py-2 font-body text-sm focus:border-primary focus:outline-none"
              />
              {errors.contentFr && touched.contentFr ? (
                <p className="mt-1 font-body text-xs text-error">{errors.contentFr}</p>
              ) : null}
            </div>
            <div>
              <label className="block font-sans text-sm font-medium text-slate">
                {t("contentEn")} *
              </label>
              <Field
                as="textarea"
                name="contentEn"
                rows={6}
                className="mt-1 w-full rounded-lg border border-border px-4 py-2 font-body text-sm focus:border-primary focus:outline-none"
              />
              {errors.contentEn && touched.contentEn ? (
                <p className="mt-1 font-body text-xs text-error">{errors.contentEn}</p>
              ) : null}
            </div>
          </div>

          <div>
  <FileUpload
    label={t("coverImage")}
    folder="diane-ndeuna/blog"
    existingUrl={initialData?.coverImageUrl}
    onUploadSuccess={(url) => setFieldValue("coverImageUrl", url)}
    onUploadError={(err) => setError(err)}
    accept="image"
    maxSize={8}
  />
  <Field type="hidden" name="coverImageUrl" />
</div>

          <div className="flex items-center gap-2">
            <Field
              name="isPublished"
              type="checkbox"
              className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
            />
            <label className="font-body text-sm text-slate">{t("isPublished")}</label>
          </div>

          {error ? <p className="font-body text-sm text-error">{error}</p> : null}

          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <Button type="button" variant="outline" onClick={onCancel}>
              {t("cancel")}
            </Button>
            <Button type="submit" variant="primary" isLoading={isSubmitting}>
              {initialData ? t("update") : t("create")}
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
}
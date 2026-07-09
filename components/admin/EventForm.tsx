// components/admin/EventForm.tsx
"use client";

import { type ReactNode, useState } from "react";
import { useTranslations } from "next-intl";
import { Formik, Form, Field, type FormikHelpers } from "formik";
import * as yup from "yup";
import axios from "axios";
import { Button } from "@/components/ui/Button";
import { EventStatus } from "@/lib/generated/prisma/enums";
import { Event } from "@/lib/generated/prisma/client";
import { FileUpload } from "../ui/FileUpload";

const eventSchema = yup.object({
  titleFr: yup.string().trim().required("Titre FR requis"),
  titleEn: yup.string().trim().required("Titre EN requis"),
  descriptionFr: yup.string().trim().required("Description FR requise"),
  descriptionEn: yup.string().trim().required("Description EN requise"),
  location: yup.string().trim().required("Lieu requis"),
  startDate: yup.string().required("Date de début requise"),
  endDate: yup
    .string()
    .required("Date de fin requise")
    .test(
      "is-after-start",
      "La date de fin doit être après la date de début",
      function (value) {
        if (!value || !this.parent.startDate) return true;
        return new Date(value) >= new Date(this.parent.startDate);
      },
    ),
  status: yup
    .string()
    .oneOf(["UPCOMING", "ONGOING", "PAST", "CANCELLED"])
    .required(),
  isFeatured: yup.boolean().optional(),
  registrationUrl: yup.string().trim().url().optional().nullable(),
  coverImageUrl: yup.string().trim().url().optional().nullable(),
  coverImagePublicId: yup.string().optional().nullable(),
});

type EventFormValues = yup.InferType<typeof eventSchema>;

interface EventFormProps {
  initialData?: Event | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export function EventForm({
  initialData,
  onSuccess,
  onCancel,
}: EventFormProps): ReactNode {
  const t = useTranslations("admin.events.form");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const initialValues: EventFormValues = initialData
    ? {
        titleFr: initialData.titleFr,
        titleEn: initialData.titleEn,
        descriptionFr: initialData.descriptionFr,
        descriptionEn: initialData.descriptionEn,
        location: initialData.location,
        startDate: initialData.startDate.toISOString().split("T")[0],
        endDate: initialData.endDate.toISOString().split("T")[0],
        status: initialData.status,
        isFeatured: initialData.isFeatured,
        registrationUrl: initialData.registrationUrl || "",
        coverImageUrl: initialData.coverImageUrl,
        coverImagePublicId: null,
      }
    : {
        titleFr: "",
        titleEn: "",
        descriptionFr: "",
        descriptionEn: "",
        location: "",
        startDate: "",
        endDate: "",
        status: "UPCOMING" as EventStatus,
        isFeatured: false,
        registrationUrl: "",
        coverImageUrl: "",
        coverImagePublicId: null,
      };

  async function handleSubmit(
    values: EventFormValues,
    helpers: FormikHelpers<EventFormValues>,
  ): Promise<void> {
    setIsSubmitting(true);
    setError(null);

    try {
      const payload = {
        ...values,
        startDate: new Date(values.startDate),
        endDate: new Date(values.endDate),
      };

      if (initialData) {
        await axios.put(`/api/events/${initialData.id}`, payload);
      } else {
        await axios.post("/api/events", payload);
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
      validationSchema={eventSchema}
      onSubmit={handleSubmit}
    >
      {/* setFieldValue est maintenant déstructuré ici */}
      {({ errors, touched, setFieldValue }) => (
        <Form className="space-y-4">
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
                {t("descriptionFr")} *
              </label>
              <Field
                as="textarea"
                name="descriptionFr"
                rows={3}
                className="mt-1 w-full rounded-lg border border-border px-4 py-2 font-body text-sm focus:border-primary focus:outline-none"
              />
              {errors.descriptionFr && touched.descriptionFr ? (
                <p className="mt-1 font-body text-xs text-error">{errors.descriptionFr}</p>
              ) : null}
            </div>
            <div>
              <label className="block font-sans text-sm font-medium text-slate">
                {t("descriptionEn")} *
              </label>
              <Field
                as="textarea"
                name="descriptionEn"
                rows={3}
                className="mt-1 w-full rounded-lg border border-border px-4 py-2 font-body text-sm focus:border-primary focus:outline-none"
              />
              {errors.descriptionEn && touched.descriptionEn ? (
                <p className="mt-1 font-body text-xs text-error">{errors.descriptionEn}</p>
              ) : null}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block font-sans text-sm font-medium text-slate">
                {t("location")} *
              </label>
              <Field
                name="location"
                className="mt-1 w-full rounded-lg border border-border px-4 py-2 font-body text-sm focus:border-primary focus:outline-none"
              />
              {errors.location && touched.location ? (
                <p className="mt-1 font-body text-xs text-error">{errors.location}</p>
              ) : null}
            </div>
            <div>
              <label className="block font-sans text-sm font-medium text-slate">
                {t("status")} *
              </label>
              <Field
                as="select"
                name="status"
                className="mt-1 w-full rounded-lg border border-border px-4 py-2 font-body text-sm focus:border-primary focus:outline-none"
              >
                <option value="UPCOMING">À venir</option>
                <option value="ONGOING">En cours</option>
                <option value="PAST">Passé</option>
                <option value="CANCELLED">Annulé</option>
              </Field>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block font-sans text-sm font-medium text-slate">
                {t("startDate")} *
              </label>
              <Field
                name="startDate"
                type="date"
                className="mt-1 w-full rounded-lg border border-border px-4 py-2 font-body text-sm focus:border-primary focus:outline-none"
              />
              {errors.startDate && touched.startDate ? (
                <p className="mt-1 font-body text-xs text-error">{errors.startDate}</p>
              ) : null}
            </div>
            <div>
              <label className="block font-sans text-sm font-medium text-slate">
                {t("endDate")} *
              </label>
              <Field
                name="endDate"
                type="date"
                className="mt-1 w-full rounded-lg border border-border px-4 py-2 font-body text-sm focus:border-primary focus:outline-none"
              />
              {errors.endDate && touched.endDate ? (
                <p className="mt-1 font-body text-xs text-error">{errors.endDate}</p>
              ) : null}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block font-sans text-sm font-medium text-slate">
                {t("registrationUrl")}
              </label>
              <Field
                name="registrationUrl"
                type="url"
                placeholder="https://..."
                className="mt-1 w-full rounded-lg border border-border px-4 py-2 font-body text-sm focus:border-primary focus:outline-none"
              />
            </div>
            <div>
              <FileUpload
                label={t("coverImage")}
                folder="diane-ndeuna/events"
                existingUrl={initialData?.coverImageUrl}
                onUploadSuccess={(url, publicId) => {
                  setFieldValue("coverImageUrl", url);
                  setFieldValue("coverImagePublicId", publicId);
                }}
                onUploadError={(err) => setError(err)}
                accept="image"
                maxSize={8}
              />
              <Field type="hidden" name="coverImageUrl" />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Field
              name="isFeatured"
              type="checkbox"
              className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
            />
            <label className="font-body text-sm text-slate">{t("isFeatured")}</label>
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
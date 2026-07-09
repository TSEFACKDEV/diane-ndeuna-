// components/admin/NewsletterSendForm.tsx
"use client";

import { type ReactNode, useState } from "react";
import { useTranslations } from "next-intl";
import { Formik, Form, Field, type FormikHelpers } from "formik";
import * as yup from "yup";
import axios from "axios";
import { Button } from "@/components/ui/Button";

const sendSchema = yup.object({
  subject: yup.string().trim().required("Sujet requis"),
  content: yup.string().trim().required("Contenu requis"),
  fromName: yup.string().trim().optional(),
  testEmail: yup.string().trim().email("Email invalide").optional(),
});

type SendFormValues = yup.InferType<typeof sendSchema>;

interface NewsletterSendFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export function NewsletterSendForm({ onSuccess, onCancel }: NewsletterSendFormProps): ReactNode {
  const t = useTranslations("admin.newsletter.form");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isTestMode, setIsTestMode] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ sent: number; failed: number } | null>(null);

  const initialValues: SendFormValues = {
    subject: "",
    content: "",
    fromName: "Diane NDEUNA",
    testEmail: "",
  };

  async function handleSubmit(
    values: SendFormValues,
    helpers: FormikHelpers<SendFormValues>
  ): Promise<void> {
    setIsSubmitting(true);
    setError(null);
    setResult(null);

    try {
      const payload = {
        ...values,
        testEmail: isTestMode ? values.testEmail : undefined,
      };

      const { data } = await axios.post("/api/newsletter/send", payload);
      setResult({ sent: data.sent, failed: data.failed });

      if (data.sent > 0 && data.failed === 0) {
        setTimeout(onSuccess, 1500);
      }
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
      validationSchema={sendSchema}
      onSubmit={handleSubmit}
    >
      {({ errors, touched }) => (
        <Form className="space-y-4">
          <div>
            <label className="block font-sans text-sm font-medium text-slate">
              {t("fromName")}
            </label>
            <Field
              name="fromName"
              className="mt-1 w-full rounded-lg border border-border px-4 py-2 font-body text-sm focus:border-primary focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-sans text-sm font-medium text-slate">
              {t("subject")} *
            </label>
            <Field
              name="subject"
              className="mt-1 w-full rounded-lg border border-border px-4 py-2 font-body text-sm focus:border-primary focus:outline-none"
            />
            {errors.subject && touched.subject ? (
              <p className="mt-1 font-body text-xs text-error">{errors.subject}</p>
            ) : null}
          </div>

          <div>
            <label className="block font-sans text-sm font-medium text-slate">
              {t("content")} *
            </label>
            <Field
              as="textarea"
              name="content"
              rows={8}
              placeholder="<p>Bonjour,</p><p>...</p>"
              className="mt-1 w-full rounded-lg border border-border px-4 py-2 font-body text-sm focus:border-primary focus:outline-none"
            />
            <p className="mt-1 font-body text-xs text-slate-light">{t("htmlHelp")}</p>
            {errors.content && touched.content ? (
              <p className="mt-1 font-body text-xs text-error">{errors.content}</p>
            ) : null}
          </div>

          <div>
            <label className="flex items-center gap-2 font-body text-sm text-slate">
              <input
                type="checkbox"
                checked={isTestMode}
                onChange={() => setIsTestMode(!isTestMode)}
                className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
              />
              {t("testMode")}
            </label>
          </div>

          {isTestMode ? (
            <div>
              <label className="block font-sans text-sm font-medium text-slate">
                {t("testEmail")}
              </label>
              <Field
                name="testEmail"
                type="email"
                placeholder="test@exemple.com"
                className="mt-1 w-full rounded-lg border border-border px-4 py-2 font-body text-sm focus:border-primary focus:outline-none"
              />
              {errors.testEmail && touched.testEmail ? (
                <p className="mt-1 font-body text-xs text-error">{errors.testEmail}</p>
              ) : null}
            </div>
          ) : null}

          {result ? (
            <div className="rounded-lg bg-green-50 p-4 text-center">
              <p className="font-body text-sm text-success">
                {t("sent")}: {result.sent} / {result.sent + result.failed}
                {result.failed > 0 ? ` (${t("failed")}: ${result.failed})` : ""}
              </p>
            </div>
          ) : null}

          {error ? <p className="font-body text-sm text-error">{error}</p> : null}

          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <Button type="button" variant="outline" onClick={onCancel}>
              {t("cancel")}
            </Button>
            <Button type="submit" variant="primary" isLoading={isSubmitting}>
              {isTestMode ? t("testButton") : t("sendButton")}
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
}
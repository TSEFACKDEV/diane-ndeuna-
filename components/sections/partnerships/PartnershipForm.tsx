// components/sections/partnerships/PartnershipForm.tsx
"use client";

import { type ReactNode, useState } from "react";
import { useTranslations } from "next-intl";
import { Formik, Form, Field, type FormikHelpers } from "formik";
import * as yup from "yup";
import axios from "axios";
import { Button } from "@/components/ui/Button";
import { IoCheckmarkCircle } from "react-icons/io5";

const partnershipSchema = yup.object({
  fullName: yup.string().trim().min(2, "Le nom est requis").required("Le nom est requis"),
  email: yup.string().trim().email("Adresse e-mail invalide").required("L'e-mail est requis"),
  phone: yup.string().trim().optional(),
  organization: yup.string().trim().min(2, "L'organisation est requise").required("L'organisation est requise"),
  subject: yup.string().trim().min(5, "Le sujet est requis").required("Le sujet est requis"),
  message: yup.string().trim().min(20, "Le message est trop court").required("Le message est requis"),
});

type PartnershipFormValues = yup.InferType<typeof partnershipSchema>;

const initialValues: PartnershipFormValues = {
  fullName: "",
  email: "",
  phone: "",
  organization: "",
  subject: "",
  message: "",
};

export function PartnershipForm(): ReactNode {
  const t = useTranslations("partnerships.form");
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  async function handleSubmit(
    values: PartnershipFormValues,
    helpers: FormikHelpers<PartnershipFormValues>
  ): Promise<void> {
    try {
      await axios.post("/api/contact", values);
      setIsSuccess(true);
      helpers.resetForm();
    } catch {
      helpers.setStatus(t("error"));
    } finally {
      helpers.setSubmitting(false);
    }
  }

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl bg-green-50 p-8 text-center">
        <IoCheckmarkCircle size={48} className="text-success" />
        <p className="mt-4 font-serif text-xl font-semibold text-black">{t("success")}</p>
        <p className="mt-2 font-body text-sm text-slate-light">{t("successDetail")}</p>
      </div>
    );
  }

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={partnershipSchema}
      onSubmit={handleSubmit}
    >
      {({ errors, touched, isSubmitting, status }) => (
        <Form className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Field
                name="fullName"
                placeholder={t("fullName")}
                className="w-full rounded-lg border border-border bg-cream px-4 py-3 font-body text-sm text-slate focus:border-primary focus:outline-none"
              />
              {errors.fullName && touched.fullName ? (
                <p className="mt-1 font-body text-xs text-error">{errors.fullName}</p>
              ) : null}
            </div>
            <div>
              <Field
                name="email"
                type="email"
                placeholder={t("email")}
                className="w-full rounded-lg border border-border bg-cream px-4 py-3 font-body text-sm text-slate focus:border-primary focus:outline-none"
              />
              {errors.email && touched.email ? (
                <p className="mt-1 font-body text-xs text-error">{errors.email}</p>
              ) : null}
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Field
                name="phone"
                placeholder={t("phone")}
                className="w-full rounded-lg border border-border bg-cream px-4 py-3 font-body text-sm text-slate focus:border-primary focus:outline-none"
              />
              {errors.phone && touched.phone ? (
                <p className="mt-1 font-body text-xs text-error">{errors.phone}</p>
              ) : null}
            </div>
            <div>
              <Field
                name="organization"
                placeholder={t("organization")}
                className="w-full rounded-lg border border-border bg-cream px-4 py-3 font-body text-sm text-slate focus:border-primary focus:outline-none"
              />
              {errors.organization && touched.organization ? (
                <p className="mt-1 font-body text-xs text-error">{errors.organization}</p>
              ) : null}
            </div>
          </div>
          <div>
            <Field
              name="subject"
              placeholder={t("subject")}
              className="w-full rounded-lg border border-border bg-cream px-4 py-3 font-body text-sm text-slate focus:border-primary focus:outline-none"
            />
            {errors.subject && touched.subject ? (
              <p className="mt-1 font-body text-xs text-error">{errors.subject}</p>
            ) : null}
          </div>
          <div>
            <Field
              as="textarea"
              name="message"
              rows={4}
              placeholder={t("message")}
              className="w-full rounded-lg border border-border bg-cream px-4 py-3 font-body text-sm text-slate focus:border-primary focus:outline-none"
            />
            {errors.message && touched.message ? (
              <p className="mt-1 font-body text-xs text-error">{errors.message}</p>
            ) : null}
          </div>
          {status ? <p className="font-body text-xs text-error">{status}</p> : null}
          <Button type="submit" variant="primary" isLoading={isSubmitting} className="w-full sm:w-auto">
            {t("submit")}
          </Button>
        </Form>
      )}
    </Formik>
  );
}
// components/sections/community/RegisterStep1.tsx
"use client";

import { type ReactNode } from "react";
import { useTranslations } from "next-intl";
import { Formik, Form, Field, type FormikHelpers } from "formik";
import { Button } from "@/components/ui/Button";
import { step1Schema, type Step1Values } from "@/lib/validation/register";

interface RegisterStep1Props {
  initialValues: Step1Values;
  onSubmit: (values: Step1Values) => void;
}

export function RegisterStep1({ initialValues, onSubmit }: RegisterStep1Props): ReactNode {
  const t = useTranslations("community.register.step1");

  async function handleSubmit(values: Step1Values, helpers: FormikHelpers<Step1Values>): Promise<void> {
    onSubmit(values);
    helpers.setSubmitting(false);
  }

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={step1Schema}
      onSubmit={handleSubmit}
    >
      {({ errors, touched, isSubmitting }) => (
        <Form className="space-y-5">
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
          <div>
            <Field
              name="password"
              type="password"
              placeholder={t("password")}
              className="w-full rounded-lg border border-border bg-cream px-4 py-3 font-body text-sm text-slate focus:border-primary focus:outline-none"
            />
            {errors.password && touched.password ? (
              <p className="mt-1 font-body text-xs text-error">{errors.password}</p>
            ) : null}
          </div>
          <div>
            <Field
              name="confirmPassword"
              type="password"
              placeholder={t("confirmPassword")}
              className="w-full rounded-lg border border-border bg-cream px-4 py-3 font-body text-sm text-slate focus:border-primary focus:outline-none"
            />
            {errors.confirmPassword && touched.confirmPassword ? (
              <p className="mt-1 font-body text-xs text-error">{errors.confirmPassword}</p>
            ) : null}
          </div>
          <div className="flex justify-end">
            <Button type="submit" variant="primary" isLoading={isSubmitting}>
              {t("next")}
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
}
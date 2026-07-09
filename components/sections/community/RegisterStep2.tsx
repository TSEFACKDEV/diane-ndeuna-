// components/sections/community/RegisterStep2.tsx
"use client";

import { type ReactNode } from "react";
import { useTranslations } from "next-intl";
import { Formik, Form, Field, type FormikHelpers } from "formik";
import { Button } from "@/components/ui/Button";
import { step2Schema, type Step2Values } from "@/lib/validation/register";

interface RegisterStep2Props {
  initialValues: Step2Values;
  onBack: () => void;
  onSubmit: (values: Step2Values) => void;
}

export function RegisterStep2({ initialValues, onBack, onSubmit }: RegisterStep2Props): ReactNode {
  const t = useTranslations("community.register.step2");

  async function handleSubmit(values: Step2Values, helpers: FormikHelpers<Step2Values>): Promise<void> {
    onSubmit(values);
    helpers.setSubmitting(false);
  }

  const countryOptions = [
    "Cameroun",
    "Sénégal",
    "Côte d'Ivoire",
    "Bénin",
    "Togo",
    "Burkina Faso",
    "Mali",
    "Niger",
    "Gabon",
    "République du Congo",
    "République Démocratique du Congo",
    "France",
    "Belgique",
    "Canada",
    "Autre",
  ];

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={step2Schema}
      onSubmit={handleSubmit}
    >
      {({ errors, touched, isSubmitting }) => (
        <Form className="space-y-5">
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
          <div>
            <Field
              as="select"
              name="country"
              className="w-full rounded-lg border border-border bg-cream px-4 py-3 font-body text-sm text-slate focus:border-primary focus:outline-none"
            >
              <option value="">{t("selectCountry")}</option>
              {countryOptions.map((country) => (
                <option key={country} value={country}>
                  {country}
                </option>
              ))}
            </Field>
            {errors.country && touched.country ? (
              <p className="mt-1 font-body text-xs text-error">{errors.country}</p>
            ) : null}
          </div>
          <div className="flex justify-between">
            <Button type="button" variant="outline" onClick={onBack}>
              {t("back")}
            </Button>
            <Button type="submit" variant="primary" isLoading={isSubmitting}>
              {t("next")}
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
}
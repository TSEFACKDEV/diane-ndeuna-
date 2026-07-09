"use client";

import { type ReactNode, useState } from "react";
import { useTranslations } from "next-intl";
import { Formik, Form, Field, type FormikHelpers } from "formik";
import axios from "axios";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { Button } from "@/components/ui/Button";
import { newsletterSchema, type NewsletterSchemaType } from "@/lib/validation/newsletter";
import { IoCheckmarkCircle } from "react-icons/io5";

const initialValues: NewsletterSchemaType = { email: "", fullName: "" };

export function NewsletterSection(): ReactNode {
  const t = useTranslations("home.newsletter");
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  async function handleSubmit(
    values: NewsletterSchemaType,
    helpers: FormikHelpers<NewsletterSchemaType>
  ): Promise<void> {
    try {
      await axios.post("/api/newsletter/subscribe", values);
      setIsSuccess(true);
      helpers.resetForm();
    } catch {
      helpers.setStatus(t("error"));
    } finally {
      helpers.setSubmitting(false);
    }
  }

  return (
    <section className="section-padding bg-primary-dark">
      <div className="container-site">
        <AnimatedSection className="mx-auto max-w-2xl text-center">
          <p className="font-sans text-sm font-semibold uppercase tracking-[0.2em] text-gold-light">
            {t("eyebrow")}
          </p>
          <h2 className="mt-3 font-serif text-3xl font-semibold text-white md:text-4xl">
            {t("title")}
          </h2>
          <p className="mt-4 font-body text-base text-cream/80">
            {t("description")}
          </p>

          {isSuccess ? (
            <div className="mt-8 flex items-center justify-center gap-2 rounded-xl bg-white/10 px-6 py-4 text-gold-light">
              <IoCheckmarkCircle size={22} />
              <span className="font-sans text-sm font-medium">{t("success")}</span>
            </div>
          ) : (
            <Formik
              initialValues={initialValues}
              validationSchema={newsletterSchema}
              onSubmit={handleSubmit}
            >
              {({ errors, touched, isSubmitting, status }) => (
                <Form className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <div className="flex-1">
                    <Field
                      name="email"
                      type="email"
                      placeholder={t("placeholder")}
                      className="w-full rounded-lg border border-white/20 bg-white/5 px-4 py-3 font-body text-sm text-white placeholder:text-cream/50 focus:border-gold focus:outline-none"
                    />
                    {errors.email && touched.email ? (
                      <p className="mt-1 text-left font-body text-xs text-error">{errors.email}</p>
                    ) : null}
                  </div>
                  <Button type="submit" variant="secondary" isLoading={isSubmitting}>
                    {t("button")}
                  </Button>
                  {status ? <p className="mt-2 font-body text-xs text-error">{status}</p> : null}
                </Form>
              )}
            </Formik>
          )}
        </AnimatedSection>
      </div>
    </section>
  );
}
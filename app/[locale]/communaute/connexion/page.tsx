// app/[locale]/communaute/connexion/page.tsx
"use client";

import { type ReactNode, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { Formik, Form, Field, type FormikHelpers } from "formik";
import * as yup from "yup";
import { useAuth } from "@/hooks/useAuth";
import { useUser } from "@/hooks/useUser";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Link } from "@/i18n/navigation";

const loginSchema = yup.object({
  email: yup.string().trim().email("Adresse e-mail invalide").required("L'e-mail est requis"),
  password: yup.string().required("Le mot de passe est requis"),
});

type LoginValues = yup.InferType<typeof loginSchema>;

const initialValues: LoginValues = {
  email: "",
  password: "",
};

export default function LoginPage(): ReactNode {
  const t = useTranslations("community.login");
  const { user, isLoading: userLoading } = useUser();
  const { login } = useAuth();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userLoading && user) {
      router.push("/communaute/ressources-membres");
    }
  }, [user, userLoading, router]);

  async function handleSubmit(
    values: LoginValues,
    helpers: FormikHelpers<LoginValues>
  ): Promise<void> {
    setError(null);
    try {
      await login(values);
      router.push("/communaute/ressources-membres");
    } catch (err) {
      setError(err instanceof Error ? err.message : t("error"));
    } finally {
      helpers.setSubmitting(false);
    }
  }

  if (userLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center bg-cream pt-32">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gold border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="bg-cream pt-32 pb-20 md:pt-44 md:pb-28">
      <div className="container-site max-w-md">
        <SectionTitle
          subtitle={t("eyebrow")}
          title={t("title")}
          align="center"
        />

        <Card variant="elevated" className="mt-8">
          <Formik
            initialValues={initialValues}
            validationSchema={loginSchema}
            onSubmit={handleSubmit}
          >
            {({ errors, touched, isSubmitting }) => (
              <Form className="space-y-5">
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
                {error ? (
                  <p className="font-body text-sm text-error">{error}</p>
                ) : null}
                <Button type="submit" variant="primary" isLoading={isSubmitting} className="w-full">
                  {t("submit")}
                </Button>
              </Form>
            )}
          </Formik>
        </Card>

        <p className="mt-6 text-center font-body text-sm text-slate-light">
          {t("noAccount")}{" "}
          <Link href="/communaute/inscription" className="text-primary hover:underline">
            {t("registerLink")}
          </Link>
        </p>
      </div>
    </div>
  );
}
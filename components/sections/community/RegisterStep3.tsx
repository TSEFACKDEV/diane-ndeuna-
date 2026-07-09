// components/sections/community/RegisterStep3.tsx
"use client";

import { type ReactNode, useState } from "react";
import { useTranslations } from "next-intl";
import { Formik, Form, Field, type FormikHelpers } from "formik";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { step3Schema, type Step3Values } from "@/lib/validation/register";
import { IoCheckmarkCircle, IoStar } from "react-icons/io5";

interface RegisterStep3Props {
  initialValues: Step3Values;
  onBack: () => void;
  onSubmit: (values: Step3Values) => Promise<void>;
  isSubmitting: boolean;
}

export function RegisterStep3({
  initialValues,
  onBack,
  onSubmit,
  isSubmitting: externalIsSubmitting,
}: RegisterStep3Props): ReactNode {
  const t = useTranslations("community.register.step3");
  const [selectedPlan, setSelectedPlan] = useState<string>(initialValues.plan || "basic");

  const plans = [
    {
      id: "basic",
      name: t("plans.basic.name"),
      price: "10 000 FCFA",
      period: t("plans.basic.period"),
      features: t.raw("plans.basic.features") as string[],
    },
    {
      id: "premium",
      name: t("plans.premium.name"),
      price: "25 000 FCFA",
      period: t("plans.premium.period"),
      features: t.raw("plans.premium.features") as string[],
      popular: true,
    },
  ];

  async function handleSubmit(values: Step3Values, helpers: FormikHelpers<Step3Values>): Promise<void> {
    await onSubmit(values);
    helpers.setSubmitting(false);
  }

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={step3Schema}
      onSubmit={handleSubmit}
    >
      {({ setFieldValue, errors, touched, isSubmitting }) => {
        const isSubmittingState = isSubmitting || externalIsSubmitting;

        return (
          <Form className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              {plans.map((plan) => {
                const isSelected = selectedPlan === plan.id;
                return (
                  <Card
                    key={plan.id}
                    variant={isSelected ? "elevated" : "bordered"}
                    hoverable
                    className={`cursor-pointer relative ${
                      isSelected ? "border-2 border-primary" : ""
                    }`}
                    onClick={() => {
                      setSelectedPlan(plan.id);
                      setFieldValue("plan", plan.id);
                    }}
                  >
                    {plan.popular ? (
                      <Badge variant="gold" className="absolute -top-2 -right-2">
                        {t("popular")}
                      </Badge>
                    ) : null}
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-serif text-lg font-semibold text-black">
                          {plan.name}
                        </p>
                        <p className="mt-1 font-sans text-2xl font-bold text-primary">
                          {plan.price}
                          <span className="text-sm font-normal text-slate-light">
                            {" "}
                            / {plan.period}
                          </span>
                        </p>
                      </div>
                      {isSelected ? (
                        <IoCheckmarkCircle size={24} className="text-primary" />
                      ) : null}
                    </div>
                    <ul className="mt-4 space-y-2">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-2 font-body text-sm text-slate">
                          <IoCheckmarkCircle size={16} className="mt-0.5 shrink-0 text-gold" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </Card>
                );
              })}
            </div>

            <div>
              <label className="block font-sans text-sm font-medium text-slate">
                {t("paymentMethod")}
              </label>
              <div className="mt-2 flex gap-4">
                <label className="flex items-center gap-2 font-body text-sm text-slate">
                  <Field
                    type="radio"
                    name="paymentMethod"
                    value="card"
                    className="h-4 w-4 text-primary focus:ring-primary"
                  />
                  {t("card")}
                </label>
                <label className="flex items-center gap-2 font-body text-sm text-slate">
                  <Field
                    type="radio"
                    name="paymentMethod"
                    value="mobile_money"
                    className="h-4 w-4 text-primary focus:ring-primary"
                  />
                  {t("mobileMoney")}
                </label>
              </div>
              {errors.paymentMethod && touched.paymentMethod ? (
                <p className="mt-1 font-body text-xs text-error">{errors.paymentMethod}</p>
              ) : null}
            </div>

            <div className="flex justify-between">
              <Button type="button" variant="outline" onClick={onBack}>
                {t("back")}
              </Button>
              <Button type="submit" variant="primary" isLoading={isSubmittingState}>
                {t("submit")}
                <IoStar size={16} />
              </Button>
            </div>
          </Form>
        );
      }}
    </Formik>
  );
}
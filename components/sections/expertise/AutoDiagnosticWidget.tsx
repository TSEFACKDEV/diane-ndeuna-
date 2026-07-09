"use client";

import { type ReactNode, useState } from "react";
import { useTranslations } from "next-intl";
import { Formik, Form, Field, type FormikHelpers } from "formik";
import axios from "axios";
import { AnimatePresence, motion } from "motion/react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import {
  diagnosticSubmitSchema,
  diagnosticQuestionIds,
  type DiagnosticSubmitType,
} from "@/lib/validation/diagnostic";
import { computeDiagnosticResult } from "@/lib/diagnostic-scoring";
import { IoArrowForward, IoArrowBack, IoSparkles } from "react-icons/io5";

const initialValues: DiagnosticSubmitType = {
  email: "",
  organization: "",
  answers: {
    governance: 0,
    financials: 0,
    compliance: 0,
    network: 0,
    reporting: 0,
  },
};

type Step = "intro" | "questions" | "contact" | "result";

export function AutoDiagnosticWidget(): ReactNode {
  const t = useTranslations("expertise.items.conseil.diagnostic");
  const [step, setStep] = useState<Step>("intro");
  const [currentQuestion, setCurrentQuestion] = useState<number>(0);
  const [result, setResult] = useState<ReturnType<typeof computeDiagnosticResult> | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const totalQuestions = diagnosticQuestionIds.length;

  async function handleSubmit(
    values: DiagnosticSubmitType,
    helpers: FormikHelpers<DiagnosticSubmitType>
  ): Promise<void> {
    setSubmitError(null);
    try {
      const { data } = await axios.post("/api/diagnostic", values);
      setResult({
        score: data.score,
        maxScore: data.maxScore,
        percentage: data.percentage,
        resultLevel: data.resultLevel,
      });
      setStep("result");
    } catch (error) {
      const message = axios.isAxiosError(error)
        ? (error.response?.data?.error as string) ?? t("error")
        : t("error");
      setSubmitError(message);
    } finally {
      helpers.setSubmitting(false);
    }
  }

  return (
    <Card variant="elevated" className="mx-auto max-w-2xl">
      <AnimatePresence mode="wait">
        {step === "intro" ? (
          <motion.div
            key="intro"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="text-center"
          >
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-lg bg-gold/15">
              <IoSparkles size={26} className="text-gold" />
            </div>
            <h3 className="mt-5 font-serif text-2xl font-semibold text-black">
              {t("introTitle")}
            </h3>
            <p className="mt-3 font-body text-sm leading-relaxed text-slate-light">
              {t("introDescription")}
            </p>
            <Button
              className="mt-7"
              onClick={() => setStep("questions")}
            >
              {t("startButton")}
              <IoArrowForward size={16} />
            </Button>
          </motion.div>
        ) : null}

        {step !== "intro" ? (
          <Formik
            initialValues={initialValues}
            validationSchema={diagnosticSubmitSchema}
            onSubmit={handleSubmit}
          >
            {({ values, setFieldValue, errors, touched, isSubmitting }) => {
              const currentQuestionId = diagnosticQuestionIds[currentQuestion];

              return (
                <Form>
                  {step === "questions" && currentQuestionId ? (
                    <motion.div
                      key={`question-${currentQuestion}`}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <p className="font-sans text-xs font-semibold uppercase tracking-wider text-gold">
                        {t("questionProgress", {
                          current: currentQuestion + 1,
                          total: totalQuestions,
                        })}
                      </p>
                      <h3 className="mt-3 font-serif text-xl font-semibold text-black md:text-2xl">
                        {t(`questions.${currentQuestionId}.label`)}
                      </h3>

                      <div className="mt-6 space-y-3">
                        {[0, 1, 2, 3].map((scoreValue) => (
                          <button
                            key={scoreValue}
                            type="button"
                            onClick={() =>
                              setFieldValue(`answers.${currentQuestionId}`, scoreValue)
                            }
                            className={`w-full rounded-lg border p-4 text-left font-body text-sm transition-colors duration-200 ${
                              values.answers[currentQuestionId] === scoreValue
                                ? "border-primary bg-primary/5 text-primary"
                                : "border-border bg-white text-slate hover:border-primary/40"
                            }`}
                          >
                            {t(`questions.${currentQuestionId}.options.${scoreValue}`)}
                          </button>
                        ))}
                      </div>

                      <div className="mt-7 flex items-center justify-between">
                        <button
                          type="button"
                          onClick={() => {
                            if (currentQuestion === 0) {
                              setStep("intro");
                            } else {
                              setCurrentQuestion((prev) => prev - 1);
                            }
                          }}
                          className="inline-flex items-center gap-2 font-sans text-sm font-medium text-slate-light hover:text-primary"
                        >
                          <IoArrowBack size={14} />
                          {t("previous")}
                        </button>

                        <Button
                          type="button"
                          onClick={() => {
                            if (currentQuestion < totalQuestions - 1) {
                              setCurrentQuestion((prev) => prev + 1);
                            } else {
                              setStep("contact");
                            }
                          }}
                        >
                          {currentQuestion < totalQuestions - 1 ? t("next") : t("continueToContact")}
                          <IoArrowForward size={16} />
                        </Button>
                      </div>
                    </motion.div>
                  ) : null}

                  {step === "contact" ? (
                    <motion.div
                      key="contact"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <h3 className="font-serif text-xl font-semibold text-black md:text-2xl">
                        {t("contactTitle")}
                      </h3>
                      <p className="mt-2 font-body text-sm text-slate-light">
                        {t("contactDescription")}
                      </p>

                      <div className="mt-6 space-y-4">
                        <div>
                          <Field
                            name="organization"
                            placeholder={t("organizationPlaceholder")}
                            className="w-full rounded-lg border border-border bg-white px-4 py-3 font-body text-sm text-slate focus:border-primary focus:outline-none"
                          />
                          {errors.organization && touched.organization ? (
                            <p className="mt-1 font-body text-xs text-error">{errors.organization}</p>
                          ) : null}
                        </div>
                        <div>
                          <Field
                            name="email"
                            type="email"
                            placeholder={t("emailPlaceholder")}
                            className="w-full rounded-lg border border-border bg-white px-4 py-3 font-body text-sm text-slate focus:border-primary focus:outline-none"
                          />
                          {errors.email && touched.email ? (
                            <p className="mt-1 font-body text-xs text-error">{errors.email}</p>
                          ) : null}
                        </div>
                      </div>

                      {submitError ? (
                        <p className="mt-3 font-body text-xs text-error">{submitError}</p>
                      ) : null}

                      <div className="mt-7 flex items-center justify-between">
                        <button
                          type="button"
                          onClick={() => setStep("questions")}
                          className="inline-flex items-center gap-2 font-sans text-sm font-medium text-slate-light hover:text-primary"
                        >
                          <IoArrowBack size={14} />
                          {t("previous")}
                        </button>
                        <Button type="submit" isLoading={isSubmitting}>
                          {t("seeResult")}
                        </Button>
                      </div>
                    </motion.div>
                  ) : null}
                </Form>
              );
            }}
          </Formik>
        ) : null}

        {step === "result" && result ? (
          <motion.div
            key="result"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="text-center"
          >
            <p className="font-sans text-xs font-semibold uppercase tracking-wider text-gold">
              {t("resultEyebrow")}
            </p>
            <p className="mt-3 font-serif text-5xl font-semibold text-primary">
              {result.percentage}%
            </p>
            <h3 className="mt-4 font-serif text-2xl font-semibold text-black">
              {t(`resultLevels.${result.resultLevel}.title`)}
            </h3>
            <p className="mt-3 font-body text-sm leading-relaxed text-slate-light">
              {t(`resultLevels.${result.resultLevel}.description`)}
            </p>
            <Button
              className="mt-7"
              onClick={() => {
                setStep("intro");
                setCurrentQuestion(0);
                setResult(null);
              }}
              variant="outline"
            >
              {t("retake")}
            </Button>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </Card>
  );
}
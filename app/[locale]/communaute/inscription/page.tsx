// app/[locale]/communaute/inscription/page.tsx
"use client";

import { type ReactNode, useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { useAuth } from "@/hooks/useAuth";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { Card } from "@/components/ui/Card";
import { RegisterStep1 } from "@/components/sections/community/RegisterStep1";
import { RegisterStep2 } from "@/components/sections/community/RegisterStep2";
import { RegisterStep3 } from "@/components/sections/community/RegisterStep3";

import type {
  Step1Values,
  Step2Values,
  Step3Values,
} from "@/lib/validation/register";
import { initiatePayment } from "@/lib/validation/payment";

type Step = 1 | 2 | 3;

const defaultStep1Values: Step1Values = {
  fullName: "",
  email: "",
  password: "",
  confirmPassword: "",
};

const defaultStep2Values: Step2Values = {
  phone: "",
  organization: "",
  country: "",
};

const defaultStep3Values: Step3Values = {
  plan: "basic",
  paymentMethod: "card",
};

export default function RegisterPage(): ReactNode {
  const t = useTranslations("community.register");
  const router = useRouter();
  const { register } = useAuth();
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [step1Values, setStep1Values] = useState<Step1Values>(defaultStep1Values);
  const [step2Values, setStep2Values] = useState<Step2Values>(defaultStep2Values);
  const [step3Values] = useState<Step3Values>(defaultStep3Values);
  const [isProcessingPayment, setIsProcessingPayment] = useState<boolean>(false);

  const handleStep1Submit = (values: Step1Values): void => {
    setStep1Values(values);
    setCurrentStep(2);
  };

  const handleStep2Submit = (values: Step2Values): void => {
    setStep2Values(values);
    setCurrentStep(3);
  };

  const handleStep2Back = (): void => {
    setCurrentStep(1);
  };

  const handleStep3Back = (): void => {
    setCurrentStep(2);
  };

  const handleStep3Submit = async (values: Step3Values): Promise<void> => {
    setIsProcessingPayment(true);

    try {
      // 1. Créer l'utilisateur
      const user = await register({
        fullName: step1Values.fullName,
        email: step1Values.email,
        password: step1Values.password,
        phone: step2Values.phone,
        organization: step2Values.organization,
        country: step2Values.country,
      });

      // 2. Initier le paiement
      const amount = values.plan === "premium" ? 25000 : 10000;
      const payment = await initiatePayment({
        amount,
        currency: "XAF",
        email: user.email,
        fullName: user.fullName,
        phone: user.phone || undefined,
        description: `Adhésion ${values.plan === "premium" ? "Premium" : "Basic"} - Espace Membres Diane NDEUNA`,
        callbackUrl: `${window.location.origin}/api/payment/callback`,
      });

      // 3. Rediriger vers la page de paiement
      if (payment.redirectUrl) {
        window.location.href = payment.redirectUrl;
      } else {
        // Pas de redirection (paiement offline ou en attente)
        router.push("/communaute/ressources-membres");
      }
    } catch (error) {
      console.error("Erreur lors de l'inscription:", error);
      // On pourrait afficher un toast d'erreur ici
    } finally {
      setIsProcessingPayment(false);
    }
  };

  return (
    <div className="bg-cream pt-32 pb-20 md:pt-44 md:pb-28">
      <div className="container-site max-w-2xl">
        <SectionTitle
          subtitle={t("eyebrow")}
          title={t("title")}
          align="center"
        />
        <p className="mt-4 text-center font-body text-sm text-slate-light">
          {t("description")}
        </p>

        <div className="mt-8 flex items-center justify-center gap-4">
          {[1, 2, 3].map((step) => (
            <div key={step} className="flex items-center">
              <div
                className={`flex h-9 w-9 items-center justify-center rounded-full font-sans text-sm font-semibold ${
                  step === currentStep
                    ? "bg-primary text-white"
                    : step < currentStep
                    ? "bg-gold text-black"
                    : "bg-cream-dark text-slate-light"
                }`}
              >
                {step < currentStep ? "✓" : step}
              </div>
              {step < 3 ? (
                <div
                  className={`h-px w-12 ${
                    step < currentStep ? "bg-gold" : "bg-border"
                  }`}
                />
              ) : null}
            </div>
          ))}
        </div>

        <Card variant="elevated" className="mt-8">
          {currentStep === 1 ? (
            <RegisterStep1
              initialValues={step1Values}
              onSubmit={handleStep1Submit}
            />
          ) : null}
          {currentStep === 2 ? (
            <RegisterStep2
              initialValues={step2Values}
              onBack={handleStep2Back}
              onSubmit={handleStep2Submit}
            />
          ) : null}
          {currentStep === 3 ? (
            <RegisterStep3
              initialValues={step3Values}
              onBack={handleStep3Back}
              onSubmit={handleStep3Submit}
              isSubmitting={isProcessingPayment}
            />
          ) : null}
        </Card>

        <p className="mt-6 text-center font-body text-xs text-slate-light">
          {t("footer")}
        </p>
      </div>
    </div>
  );
}
// lib/validation/register.ts
import * as yup from "yup";

export const step1Schema = yup.object({
  fullName: yup.string().trim().min(2, "Le nom est requis").required("Le nom est requis"),
  email: yup.string().trim().email("Adresse e-mail invalide").required("L'e-mail est requis"),
  password: yup
    .string()
    .min(8, "Le mot de passe doit contenir au moins 8 caractères")
    .matches(/[A-Z]/, "Le mot de passe doit contenir au moins une majuscule")
    .matches(/[0-9]/, "Le mot de passe doit contenir au moins un chiffre")
    .required("Le mot de passe est requis"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Les mots de passe ne correspondent pas")
    .required("La confirmation du mot de passe est requise"),
});

export const step2Schema = yup.object({
  phone: yup.string().trim().optional(),
  organization: yup.string().trim().min(2, "L'organisation est requise").required("L'organisation est requise"),
  country: yup.string().trim().min(2, "Le pays est requis").required("Le pays est requis"),
});

export const step3Schema = yup.object({
  plan: yup.string().oneOf(["basic", "premium"]).required("Le plan est requis"),
  paymentMethod: yup.string().oneOf(["card", "mobile_money"]).required("Le moyen de paiement est requis"),
});

export type Step1Values = yup.InferType<typeof step1Schema>;
export type Step2Values = yup.InferType<typeof step2Schema>;
export type Step3Values = yup.InferType<typeof step3Schema>;

export type RegistrationFormValues = Step1Values & Step2Values & Step3Values;
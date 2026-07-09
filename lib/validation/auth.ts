import * as yup from "yup";

export const registerSchema = yup.object({
  fullName: yup.string().trim().min(2, "Le nom doit contenir au moins 2 caractères").required("Le nom est requis"),
  email: yup.string().trim().email("Adresse e-mail invalide").required("L'e-mail est requis"),
  password: yup
    .string()
    .min(8, "Le mot de passe doit contenir au moins 8 caractères")
    .matches(/[A-Z]/, "Le mot de passe doit contenir au moins une majuscule")
    .matches(/[0-9]/, "Le mot de passe doit contenir au moins un chiffre")
    .required("Le mot de passe est requis"),
  phone: yup.string().trim().optional(),
  organization: yup.string().trim().optional(),
  country: yup.string().trim().optional(),
});

export const loginSchema = yup.object({
  email: yup.string().trim().email("Adresse e-mail invalide").required("L'e-mail est requis"),
  password: yup.string().required("Le mot de passe est requis"),
});

export type RegisterSchemaType = yup.InferType<typeof registerSchema>;
export type LoginSchemaType = yup.InferType<typeof loginSchema>;
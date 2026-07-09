import * as yup from "yup";

export const newsletterSchema = yup.object({
  email: yup.string().trim().email("Adresse e-mail invalide").required("L'e-mail est requis"),
  fullName: yup.string().trim().optional(),
});

export type NewsletterSchemaType = yup.InferType<typeof newsletterSchema>;
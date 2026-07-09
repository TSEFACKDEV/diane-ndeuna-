import * as yup from "yup";

export const diagnosticAnswerSchema = yup.object({
  governance: yup.number().min(0).max(3).required(),
  financials: yup.number().min(0).max(3).required(),
  compliance: yup.number().min(0).max(3).required(),
  network: yup.number().min(0).max(3).required(),
  reporting: yup.number().min(0).max(3).required(),
});

export const diagnosticSubmitSchema = yup.object({
  email: yup.string().trim().email("Adresse e-mail invalide").required("L'e-mail est requis"),
  organization: yup.string().trim().min(2, "Le nom de l'organisation est requis").required("L'organisation est requise"),
  answers: diagnosticAnswerSchema.required(),
});

export type DiagnosticSubmitType = yup.InferType<typeof diagnosticSubmitSchema>;

export const diagnosticQuestionIds = [
  "governance",
  "financials",
  "compliance",
  "network",
  "reporting",
] as const;

export type DiagnosticQuestionId = (typeof diagnosticQuestionIds)[number];
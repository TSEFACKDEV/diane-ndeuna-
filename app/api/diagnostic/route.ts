import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import * as yup from "yup";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { diagnosticSubmitSchema } from "@/lib/validation/diagnostic";
import { computeDiagnosticResult, type DiagnosticAnswers } from "@/lib/diagnostic-scoring";
import type { ApiErrorResponse } from "@/types/auth";

interface DiagnosticResponse {
  score: number;
  maxScore: number;
  percentage: number;
  resultLevel: string;
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();
    const data = await diagnosticSubmitSchema.validate(body, { abortEarly: false });

    const result = computeDiagnosticResult(data.answers as DiagnosticAnswers);
    const currentUser = await getCurrentUser();

    await prisma.autoDiagnostic.create({
      data: {
        userId: currentUser?.id,
        email: data.email.toLowerCase(),
        organization: data.organization,
        answers: data.answers,
        score: result.score,
        resultLevel: result.resultLevel,
      },
    });

    const response: DiagnosticResponse = {
      score: result.score,
      maxScore: result.maxScore,
      percentage: result.percentage,
      resultLevel: result.resultLevel,
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      const fieldErrors: Record<string, string> = {};
      error.inner.forEach((err) => {
        if (err.path) {
          fieldErrors[err.path] = err.message;
        }
      });
      const response: ApiErrorResponse = {
        error: "Données invalides",
        fieldErrors,
      };
      return NextResponse.json(response, { status: 400 });
    }

    console.error("Erreur lors de l'enregistrement du diagnostic :", error);
    const response: ApiErrorResponse = { error: "Erreur serveur, veuillez réessayer" };
    return NextResponse.json(response, { status: 500 });
  }
}
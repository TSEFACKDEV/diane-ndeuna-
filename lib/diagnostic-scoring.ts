import { diagnosticQuestionIds, type DiagnosticQuestionId } from "@/lib/validation/diagnostic";

export type DiagnosticAnswers = Record<DiagnosticQuestionId, number>;

export type ResultLevel = "NOT_READY" | "IN_PROGRESS" | "READY" | "EXCELLENT";

export interface DiagnosticResult {
  score: number;
  maxScore: number;
  percentage: number;
  resultLevel: ResultLevel;
}

const MAX_SCORE_PER_QUESTION = 3;

export function computeDiagnosticResult(answers: DiagnosticAnswers): DiagnosticResult {
  const score = diagnosticQuestionIds.reduce(
    (total, id) => total + (answers[id] ?? 0),
    0
  );
  const maxScore = diagnosticQuestionIds.length * MAX_SCORE_PER_QUESTION;
  const percentage = Math.round((score / maxScore) * 100);

  let resultLevel: ResultLevel;
  if (percentage < 35) {
    resultLevel = "NOT_READY";
  } else if (percentage < 60) {
    resultLevel = "IN_PROGRESS";
  } else if (percentage < 85) {
    resultLevel = "READY";
  } else {
    resultLevel = "EXCELLENT";
  }

  return { score, maxScore, percentage, resultLevel };
}
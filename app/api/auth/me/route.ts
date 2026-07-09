import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/session";
import type { ApiErrorResponse } from "@/types/auth";

export async function GET(): Promise<NextResponse> {
  const user = await getCurrentUser();

  if (!user) {
    const response: ApiErrorResponse = { error: "Non authentifié" };
    return NextResponse.json(response, { status: 401 });
  }

  return NextResponse.json({ user }, { status: 200 });
}
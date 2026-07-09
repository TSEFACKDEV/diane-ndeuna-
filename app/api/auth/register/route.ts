import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import * as yup from "yup";
import { prisma } from "@/lib/prisma";
import { hashPassword, generateToken, AUTH_COOKIE_NAME } from "@/lib/auth";
import { registerSchema } from "@/lib/validation/auth";

import type { AuthResponse, ApiErrorResponse } from "@/types/auth";
import { MembershipStatus, Role } from "@/lib/generated/prisma/browser";

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();
    const data = await registerSchema.validate(body, { abortEarly: false });

    const existingUser = await prisma.user.findUnique({
      where: { email: data.email.toLowerCase() },
    });

    if (existingUser) {
      const response: ApiErrorResponse = {
        error: "Un compte existe déjà avec cette adresse e-mail",
      };
      return NextResponse.json(response, { status: 409 });
    }

    const hashedPassword = await hashPassword(data.password);

    const user = await prisma.user.create({
      data: {
        fullName: data.fullName,
        email: data.email.toLowerCase(),
        password: hashedPassword,
        phone: data.phone,
        organization: data.organization,
        country: data.country,
        role: Role.MEMBER,
        membershipStatus: MembershipStatus.PENDING,
      },
    });

    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    const response: AuthResponse = {
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        membershipStatus: user.membershipStatus,
        avatarUrl: user.avatarUrl,
        phone: user.phone,
        organization: user.organization,
        country: user.country,
      },
      token,
    };

    const nextResponse = NextResponse.json(response, { status: 201 });

    nextResponse.cookies.set(AUTH_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return nextResponse;
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

    console.error("Erreur lors de l'inscription :", error);
    const response: ApiErrorResponse = { error: "Erreur serveur, veuillez réessayer" };
    return NextResponse.json(response, { status: 500 });
  }
}
"use client";

import { type ReactNode } from "react";
import { useUser } from "@/hooks/useUser";
import { useRouter } from "@/i18n/navigation";
import { Role } from "@/lib/generated/prisma/browser";


interface AuthGuardProps {
  children: ReactNode;
  requiredRole?: Role;
  fallback?: ReactNode;
}

export function AuthGuard({
  children,
  requiredRole,
  fallback = null,
}: AuthGuardProps): ReactNode {
  const { user, isLoading } = useUser();
  const router = useRouter();

  if (isLoading) {
    return fallback;
  }

  if (!user) {
    router.push("/communaute/connexion");
    return fallback;
  }

  if (requiredRole && user.role !== requiredRole) {
    router.push("/");
    return fallback;
  }

  return children;
}
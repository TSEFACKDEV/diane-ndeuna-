import { MembershipStatus, Role } from "@/lib/generated/prisma/enums";


export interface JwtPayload {
  userId: string;
  email: string;
  role: Role;
}

export interface AuthenticatedUser {
  id: string;
  email: string;
  fullName: string;
  role: Role;
  membershipStatus: MembershipStatus;
  avatarUrl: string | null;
  phone: string | null;
  organization : string | null;
  country: string| null;
}

export interface RegisterInput {
  fullName: string;
  email: string;
  password: string;
  phone?: string;
  organization?: string;
  country?: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: AuthenticatedUser;
  token: string;
}

export interface ApiErrorResponse {
  error: string;
  fieldErrors?: Record<string, string>;
}
import axios from "axios";
import type {
  AuthResponse,
  LoginInput,
  RegisterInput,
  AuthenticatedUser,
} from "@/types/auth";

const apiClient = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export async function registerRequest(input: RegisterInput): Promise<AuthResponse> {
  const { data } = await apiClient.post<AuthResponse>("/auth/register", input);
  return data;
}

export async function loginRequest(input: LoginInput): Promise<AuthResponse> {
  const { data } = await apiClient.post<AuthResponse>("/auth/login", input);
  return data;
}

export async function logoutRequest(): Promise<void> {
  await apiClient.post("/auth/logout");
}

export async function fetchCurrentUserRequest(): Promise<AuthenticatedUser | null> {
  try {
    const { data } = await apiClient.get<{ user: AuthenticatedUser }>("/auth/me");
    return data.user;
  } catch {
    return null;
  }
}

export { apiClient };
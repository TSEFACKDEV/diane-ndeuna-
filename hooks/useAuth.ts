"use client";

import { useState, useCallback } from "react";
import axios from "axios";
import {
  loginRequest,
  registerRequest,
  logoutRequest,
} from "@/lib/api/auth";
import type {
  LoginInput,
  RegisterInput,
  AuthenticatedUser,
} from "@/types/auth";

interface UseAuthResult {
  login: (input: LoginInput) => Promise<AuthenticatedUser>;
  register: (input: RegisterInput) => Promise<AuthenticatedUser>;
  logout: () => Promise<void>;
  isSubmitting: boolean;
  error: string | null;
}

export function useAuth(): UseAuthResult {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const login = useCallback(async (input: LoginInput): Promise<AuthenticatedUser> => {
    setIsSubmitting(true);
    setError(null);
    try {
      const response = await loginRequest(input);
      return response.user;
    } catch (err) {
      const message = axios.isAxiosError(err)
        ? (err.response?.data?.error as string) ?? "Erreur de connexion"
        : "Erreur de connexion";
      setError(message);
      throw new Error(message);
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  const register = useCallback(async (input: RegisterInput): Promise<AuthenticatedUser> => {
    setIsSubmitting(true);
    setError(null);
    try {
      const response = await registerRequest(input);
      return response.user;
    } catch (err) {
      const message = axios.isAxiosError(err)
        ? (err.response?.data?.error as string) ?? "Erreur d'inscription"
        : "Erreur d'inscription";
      setError(message);
      throw new Error(message);
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  const logout = useCallback(async (): Promise<void> => {
    setIsSubmitting(true);
    try {
      await logoutRequest();
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  return { login, register, logout, isSubmitting, error };
}
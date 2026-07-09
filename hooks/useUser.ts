"use client";

import { useEffect, useState, useCallback } from "react";
import { fetchCurrentUserRequest } from "@/lib/api/auth";
import type { AuthenticatedUser } from "@/types/auth";

interface UseUserResult {
  user: AuthenticatedUser | null;
  isLoading: boolean;
  refetch: () => Promise<void>;
}

export function useUser(): UseUserResult {
  const [user, setUser] = useState<AuthenticatedUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const refetch = useCallback(async () => {
    setIsLoading(true);
    const fetchedUser = await fetchCurrentUserRequest();
    setUser(fetchedUser);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void refetch();
  }, [refetch]);

  return { user, isLoading, refetch };
}
"use client";

import { useEffect, useState } from "react";
import { getToken } from "@/lib/auth";

export default function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = getToken();
    setTimeout(() => {
      setIsAuthenticated(Boolean(token));
      setIsLoading(false);
    }, 0);
  }, []);

  return { isAuthenticated, isLoading };
}

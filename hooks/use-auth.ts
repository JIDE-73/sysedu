"use client";

import { useState, useEffect } from "react";

interface AuthState {
  isAuthenticated: boolean;
  user?: {
    email: string;
    loginTime: number;
  };
}

const AUTH_KEY = "sysedu_auth";
const SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 horas en ms

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
  });

  // Verificar autenticación al cargar
  useEffect(() => {
    const stored = localStorage.getItem(AUTH_KEY);
    if (stored) {
      try {
        const parsed: AuthState = JSON.parse(stored);
        const now = Date.now();

        // Verificar si la sesión no ha expirado
        if (parsed.user && now - parsed.user.loginTime < SESSION_DURATION) {
          setAuthState(parsed);
        } else {
          // Sesión expirada, limpiar
          localStorage.removeItem(AUTH_KEY);
        }
      } catch (error) {
        // Datos corruptos, limpiar
        localStorage.removeItem(AUTH_KEY);
      }
    }
  }, []);

  const login = (email: string) => {
    const newState: AuthState = {
      isAuthenticated: true,
      user: {
        email,
        loginTime: Date.now(),
      },
    };

    setAuthState(newState);
    localStorage.setItem(AUTH_KEY, JSON.stringify(newState));
  };

  const logout = () => {
    setAuthState({ isAuthenticated: false });
    localStorage.removeItem(AUTH_KEY);
  };

  return {
    isAuthenticated: authState.isAuthenticated,
    user: authState.user,
    login,
    logout,
  };
}

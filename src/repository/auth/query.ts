"use client";

import { useMutation } from "@tanstack/react-query";
import { useAuthStore } from "@/store/authStore";
import { generateKodeAction, loginAction, logoutAction, registerAction } from "./action";
import type { GenerateKodeData, GenerateKodeRequest, LoginRequest, LoginUser, RegisterRequest, RegisterUser } from "./dto";
import { ActionResult } from "@/lib/return-response";

// ── useLogin ───────────────────────────────────────────────────────────────────
export function useLogin() {
  const { setUser, clearUser } = useAuthStore();

  return useMutation<ActionResult<LoginUser>, Error, LoginRequest>({
    mutationFn: (credentials) => loginAction(credentials),

    onSuccess: (result) => {
      if (result.success) {
        // Hydrate global Zustand store with safe user data
        setUser(result.data);
      } else {
        clearUser();
      }
    },

    onError: () => {
      clearUser();
    },
  });
}

// ── useLogout ──────────────────────────────────────────────────────────────────
export function useLogout() {
  const { clearUser } = useAuthStore();

  return useMutation<void, Error, void>({
    mutationFn: () => logoutAction(),

    onSuccess: () => {
      clearUser();
      // ⚠️ GANTI: arahkan ke route login yang sesuai dengan project kamu
      window.location.href = "/login";
    },
  });
}

export function useRegister() {
  return useMutation<ActionResult<RegisterUser>, Error, RegisterRequest>({
    mutationFn: (payload) => registerAction(payload),
  });
}

export function useGenerateKode() {
  return useMutation<ActionResult<GenerateKodeData>, Error, GenerateKodeRequest>({
    mutationFn: (payload) => generateKodeAction(payload),
  });
}
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { LoginUser } from "@/repository/auth/dto";

interface AuthState {
  user: LoginUser | null;
  isAuthenticated: boolean;

  // Actions
  setUser: (user: LoginUser) => void;
  clearUser: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,

      setUser: (user) =>
        set({
          user,
          isAuthenticated: true,
        }),

      clearUser: () =>
        set({
          user: null,
          isAuthenticated: false,
        }),
    }),
    {
      name: "rk_auth",                    
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
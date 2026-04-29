import axios from "axios";

// ── Base URL ───────────────────────────────────────────────────────────────────
// NEXT_BASE_API_URL     → server-side only (not exposed to browser)
// NEXT_PUBLIC_BASE_API_URL → client-side safe
const BACKEND_URL =
  process.env.NEXT_BASE_API_URL ||
  process.env.NEXT_PUBLIC_BASE_API_URL ||
  "";

// ── Public instance ────────────────────────────────────────────────────────────
// For unauthenticated requests (login, register, public endpoints)
export const axiosPublic = axios.create({
  baseURL: BACKEND_URL,
  headers: { "Content-Type": "application/json" },
});

// ── Private instance ───────────────────────────────────────────────────────────
// For authenticated requests — attaches Bearer token from session cookie
// Should only be used SERVER-SIDE (Server Actions / Route Handlers)
export const axiosPrivate = axios.create({
  baseURL: BACKEND_URL,
  headers: { "Content-Type": "application/json" },
});

// Request interceptor — inject token from encrypted session cookie
axiosPrivate.interceptors.request.use(async (config) => {
  // Dynamic import to avoid bundling server-only code on the client
  const { getSession } = await import("@/repository/auth/action");
  const session = await getSession();

  if (session?.token) {
    config.headers.Authorization = `Bearer ${session.token}`;
  }

  return config;
});

// Response interceptor — handle 401 / expired sessions
axiosPrivate.interceptors.response.use(
  (response) => response,

  async (error) => {
    const status = error?.response?.status as number | undefined;

    // Only redirect on client-side (server actions handle their own errors)
    if (typeof window !== "undefined" && status === 401) {
      const { logoutAction } = await import("@/repository/auth/action");
      await logoutAction();
      // ⚠️ GANTI: arahkan ke route login yang sesuai dengan project kamu
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);
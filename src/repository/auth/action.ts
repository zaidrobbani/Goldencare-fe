"use server";

import {
  LoginRequest,
  LoginResponse,
  SessionPayload,
  LoginUser,
  RegisterRequest,
  RegisterUser,
  RegisterResponse,
  GenerateKodeRequest,
  GenerateKodeData,
  GenerateKodeResponse,
} from "./dto";
import type { ActionResult } from "@/lib/return-response";

import { tryCatch } from "@/lib/try-catch";
import { cookies } from "next/headers";
import { axiosPrivate, axiosPublic } from "@/lib/axios";
import { encryptToken } from "@/lib/encrypt";
import { Roles } from "@/repository/auth/dto";

// ── Constants ──────────────────────────────────────────────────────────────────
const SESSION_COOKIE_NAME = "rk_session";
const SESSION_MAX_AGE = 60 * 60 * 8; // 8 hours in seconds

// ── Login Action ───────────────────────────────────────────────────────────────
export async function loginAction(credentials: LoginRequest): Promise<ActionResult<LoginUser>> {
  // 1. Call backend
  const { data: res, error } = await tryCatch<LoginResponse>(
    axiosPublic.post("/api/auth/login", credentials).then((r) => r.data)
  );

  if (error || !res?.success) {
    const message =
      (error as { response?: { data?: { message?: string } } })?.response?.data?.message ??
      error?.message ??
      "Login gagal. Periksa email dan password kamu.";
    return { success: false, error: message };
  }

  // 2. Decode role + panti_id from JWT payload (without verifying signature — server trusts backend)
  const rawToken = res.data.token;
  const jwtPayload = decodeJwtPayload(rawToken);

  // 3. Build session object
  const session: SessionPayload = {
    userId: res.data.user.id,
    name: res.data.user.name,
    email: res.data.user.email,
    role: jwtPayload?.role ?? "superadmin",
    panti_id: jwtPayload?.panti_id ?? "",
    token: rawToken,
    issuedAt: Date.now(),
  };

  // 4. Encrypt session and store in httpOnly cookie
  const encryptedSession = await encryptToken(JSON.stringify(session));

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, encryptedSession, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: SESSION_MAX_AGE,
    path: "/",
  });

  // 5. Return safe user data (no token) to client
  return {
    success: true,
    data: {
      id: session.userId,
      name: session.name,
      email: session.email,
      role: session.role,
      panti_id: session.panti_id,
    },
  };
}

// ── Logout Action ──────────────────────────────────────────────────────────────
export async function logoutAction(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

// ── Get Session (server-side utility) ─────────────────────────────────────────
// Use this in Server Components / Route Handlers / Middleware
export async function getSession(): Promise<SessionPayload | null> {
  const { decryptToken } = await import("@/lib/encrypt");

  const cookieStore = await cookies();
  const encrypted = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!encrypted) return null;

  const { data, error } = await tryCatch<string>(decryptToken(encrypted));

  if (error || !data) return null;

  try {
    return JSON.parse(data) as SessionPayload;
  } catch {
    return null;
  }
}
type JwtPayload = {
  role?: Roles;
  panti_id?: string;
};

// ── Helper: decode JWT payload without verification ───────────────────────────
function decodeJwtPayload(token: string): JwtPayload | null {
  try {
    const base64Payload = token.split(".")[1];
    const decoded = Buffer.from(base64Payload, "base64url").toString("utf-8");
    return JSON.parse(decoded);
  } catch {
    return null;
  }
}

export async function registerAction(
  payload: RegisterRequest
): Promise<ActionResult<RegisterUser>> {
  const { data: res, error } = await tryCatch<RegisterResponse>(
    axiosPublic.post("/api/auth/register", payload).then((r) => r.data)
  );

  if (error || !res?.success) {
    const message =
      (error as { response?: { data?: { message?: string } } })?.response?.data?.message ??
      error?.message ??
      "Registrasi gagal. Periksa data kamu.";
    return { success: false, error: message };
  }

  return { success: true, data: res.data };
}

export async function generateKodeAction(
  payload: GenerateKodeRequest
): Promise<ActionResult<GenerateKodeData>> {
  const { data: res, error } = await tryCatch<GenerateKodeResponse>(
    axiosPrivate.post("/api/pengelola/kode/generate", payload).then((r) => r.data)
  );

  if (error || !res?.success) {
    const message =
      (error as { response?: { data?: { message?: string } } })?.response?.data?.message ??
      error?.message ??
      "Gagal membuat kode undangan.";
    return { success: false, error: message };
  }

  return { success: true, data: res.data };
}

export type Roles = "keluarga" | "pengelola" | "superadmin" | "pengurus";

// ── Request ────────────────────────────────────────────────────────────────────
export interface LoginRequest {
  email: string;
  password: string;
}

// ── Response ───────────────────────────────────────────────────────────────────
export interface LoginUser {
  id: string;
  name: string;
  email: string;
  role: Roles; // from JWT payload — e.g. "superadmin" | "perawat" | "keluarga"
  panti_id: string;
}

export interface LoginData {
  user: LoginUser;
  token: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: LoginData;
}

// ── Session (stored in cookie, decrypted at runtime) ───────────────────────────
export interface SessionPayload {
  userId: string;
  name: string;
  email: string;
  role: Roles;
  panti_id: string;
  token: string; // raw JWT — encrypted before stored in cookie
  issuedAt: number;
}

// ── Register ───────────────────────────────────────────────────────────────────
export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  role: Roles;
  kode_undangan: string;
}

export interface RegisterUser {
  id: string;
  name: string;
  email: string;
  role: Roles;
  panti_id: string | null;
  is_verified: boolean;
}

export interface RegisterResponse {
  success: boolean;
  message: string;
  data: RegisterUser;
}

export type KodeTipe = "single_use" | "multiple_use";

export interface GenerateKodeRequest {
  untuk_role: Extract<Roles, "pengurus" | "keluarga">;
  tipe: KodeTipe;
  catatan?: string;
}

export interface GenerateKodeData {
  id: string;
  kode: string;
  tipe: KodeTipe;
}

export interface GenerateKodeResponse {
  success: boolean;
  message: string;
  data: GenerateKodeData;
}

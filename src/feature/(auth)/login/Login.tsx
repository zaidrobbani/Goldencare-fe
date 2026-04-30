"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useLogin } from "@/repository/auth/query";
import { useAuthStore } from "@/store/authStore";
import { useToast } from "@/shared/Toast/ToastProvider";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import Link from "next/link";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const { mutate: login, isPending } = useLogin();
  const { user } = useAuthStore();
  const { error: showError } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  React.useEffect(() => {
    if (!user) {
      return;
    }
    const role = user?.role;
    if (role === "superadmin") {
      router.push("/dashboard");
    }

    if (role === "keluarga") {
      router.push("/memori-tamu");
    }

    if (role === "pengelola") {
      router.push("/dashboard");
    }

    if (role === "pengurus") {
      router.push("/jurnal-jaga");
    }
  }, [user, router]);

  const handleSubmit = () => {
    if (!email.trim() || !password.trim()) {
      showError("Email dan password wajib diisi.");
      return;
    }

    login(
      { email, password },
      {
        onSuccess: (result) => {
          if (!result.success) {
            showError(result.error || "Login gagal. Periksa email dan password kamu.");
            return;
          }

          const role = result.data?.role;
          if (role === "superadmin") router.push("/dashboard");
          if (role === "keluarga") router.push("/memori-tamu");
          if (role === "pengelola") router.push("/dashboard");
          if (role === "pengurus") router.push("/jurnal-jaga");
        },

        onError: (err) => {
          showError(err?.message || "Login gagal. Periksa email dan password kamu.");
        },
      }
    );
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col items-center justify-center px-4">
      {/* Card */}
      <div className="w-full max-w-sm bg-surface-container-lowest rounded-3xl border border-outline-variant shadow-sm p-8 flex flex-col gap-6">
        {/* Header */}
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold font-headline text-on-surface">Welcome Back</h1>
          <p className="text-sm text-on-surface-variant font-body">
            Access your care dashboard securely.
          </p>
        </div>

        {/* Form */}
        <div className="flex flex-col gap-4">
          {/* Email */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold font-body text-on-surface-variant tracking-wide uppercase">
              Email Address
            </label>
            <div className="relative flex items-center">
              <EmailOutlinedIcon
                style={{ fontSize: 16 }}
                className="absolute left-3 text-outline pointer-events-none"
              />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isPending}
                placeholder="care@rawatkasih.com"
                className="w-full bg-surface-container-low border border-outline-variant rounded-xl pl-9 pr-4 py-3 text-sm font-body text-on-surface placeholder:text-outline focus:outline-none focus:border-primary transition-colors"
              />
            </div>
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold font-body text-on-surface-variant tracking-wide uppercase">
                Password
              </label>
              <a href="#" className="text-xs font-semibold font-body text-primary hover:underline">
                Forgot Password?
              </a>
            </div>
            <div className="relative flex items-center">
              <LockOutlinedIcon
                style={{ fontSize: 16 }}
                className="absolute left-3 text-outline pointer-events-none"
              />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isPending}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSubmit();
                  }
                }}
                className="w-full bg-surface-container-low border border-outline-variant rounded-xl pl-9 pr-10 py-3 text-sm font-body text-on-surface placeholder:text-outline focus:outline-none focus:border-primary transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 text-outline hover:text-on-surface-variant transition-colors"
              >
                {showPassword ? (
                  <VisibilityOffOutlinedIcon style={{ fontSize: 16 }} />
                ) : (
                  <VisibilityOutlinedIcon style={{ fontSize: 16 }} />
                )}
              </button>
            </div>
          </div>



          {/* Submit */}
          <button
            type="button"
            className="w-full flex items-center justify-center gap-2 bg-primary-container text-on-primary-container font-semibold text-sm font-body py-3 rounded-full hover:opacity-90 active:opacity-80 transition-opacity mt-1 disabled:bg-primary-container/80 disabled:text-on-primary-container/80 disabled:cursor-not-allowed cursor-pointer"
            onClick={handleSubmit}
            disabled={isPending}
          >
            {isPending ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                Masuk...
              </span>
            ) : (
              <>
                Enter Dashboard
                <ArrowForwardIcon fontSize="small" />
              </>
            )}
          </button>
        </div>

        {/* Sign Up */}
        <p className="text-center text-sm font-body text-on-surface-variant">
          New to Goldencare?{" "}
          <Link href="/register" className="font-semibold text-primary hover:underline">
            Sign Up
          </Link>
        </p>
      </div>

      {/* Secure badge */}
      <div className="flex items-center gap-1.5 mt-6 text-on-surface-variant">
        <ShieldOutlinedIcon style={{ fontSize: 14 }} className="text-primary" />
        <span className="text-[10px] font-semibold font-label tracking-widest uppercase">
          Secure Patient Data Access
        </span>
      </div>
    </div>
  );
}

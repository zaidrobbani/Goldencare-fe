"use client";

import React, { useState } from "react";
import Link from "next/link";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import Image from "next/image";
import { useRegister } from "@/repository/auth/query";
import type { Roles } from "@/repository/auth/dto";
import { useRouter } from "next/navigation";
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import MedicalServicesOutlinedIcon from "@mui/icons-material/MedicalServicesOutlined";
import AccountTreeOutlinedIcon from "@mui/icons-material/AccountTreeOutlined";
import type { SvgIconComponent } from "@mui/icons-material";

const ROLE_OPTIONS: {
  value: Roles;
  label: string;
  description: string;
  icon: SvgIconComponent;
}[] = [
  {
    value: "pengelola",
    label: "Pengelola",
    description: "Manage facility operations and care protocols.",
    icon: AdminPanelSettingsOutlinedIcon,
  },
  {
    value: "pengurus",
    label: "Perawat",
    description: "Update health vitals and daily patient progress.",
    icon: MedicalServicesOutlinedIcon,
  },
  {
    value: "keluarga",
    label: "Keluarga",
    description: "Stay connected with your loved one's care journey.",
    icon: AccountTreeOutlinedIcon,
  },
];

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const { mutate: register, isPending } = useRegister();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState<Roles | null>(null);
  const [kodeUndangan, setKodeUndangan] = useState("");
  const [agreed, setAgreed] = useState(false);

  const [showConfirm, setShowConfirm] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = () => {
    setErrorMsg(null);

    if (!name || !email || !password || !confirmPassword || !role || !kodeUndangan) {
      setErrorMsg("Please fill in all fields.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match.");
      return;
    }

    if (!agreed) {
      setErrorMsg("You must agree to the Terms of Service and Privacy Policy.");
      return;
    }

    register(
      { name, email, password, role, kode_undangan: kodeUndangan },
      {
        onSuccess: (res) => {
          if (!res.success) {
            setErrorMsg(res.error || "Registration failed. Please try again.");
            return;
          }

          router.push("/login");
        },

        onError: (err) => {
          setErrorMsg(err.message || "An unexpected error occurred. Please try again.");
        },
      }
    );
  };

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center px-6">
      <div className="flex items-center gap-12 w-full max-w-4xl">
        {/* ── Left: Hero Image ── */}
        <div className="relative w-95 h-120 shrink-0 rounded-3xl overflow-hidden">
          {}
          <Image
            src="/AB6AXuB6qbJrH5N11Cj9EPj497csCzYNWsidZIqVjkrcWujmtiz2L1T40Na4JzaEUUlR2c-4abTZAI1gP2VkEbnL6E2Ywima0FMWKf8Lz8Hg6WtFSx_m-lxhtotHsfv3SrM6BQO5_tFf87v30TBSFKxw2VPx3ruhhP9hDvG5cq4OMbzC_Nqvu7FtXtZ0Aj5rMZakZLK8aXU3jMN3U-f7DboR-kPgU2RUQjt-o-Aq7Km2O7QDQOZAeHPk.png"
            alt="A Sanctuary of Care"
            className="w-full h-full object-cover"
            width={500}
            height={500}
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent" />
          {/* Text overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-6 flex flex-col gap-2">
            <h2 className="text-2xl font-bold font-headline text-white leading-tight">
              A Sanctuary of Care
            </h2>
            <p className="text-sm text-white/80 font-body leading-relaxed">
              Join a community dedicated to the dignity and well-being of our elders. Every touch
              point is designed with human empathy at its core.
            </p>
          </div>
        </div>

        {/* ── Right: Form ── */}
        <div className="flex-1 min-w-0 bg-surface-container-lowest rounded-3xl border border-outline-variant p-8 flex flex-col gap-6">
          {/* Brand */}
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-bold font-headline text-primary leading-tight">
              Goldencare
            </h1>
            <p className="text-sm text-on-surface-variant font-body">Create your account</p>
          </div>

          {/* Fields */}
          <div className="flex flex-col gap-4">
            {/* Full Name */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold font-body text-on-surface">Full Name</label>
              <input
                type="text"
                placeholder="Enter your name"
                className="w-full bg-surface-container-low border border-outline-variant rounded-xl px-4 py-3 text-sm font-body text-on-surface placeholder:text-outline focus:outline-none focus:border-primary transition-colors"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isPending}
              />
            </div>

            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold font-body text-on-surface">
                Email Address
              </label>
              <input
                type="email"
                placeholder="name@example.com"
                className="w-full bg-surface-container-low border border-outline-variant rounded-xl px-4 py-3 text-sm font-body text-on-surface placeholder:text-outline focus:outline-none focus:border-primary transition-colors"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isPending}
              />
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold font-body text-on-surface">Password</label>
              <div className="relative flex items-center">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="w-full bg-surface-container-low border border-outline-variant rounded-xl px-4 pr-10 py-3 text-sm font-body text-on-surface placeholder:text-outline focus:outline-none focus:border-primary transition-colors"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isPending}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 text-outline hover:text-on-surface-variant transition-colors cursor-pointer"
                >
                  {showPassword ? (
                    <VisibilityOffOutlinedIcon style={{ fontSize: 18 }} />
                  ) : (
                    <VisibilityOutlinedIcon style={{ fontSize: 18 }} />
                  )}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold font-body text-on-surface">
                Confirm Password
              </label>
              <div className="relative flex items-center">
                <input
                  type={showConfirm ? "text" : "password"}
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-surface-container-low border border-outline-variant rounded-xl px-4 pr-10 py-3 text-sm font-body text-on-surface placeholder:text-outline focus:outline-none focus:border-primary transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm((v) => !v)}
                  className="absolute right-3 text-outline hover:text-on-surface-variant transition-colors cursor-pointer"
                >
                  {showConfirm ? (
                    <VisibilityOffOutlinedIcon style={{ fontSize: 18 }} />
                  ) : (
                    <VisibilityOutlinedIcon style={{ fontSize: 18 }} />
                  )}
                </button>
              </div>
            </div>

            {/* Role Selector */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold font-body text-on-surface">
                Choose Your Role
              </label>
              <div className="flex flex-col gap-2">
                {ROLE_OPTIONS.map((opt) => {
                  const isSelected = role === opt.value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setRole(opt.value)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl border text-left transition-all cursor-pointer ${
                        isSelected
                          ? "border-primary bg-primary/10"
                          : "border-outline-variant bg-surface-container-low hover:border-primary/50 hover:bg-surface-container transition-all duration-300 ease-in-out"
                      }`}
                    >
                      {/* Icon container */}
                      <div
                        className={`w-10 h-10 shrink-0 rounded-xl flex items-center justify-center transition-colors ${
                          isSelected
                            ? "bg-primary/20"
                            : "bg-surface-container group-hover:bg-primary/10"
                        }`}
                      >
                        <opt.icon
                          style={{ fontSize: 20 }}
                          className={`transition-colors ${
                            isSelected ? "text-primary" : "text-on-surface-variant"
                          }`}
                        />
                      </div>

                      {/* Text */}
                      <div className="flex flex-col">
                        <span
                          className={`text-sm font-semibold font-body transition-colors ${
                            isSelected ? "text-primary" : "text-on-surface"
                          }`}
                        >
                          {opt.label}
                        </span>
                        <span className="text-xs font-body text-on-surface-variant">
                          {opt.description}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Kode Undangan */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold font-body text-on-surface">
                Kode Undangan
              </label>
              <input
                type="text"
                placeholder="Masukkan kode undangan"
                value={kodeUndangan}
                onChange={(e) => setKodeUndangan(e.target.value.toUpperCase())}
                className="w-full bg-surface-container-low border border-outline-variant rounded-xl px-4 py-3 text-sm font-body text-on-surface placeholder:text-outline focus:outline-none focus:border-primary transition-colors tracking-widest"
              />
            </div>

            {/* Terms Checkbox */}
            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="mt-0.5 w-4 h-4 shrink-0 accent-primary cursor-pointer"
              />
              <span className="text-xs font-body text-on-surface-variant leading-relaxed">
                I agree to the{" "}
                <a href="#" className="text-primary font-semibold hover:underline">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="#" className="text-primary font-semibold hover:underline">
                  Privacy Policy
                </a>{" "}
                regarding my health data.
              </span>
            </label>

            {errorMsg && <p className="text-xs text-error font-body text-center">{errorMsg}</p>}

            {/* Submit — kosmetik */}
            <button
              type="button"
              className="w-full bg-primary-container text-on-primary-container font-semibold text-sm font-body py-3.5 rounded-full hover:opacity-90 active:opacity-80 transition-opacity mt-1 disabled:bg-primary-container/70 disabled:text-on-primary-container/70 disabled:cursor-not-allowed cursor-pointer"
              onClick={handleSubmit}
              disabled={isPending}
            >
              {isPending ? "Memproses..." : "Create Account"}
            </button>
          </div>

          {/* Log In link */}
          <p className="text-center text-sm font-body text-on-surface-variant">
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-primary hover:underline">
              Log In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

"use client";

import React from "react";

// ── Base input class ───────────────────────────────────────────────────────────
const baseClass =
  "w-full bg-surface-container-low border border-outline-variant rounded-xl px-4 py-3 text-sm font-body text-on-surface placeholder:text-outline focus:outline-none focus:border-primary transition-colors disabled:opacity-50";

// ── TextField ──────────────────────────────────────────────────────────────────
interface TextFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  hint?: string;
  error?: string;
}

export function TextField({ label, hint, error, className = "", ...props }: TextFieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold font-body text-on-surface">{label}</label>
      <input className={`${baseClass} ${error ? "border-error focus:border-error" : ""} ${className}`} {...props} />
      {error && <p className="text-xs text-error font-body">{error}</p>}
      {!error && hint && <p className="text-xs text-on-surface-variant font-body">{hint}</p>}
    </div>
  );
}

// ── TextArea ───────────────────────────────────────────────────────────────────
interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  hint?: string;
  error?: string;
}

export function TextArea({ label, hint, error, className = "", ...props }: TextAreaProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold font-body text-on-surface">{label}</label>
      <textarea
        className={`${baseClass} resize-none ${error ? "border-error focus:border-error" : ""} ${className}`}
        {...props}
      />
      {error && <p className="text-xs text-error font-body">{error}</p>}
      {!error && hint && <p className="text-xs text-on-surface-variant font-body">{hint}</p>}
    </div>
  );
}
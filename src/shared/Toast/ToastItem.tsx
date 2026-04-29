"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";

type ToastType = "success" | "error" | "info" | "warning";

interface ToastItemProps {
  toast: { id: string; message: string; type: ToastType; isLeaving: boolean };
}

const ToastItem: React.FC<ToastItemProps> = ({ toast }) => {
  const toastRef = useRef<HTMLDivElement>(null);

  // Enter animation: slide in from right
  useEffect(() => {
    if (!toastRef.current) return;

    const tl = gsap.timeline();

    tl.fromTo(
      toastRef.current,
      { x: 80, opacity: 0, scale: 0.96 },
      { x: 0, opacity: 1, scale: 1, duration: 0.45, ease: "power3.out" }
    );

    if (toast.type === "error") {
      tl.to(toastRef.current, {
        keyframes: [{ x: -6 }, { x: 6 }, { x: -4 }, { x: 4 }, { x: 0 }],
        duration: 0.32,
        ease: "power1.inOut",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Leave animation: slide out to right
  useEffect(() => {
    if (!toast.isLeaving || !toastRef.current) return;

    gsap.to(toastRef.current, {
      x: 80,
      opacity: 0,
      scale: 0.96,
      duration: 0.38,
      ease: "power2.inOut",
    });
  }, [toast.isLeaving]);

  const getStyles = () => {
    switch (toast.type) {
      case "success":
        return {
          bg: "bg-[#EFF8FF]",
          border: "border-[#93C5FD]/40",
          text: "text-[#1D4ED8]",
          iconBg: "bg-[#2563EB]",
          glow: "shadow-[0_4px_24px_rgba(37,99,235,0.15)]",
        };
      case "error":
        return {
          bg: "bg-[#FFF1F2]",
          border: "border-[#FCA5A5]/40",
          text: "text-[#B91C1C]",
          iconBg: "bg-[#DC2626]",
          glow: "shadow-[0_4px_24px_rgba(220,38,38,0.15)]",
        };
      default:
        return {
          bg: "bg-slate-50",
          border: "border-slate-200",
          text: "text-slate-600",
          iconBg: "bg-slate-400",
          glow: "shadow-sm",
        };
    }
  };

  const styles = getStyles();

  const getIcon = () => {
    if (toast.type === "error") {
      return (
        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 6l12 12M18 6L6 18" />
        </svg>
      );
    }
    return (
      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3.5" d="M5 13l4 4L19 7" />
      </svg>
    );
  };

  return (
    <div
      ref={toastRef}
      className={`
        pointer-events-auto relative flex items-center gap-3
        py-3 px-4 pr-5 rounded-2xl border
        ${styles.bg} ${styles.border} ${styles.glow}
        backdrop-blur-sm
      `}
      style={{ minWidth: "300px", maxWidth: "380px" }}
    >
      {/* Colored left accent bar */}
      <div
        className={`absolute left-0 top-3 bottom-3 w-[3px] rounded-full ${styles.iconBg}`}
      />

      {/* Icon */}
      <div
        className={`shrink-0 ml-2 ${styles.iconBg} w-6 h-6 rounded-full flex items-center justify-center`}
      >
        {getIcon()}
      </div>

      {/* Message */}
      <p className={`grow text-sm font-medium leading-snug ${styles.text}`}>
        {toast.message}
      </p>
    </div>
  );
};

export default ToastItem;

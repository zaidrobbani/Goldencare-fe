"use client";

import { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";

// ── BaseModal ──────────────────────────────────────────────────────────────────
interface BaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  maxWidth?: string; // e.g. "max-w-lg", "max-w-xl"
  disabled?: boolean; // prevent close while loading
}

export function BaseModal({
  isOpen,
  onClose,
  children,
  maxWidth = "max-w-lg",
  disabled = false,
}: BaseModalProps) {
  const [mounted, setMounted] = useState(false);
  const backdropRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (isOpen) setMounted(true);
    if (!mounted) return;

    const backdrop = backdropRef.current;
    const panel = panelRef.current;
    if (!backdrop || !panel) return;

    if (isOpen) {
      gsap.fromTo(backdrop, { opacity: 0 }, { opacity: 1, duration: 0.25, ease: "power2.out" });
      gsap.fromTo(
        panel,
        { opacity: 0, y: 24, scale: 0.97 },
        { opacity: 1, y: 0, scale: 1, duration: 0.3, ease: "power3.out" }
      );
    } else {
      gsap.to(backdrop, { opacity: 0, duration: 0.2, ease: "power2.in" });
      gsap.to(panel, {
        opacity: 0,
        y: 16,
        scale: 0.97,
        duration: 0.2,
        ease: "power2.in",
        onComplete: () => setMounted(false),
      });
    }
  }, [isOpen, mounted]);

  // Prevent body scroll
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleClose = () => {
    if (disabled) return;
    onClose();
  };

  if (!mounted) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        ref={backdropRef}
        onClick={handleClose}
        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm opacity-0"
      />

      {/* Panel wrapper */}
      <div className="fixed inset-0 z-50 flex items-center justify-center px-4 pointer-events-none">
        <div
          ref={panelRef}
          className={`w-full ${maxWidth} bg-surface-container-lowest rounded-3xl border border-outline-variant shadow-xl flex flex-col max-h-[90vh] opacity-0 pointer-events-auto`}
        >
          {children}
        </div>
      </div>
    </>
  );
}

// ── ModalHeader ────────────────────────────────────────────────────────────────
interface ModalHeaderProps {
  title: string;
  subtitle?: string;
  onClose: () => void;
  disabled?: boolean;
}

export function ModalHeader({ title, subtitle, onClose, disabled }: ModalHeaderProps) {
  return (
    <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-outline-variant shrink-0">
      <div className="flex flex-col gap-0.5">
        <h2 className="text-lg font-bold font-headline text-on-surface">{title}</h2>
        {subtitle && <p className="text-xs font-body text-on-surface-variant">{subtitle}</p>}
      </div>
      <button
        type="button"
        onClick={onClose}
        disabled={disabled}
        className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-surface-container transition-colors cursor-pointer disabled:opacity-50"
      >
        <CloseOutlinedIcon style={{ fontSize: 18 }} className="text-on-surface-variant" />
      </button>
    </div>
  );
}

// ── ModalBody ──────────────────────────────────────────────────────────────────
interface ModalBodyProps {
  children: React.ReactNode;
  className?: string;
}

export function ModalBody({ children, className = "" }: ModalBodyProps) {
  return (
    <div className={`flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-4 ${className}`}>
      {children}
    </div>
  );
}

// ── ModalFooter ────────────────────────────────────────────────────────────────
interface ModalFooterProps {
  onCancel: () => void;
  onConfirm: () => void;
  cancelLabel?: string;
  confirmLabel?: string;
  loadingLabel?: string;
  isLoading?: boolean;
  disabled?: boolean;
}

export function ModalFooter({
  onCancel,
  onConfirm,
  cancelLabel = "Batal",
  confirmLabel = "Simpan",
  loadingLabel = "Menyimpan...",
  isLoading = false,
  disabled = false,
}: ModalFooterProps) {
  return (
    <div className="px-6 py-4 border-t border-outline-variant shrink-0 flex gap-3">
      <button
        type="button"
        onClick={onCancel}
        disabled={isLoading || disabled}
        className="flex-1 py-3 rounded-full border border-outline-variant text-sm font-semibold font-body text-on-surface-variant hover:bg-surface-container transition-colors disabled:opacity-50 cursor-pointer"
      >
        {cancelLabel}
      </button>
      <button
        type="button"
        onClick={onConfirm}
        disabled={isLoading || disabled}
        className="flex-1 py-3 rounded-full bg-primary-container text-on-primary-container text-sm font-semibold font-body hover:opacity-90 active:opacity-80 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
      >
        {isLoading ? loadingLabel : confirmLabel}
      </button>
    </div>
  );
}

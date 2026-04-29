"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import ToastContainer from "./ToastContainer";

type ToastType = "success" | "error" | "info" | "warning";

interface Toast {
  id: string;
  message: string;
  type: ToastType;
  isLeaving: boolean;
}

interface ToastContextType {
  toast: (message: string, type?: ToastType) => void;
  success: (message: string) => void;
  error: (message: string | Error) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

const TOAST_DURATION_MS = 4500;
const TOAST_EXIT_DURATION_MS = 400;

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback(
    (message: string, type: ToastType = "info") => {
      const id = Math.random().toString(36).substring(2, 9);

      setToasts((prev) => [...prev, { id, message, type, isLeaving: false }]);

      // Mark as leaving so exit animation plays
      setTimeout(() => {
        setToasts((prev) =>
          prev.map((t) => (t.id === id ? { ...t, isLeaving: true } : t))
        );
      }, TOAST_DURATION_MS - TOAST_EXIT_DURATION_MS);

      // Remove from DOM after animation
      setTimeout(() => {
        removeToast(id);
      }, TOAST_DURATION_MS);
    },
    [removeToast]
  );

  const success = useCallback((message: string) => toast(message, "success"), [toast]);

  const error = useCallback(
    (message: string | Error) => {
      const msg = message instanceof Error ? message.message : message;
      toast(msg, "error");
    },
    [toast]
  );

  return (
    <ToastContext.Provider value={{ toast, success, error }}>
      {children}
      <ToastContainer toasts={toasts} />
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a <ToastProvider>.");
  }
  return context;
};

"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import {
  CheckIcon,
  InfoIcon,
  WarningIcon,
  XCircleIcon,
  XIcon,
} from "@phosphor-icons/react";

interface Toast {
  id: string;
  message: string;
  type: "success" | "error" | "info" | "warning";
}

interface ToastContextType {
  showToast: (message: string, type?: Toast["type"]) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

const MAX_TOASTS = 3;

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback(
    (message: string, type: Toast["type"] = "info") => {
      const id = Math.random().toString(36).substring(2, 9);
      const newToast: Toast = { id, message, type };

      setToasts((prev) => {
        const updatedToasts = [...prev, newToast];
        // keep only the most recent MAX_TOASTS toasts
        return updatedToasts.slice(-MAX_TOASTS);
      });

      setTimeout(() => {
        setToasts((current) => current.filter((toast) => toast.id !== id));
      }, 3000);
    },
    []
  );

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  const toastStyles = {
    success: "bg-green-200 text-green-700",
    error: "bg-red-200 text-red-700",
    warning: "bg-yellow-200 text-yellow-800",
    info: "bg-blue-200 text-blue-700",
  };

  const toastIcon = {
    success: <CheckIcon size={20} weight="light" />,
    error: <XCircleIcon size={20} weight="light" />,
    warning: <WarningIcon size={20} weight="light" />,
    info: <InfoIcon size={20} weight="light" />,
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed top-4 right-0 z-50 space-y-2 pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto min-w-[300px] max-w-md p-4 flex gap-3 items-center justify-center animate-slide-in-right transition-all ${
              toastStyles[toast.type]
            }`}
          >
            <div>{toastIcon[toast.type]}</div>
            <p className="text-sm flex-1">{toast.message}</p>
            <button
              onClick={() => removeToast(toast.id)}
              className="hover:opacity-70"
              aria-label="Close"
            >
              <XIcon size={18} weight="light" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}

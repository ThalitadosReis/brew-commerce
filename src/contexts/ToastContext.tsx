"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  CheckIcon,
  InfoIcon,
  WarningIcon,
  XCircleIcon,
  XIcon,
} from "@phosphor-icons/react";

export type ToastType = "success" | "error" | "info" | "warning";

export interface ToastOptions {
  duration?: number;
}

interface Toast {
  id: string;
  message: string;
  type: ToastType;
  createdAt: number;
  options?: ToastOptions;
}

interface ToastContextType {
  showToast: (
    message: string,
    type?: ToastType,
    options?: ToastOptions
  ) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

const DEFAULT_DURATION = 3000;
const MAX_TOASTS = 3;

export function ToastProvider({
  children,
  position = "top-right",
}: {
  children: React.ReactNode;
  position?: "top-right" | "top-left" | "bottom-right" | "bottom-left";
}) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const timers = useRef(new Map<string, number>());

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
    const handle = timers.current.get(id);
    if (handle) {
      window.clearTimeout(handle);
      timers.current.delete(id);
    }
  }, []);

  const showToast = useCallback(
    (message: string, type: ToastType = "info", options?: ToastOptions) => {
      const id =
        typeof crypto !== "undefined" && "randomUUID" in crypto
          ? crypto.randomUUID()
          : Math.random().toString(36).slice(2);

      const toast: Toast = {
        id,
        message,
        type,
        createdAt: Date.now(),
        options,
      };
      setToasts((prev) => [...prev, toast].slice(-MAX_TOASTS));

      const duration = options?.duration ?? DEFAULT_DURATION;
      const handle = window.setTimeout(() => removeToast(id), duration);
      timers.current.set(id, handle);
    },
    [removeToast]
  );

  useEffect(
    () => () => {
      timers.current.forEach((h) => window.clearTimeout(h));
      timers.current.clear();
    },
    []
  );

  const toastStyles = useMemo(
    () => ({
      success: "bg-green-200 text-green-700",
      error: "bg-red-200 text-red-700",
      warning: "bg-yellow-200 text-yellow-800",
      info: "bg-blue-200 text-blue-700",
    }),
    []
  );

  const toastIcon = useMemo(
    () => ({
      success: <CheckIcon size={20} weight="light" />,
      error: <XCircleIcon size={20} weight="light" />,
      warning: <WarningIcon size={20} weight="light" />,
      info: <InfoIcon size={20} weight="light" />,
    }),
    []
  );

  const posClass = useMemo(() => {
    const base = "fixed z-50 space-y-2 pointer-events-none";
    switch (position) {
      case "top-left":
        return `${base} top-4 left-0`;
      case "bottom-right":
        return `${base} bottom-4 right-0`;
      case "bottom-left":
        return `${base} bottom-4 left-0`;
      default:
        return `${base} top-4 right-0`;
    }
  }, [position]);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className={posClass}>
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
  if (!context) throw new Error("useToast must be used within a ToastProvider");
  return context;
}

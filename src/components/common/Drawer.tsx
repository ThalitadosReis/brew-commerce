"use client";

import React from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@/lib/utils";
import { XIcon } from "@phosphor-icons/react";

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  side?: "left" | "right";
  width?: string;
  showHeader?: boolean;
  ariaLabel?: string;
  headerActions?: React.ReactNode;
}

export default function Drawer({
  isOpen,
  onClose,
  title,
  children,
  footer,
  side = "right",
  width = "md:w-[400px]",
  showHeader = true,
  ariaLabel = "Drawer",
  headerActions,
}: DrawerProps) {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  React.useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, onClose]);

  if (!mounted) return null;

  const portalTarget = typeof document !== "undefined" ? document.body : null;
  if (!portalTarget) return null;

  const panelWidth = width;
  const sideAlignment = side === "left" ? "mr-auto" : "ml-auto";
  const initialX = side === "left" ? "-100%" : "100%";

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-9998 flex items-stretch">
          <motion.div
            className="absolute inset-0 bg-black/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            aria-hidden
            onClick={onClose}
          />
          <motion.aside
            role="dialog"
            aria-label={ariaLabel}
            aria-modal="true"
            initial={{ x: initialX }}
            animate={{ x: 0 }}
            exit={{ x: initialX }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className={cn(
              "relative flex h-screen w-full bg-white",
              panelWidth,
              sideAlignment,
            )}
          >
            <div className="flex h-full w-full flex-col">
              {showHeader && (
                <header className="flex items-center justify-between border-b border-black/10 p-6">
                  {title && (
                    <h6 className="text-base md:text-lg lg:text-2xl text-black tracking-wide">
                      {title}
                    </h6>
                  )}
                  <div className="flex items-center gap-4">
                    {headerActions}
                    <button
                      type="button"
                      aria-label={`Close ${ariaLabel}`}
                      onClick={onClose}
                      className="text-black/50 transition-colors hover:text-black/75"
                    >
                      <XIcon size={18} weight="bold" />
                    </button>
                  </div>
                </header>
              )}

              <div
                className={cn(
                  "flex-1 overflow-y-auto p-6",
                  footer ? "pb-32" : undefined,
                )}
              >
                {children}
              </div>

              {footer && (
                <footer className="sticky bottom-0 border-t border-black/10 p-6">
                  {footer}
                </footer>
              )}
            </div>
          </motion.aside>
        </div>
      )}
    </AnimatePresence>,
    portalTarget,
  );
}

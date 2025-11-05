"use client";

import React from "react";
import { createPortal } from "react-dom";
import { XIcon } from "@phosphor-icons/react";

import { cn } from "@/lib/utils";

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
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
  const [shouldRender, setShouldRender] = React.useState(isOpen);
  const [isVisible, setIsVisible] = React.useState(isOpen);

  React.useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  React.useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      const raf = requestAnimationFrame(() => setIsVisible(true));
      return () => cancelAnimationFrame(raf);
    }
    setIsVisible(false);
    const timeout = setTimeout(() => setShouldRender(false), 200);
    return () => clearTimeout(timeout);
  }, [isOpen]);

  React.useEffect(() => {
    if (!shouldRender) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [shouldRender, onClose]);

  if (!mounted) return null;
  if (!shouldRender) return null;

  const portalTarget =
    typeof document !== "undefined" ? document.body : null;
  if (!portalTarget) return null;

  const translateClosed =
    side === "left" ? "-translate-x-full" : "translate-x-full";
  const translateOpen = "translate-x-0";

  const panelWidth = width;
  const sideAlignment = side === "left" ? "mr-auto" : "ml-auto";

  return createPortal(
    <div
      className={cn(
        "fixed inset-0 z-9998 flex items-stretch",
        isOpen ? "" : "pointer-events-none"
      )}
    >
      <div
        className={cn(
          "absolute inset-0 bg-black/40 transition-opacity duration-200",
          isVisible ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        aria-hidden
        onClick={onClose}
      />
      <section
        role="dialog"
        aria-label={ariaLabel}
        aria-modal="true"
        className={cn(
          "relative flex h-screen max-h-screen w-full max-w-full transform bg-white transition-transform duration-200 ease-out",
          isVisible ? translateOpen : translateClosed,
          panelWidth,
          sideAlignment
        )}
      >
        <div className="flex h-full w-full flex-col">
          {showHeader && (
            <header className="flex items-center justify-between border-b border-black/5 p-8">
              {title && <h6>{title}</h6>}
              <div className="flex items-center gap-4">
                {headerActions}
                <button
                  type="button"
                  aria-label={`Close ${ariaLabel}`}
                  onClick={onClose}
                  className="hover:text-black/50"
                >
                  <XIcon size={18} weight="light" />
                </button>
              </div>
            </header>
          )}

          <div className="flex-1 overflow-y-auto p-8">{children}</div>

          {footer && (
            <footer className="border-t border-black/5 p-8">
              {footer}
            </footer>
          )}
        </div>
      </section>
    </div>,
    portalTarget
  );
}

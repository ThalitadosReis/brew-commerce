"use client";

import React from "react";
import { XIcon } from "@phosphor-icons/react";

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
  const translateClass = isOpen
    ? "translate-x-0"
    : side === "right"
    ? "translate-x-full"
    : "-translate-x-full";

  const positionClass = side === "right" ? "right-0" : "left-0";

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40 h-screen bg-black/30"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <div
        className={`fixed top-0 ${positionClass} h-screen w-full ${width} bg-white z-50 transform transition-transform duration-300 flex flex-col ${translateClass}`}
        role="dialog"
        aria-modal="true"
        aria-label={ariaLabel}
      >
        {showHeader && (
          <div className="flex items-center justify-between gap-4 p-6 border-b border-black/10 flex-shrink-0">
            {title && <h3 className="text-xl font-heading">{title}</h3>}
            <div className="flex items-center gap-3 flex-shrink-0">
              {headerActions}
              <button
                onClick={onClose}
                aria-label={`Close ${ariaLabel}`}
              >
                <XIcon size={18} weight="light" />
              </button>
            </div>
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-6">{children}</div>

        {footer && (
          <div className="p-6 border-t border-black/10 flex-shrink-0 sticky bottom-0">
            {footer}
          </div>
        )}
      </div>
    </>
  );
}

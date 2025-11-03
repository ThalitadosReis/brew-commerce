"use client";

import React from "react";
import { XIcon } from "@phosphor-icons/react";

import { cn } from "@/lib/utils";
import {
  Drawer as UiDrawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";

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
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      onClose();
    }
  };

  return (
    <UiDrawer open={isOpen} onOpenChange={handleOpenChange} direction={side}>
      <DrawerContent
        aria-label={ariaLabel}
        className={cn(
          "h-screen max-h-screen w-full sm:max-w-none bg-white p-0",
          width
        )}
      >
        <div className="flex h-full flex-col">
          {showHeader && (
            <DrawerHeader className="flex flex-row items-center justify-between gap-4 border-b border-black/10 p-8">
              {title && (
                <DrawerTitle className="text-lg! font-medium!">
                  {title}
                </DrawerTitle>
              )}
              <div className="flex items-center gap-4">
                {headerActions}
                <DrawerClose asChild>
                  <button
                    type="button"
                    aria-label={`Close ${ariaLabel}`}
                    className="text-black/60 transition hover:text-black"
                  >
                    <XIcon size={18} weight="light" />
                  </button>
                </DrawerClose>
              </div>
            </DrawerHeader>
          )}

          <div className="flex-1 overflow-y-auto p-8">{children}</div>

          {footer && (
            <DrawerFooter className="border-t border-black/10 p-8">
              {footer}
            </DrawerFooter>
          )}
        </div>
      </DrawerContent>
    </UiDrawer>
  );
}

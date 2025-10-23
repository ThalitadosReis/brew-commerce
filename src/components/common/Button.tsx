"use client";

import React from "react";
import { CaretRightIcon } from "@phosphor-icons/react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "tertiary" | "default";
  className?: string;
}

export default function Button({
  children,
  variant = "default",
  className = "",
  disabled = false,
  ...props
}: ButtonProps) {
  const disabledClasses = disabled ? "opacity-50 cursor-not-allowed" : "";

  if (variant === "primary") {
    return (
      <button
        className={`relative overflow-hidden bg-black text-white px-6 py-3 group ${disabledClasses} ${className}`}
        disabled={disabled}
        {...props}
      >
        {children}
        {!disabled && (
          <span className="pointer-events-none absolute top-[-50px] left-[-75px] w-[50px] h-[155px] bg-white opacity-20 rotate-[35deg] transition-all duration-[550ms] ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:left-[120%]" />
        )}
      </button>
    );
  }

  if (variant === "secondary") {
    return (
      <button
        className={`relative bg-black/15 hover:bg-black/10 px-6 py-3 ${disabledClasses} ${className}`}
        disabled={disabled}
        {...props}
      >
        {children}
      </button>
    );
  }

  if (variant === "tertiary") {
    return (
      <button
        className={`relative flex items-center gap-2 group transition-all duration-300 ease-out ${disabledClasses} ${className}`}
        disabled={disabled}
        {...props}
      >
        {children}
        {!disabled && (
          <CaretRightIcon
            size={16}
            className="transition-transform duration-300 ease-out group-hover:translate-x-1"
          />
        )}
      </button>
    );
  }

  return (
    <button
      className={`${disabledClasses} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}

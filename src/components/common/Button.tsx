"use client";

import React from "react";
import Link from "next/link";
import { CaretRightIcon } from "@phosphor-icons/react";

type BaseProps = {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "tertiary" | "default";
  className?: string;
  disabled?: boolean;
};

type ButtonAsButton = BaseProps &
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    as?: "button";
    href?: never;
  };

type ButtonAsLink = BaseProps &
  Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof BaseProps> & {
    as: "link";
    href: string;
  };

type ButtonAsAnchor = BaseProps &
  Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof BaseProps> & {
    as: "a";
    href: string;
  };

type ButtonProps = ButtonAsButton | ButtonAsLink | ButtonAsAnchor;

export default function Button({
  children,
  variant = "default",
  className = "",
  disabled = false,
  as = "button",
  ...props
}: ButtonProps) {
  const disabledClasses = disabled ? "opacity-50 cursor-not-allowed" : "";

  const baseClasses =
    "inline-flex items-center justify-center transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-black/20 group text-sm sm:text-base";
  const getClasses = () => {
    switch (variant) {
      case "primary":
        return `${baseClasses} text-base relative overflow-hidden bg-black text-white font-medium px-6 py-3 ${disabledClasses} ${className}`;
      case "secondary":
        return `${baseClasses} text-base relative bg-black/5 hover:bg-black/10 font-medium px-6 py-3 ${disabledClasses} ${className}`;
      case "tertiary":
        return `${baseClasses} text-base relative gap-2 font-medium text-black hover:text-black/75 ${disabledClasses} ${className}`;
      default:
        return `${baseClasses} ${disabledClasses} ${className}`;
    }
  };

  const renderContent = () => (
    <>
      {children}
      {variant === "tertiary" && !disabled && (
        <CaretRightIcon
          size={12}
          weight="bold"
          className="transition-transform duration-300 ease-out group-hover:translate-x-1"
        />
      )}
      {variant === "primary" && !disabled && (
        <span className="pointer-events-none absolute top-[-50px] left-[-75px] w-[50px] h-[155px] bg-white opacity-25 rotate-35 transition-all duration-550 ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:left-[120%]" />
      )}
    </>
  );

  if (as === "link") {
    const { href, ...rest } = props as ButtonAsLink;
    return (
      <Link href={href} className={getClasses()} {...rest}>
        {renderContent()}
      </Link>
    );
  }

  if (as === "a") {
    const { href, ...rest } = props as ButtonAsAnchor;
    return (
      <a href={href} className={getClasses()} {...rest}>
        {renderContent()}
      </a>
    );
  }

  // default: render as button
  return (
    <button
      className={getClasses()}
      disabled={disabled}
      {...(props as ButtonAsButton)}
    >
      {renderContent()}
    </button>
  );
}

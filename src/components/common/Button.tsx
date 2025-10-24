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

  const primaryClasses = `relative overflow-hidden bg-black text-white px-6 py-3 group ${disabledClasses} ${className}`;
  const secondaryClasses = `relative bg-black/15 hover:bg-black/10 px-6 py-3 ${disabledClasses} ${className}`;
  const tertiaryClasses = `relative flex items-center gap-2 group transition-all duration-300 ease-out ${disabledClasses} ${className}`;
  const defaultClasses = `${disabledClasses} ${className}`;

  const getClasses = () => {
    switch (variant) {
      case "primary":
        return primaryClasses;
      case "secondary":
        return secondaryClasses;
      case "tertiary":
        return tertiaryClasses;
      default:
        return defaultClasses;
    }
  };

  const renderContent = () => (
    <>
      {children}
      {variant === "tertiary" && !disabled && (
        <CaretRightIcon
          size={16}
          className="transition-transform duration-300 ease-out group-hover:translate-x-1"
        />
      )}
      {variant === "primary" && !disabled && (
        <span className="pointer-events-none absolute top-[-50px] left-[-75px] w-[50px] h-[155px] bg-white opacity-20 rotate-[35deg] transition-all duration-[550ms] ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:left-[120%]" />
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

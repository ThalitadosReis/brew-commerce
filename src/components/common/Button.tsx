"use client";
import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  ReactNode,
} from "react";
import Link from "next/link";

const baseClasses =
  "group inline-flex w-fit items-center justify-center gap-3 px-8 py-3.5 text-[11px] font-medium uppercase tracking-[0.2em] transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30 overflow-hidden";

const linkBaseClasses =
  "group inline-flex w-fit text-[11px] font-medium uppercase tracking-[0.2em] focus:outline-none";

const variantClasses = {
  primary: "border border-transparent bg-black text-white hover:bg-black/80",
  secondary:
    "border border-neutral-200 bg-white text-neutral-900 hover:bg-white/80",
  outline: "border border-current bg-transparent text-current hover:opacity-70",
  link: "text-left text-neutral-900",
} as const;

type BaseProps = {
  children: ReactNode;
  variant?: keyof typeof variantClasses;
  className?: string;
  disabled?: boolean;
};

type ButtonAsButton = BaseProps &
  ButtonHTMLAttributes<HTMLButtonElement> & {
    as?: "button";
    href?: never;
  };

type ButtonAsLink = BaseProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof BaseProps> & {
    as: "link";
    href: string;
  };

type ButtonAsAnchor = BaseProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof BaseProps> & {
    as: "a";
    href: string;
  };

type ButtonProps = ButtonAsButton | ButtonAsLink | ButtonAsAnchor;

function RollingContent({
  children,
  isLink,
}: {
  children: ReactNode;
  isLink: boolean;
}) {
  if (isLink) {
    return (
      <span className="relative">
        {children}
        <span className="absolute bottom-0 left-0 h-px w-full origin-right scale-x-0 bg-current transition-transform duration-300 ease-out group-hover:origin-left group-hover:scale-x-100" />
      </span>
    );
  }

  return (
    <span className="relative overflow-hidden">
      <span className="block transition-transform duration-300 group-hover:-translate-y-full">
        {children}
      </span>
      <span className="absolute left-0 top-full block transition-transform duration-300 group-hover:-translate-y-full">
        {children}
      </span>
    </span>
  );
}

export default function Button({
  children,
  variant = "primary",
  className = "",
  disabled = false,
  as = "button",
  ...props
}: ButtonProps) {
  const isLink = variant === "link";
  const disabledClasses = disabled ? "opacity-50 cursor-not-allowed" : "";
  const buttonClasses = isLink
    ? `${linkBaseClasses} ${variantClasses.link} ${disabledClasses} ${className}`.trim()
    : `${baseClasses} ${variantClasses[variant]} ${disabledClasses} ${className}`.trim();

  const renderContent = () => (
    <RollingContent isLink={isLink}>{children}</RollingContent>
  );

  if (as === "link") {
    const { href, ...rest } = props as ButtonAsLink;
    return (
      <Link href={href} className={buttonClasses} {...rest}>
        {renderContent()}
      </Link>
    );
  }

  if (as === "a") {
    const { href, ...rest } = props as ButtonAsAnchor;
    return (
      <a href={href} className={buttonClasses} {...rest}>
        {renderContent()}
      </a>
    );
  }

  return (
    <button
      className={buttonClasses}
      disabled={disabled}
      {...(props as ButtonAsButton)}
    >
      {renderContent()}
    </button>
  );
}

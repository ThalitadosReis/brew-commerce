"use client";

import * as React from "react";
import { QuotesIcon } from "@phosphor-icons/react";

interface QuoteProps {
  text: React.ReactNode;
  author: React.ReactNode;
  icon?: React.ReactNode;
}

interface AuthLayoutProps {
  imageUrl: string;
  imageAlt?: string;
  overlay?: React.ReactNode;
  quote?: QuoteProps;
  overlayWrapperClassName?: string;
  contentWrapperClassName?: string;
  children: React.ReactNode;
}

export function AuthLayout({
  imageUrl,
  imageAlt,
  overlay,
  quote,
  overlayWrapperClassName,
  contentWrapperClassName,
  children,
}: AuthLayoutProps) {
  const overlayContent =
    overlay ??
    (quote ? (
      <>
        <div className="mb-auto">
          <span className="inline-flex bg-white p-2">
            {quote.icon ?? <QuotesIcon size={28} weight="fill" />}
          </span>
        </div>
        <blockquote className="space-y-2 text-base leading-relaxed text-white">
          <p className="text-2xl font-medium">{quote.text}</p>
          <p className="text-lg text-white/70">{quote.author}</p>
        </blockquote>
      </>
    ) : null);

  const wrapperClassName = [
    "w-full max-w-md flex flex-col items-center",
    contentWrapperClassName,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="min-h-screen bg-black/5 py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="relative overflow-hidden h-[420px] sm:h-[480px] md:h-[560px] lg:h-[720px]">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `url('${imageUrl}')`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
              aria-hidden="true"
            />
            {imageAlt ? <span className="sr-only">{imageAlt}</span> : null}
            <div
              className={`relative flex h-full flex-col justify-end p-6 lg:p-8 ${
                overlayWrapperClassName ?? ""
              }`}
            >
              {overlayContent}
            </div>
          </div>

          <div className="flex items-center justify-center">
            <div className={wrapperClassName}>{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

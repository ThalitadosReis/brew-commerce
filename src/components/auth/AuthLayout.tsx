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
            {quote.icon ?? <QuotesIcon size={32} weight="fill" />}
          </span>
        </div>
        <blockquote className="space-y-2 text-white">
          <p>
            {quote.text} - <span className="font-medium!">{quote.author}</span>
          </p>
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
    <div className="min-h-screen bg-black/5 flex items-center py-24">
      <div className="mx-auto max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-8">
          <div className="relative overflow-hidden h-[480px] md:h-[560px] lg:h-[720px]">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `url('${imageUrl}')`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
              aria-hidden="true"
            />
            <div className="absolute inset-0 bg-black/20" />

            {imageAlt ? <span className="sr-only">{imageAlt}</span> : null}
            <div
              className={`relative flex h-full flex-col justify-end p-8 ${
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

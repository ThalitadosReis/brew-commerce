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
            {quote.icon ?? (
              <QuotesIcon
                weight="fill"
                className="w-6 h-6 md:w-8 md:h-8 lg:w-9 lg:h-9"
              />
            )}
          </span>
        </div>
        <blockquote className="space-y-2 text-white">
          <p className="text-sm md:text-base lg:text-lg">{quote.text}</p>
          <span className="font-medium">{quote.author}</span>
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
    <div className="max-w-7xl mx-auto min-h-screen flex flex-col lg:flex-row items-center justify-center py-20 px-4 md:px-6">
      <div className="relative h-[360px] sm:h-[420px] md:h-[520px] lg:h-[760px] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center md:bg-position-[40%_30%]"
          style={{
            backgroundImage: `url('${imageUrl}')`,
          }}
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-black/30" />

        {imageAlt ? <span className="sr-only">{imageAlt}</span> : null}
        <div
          className={`relative flex h-full flex-col justify-end p-6 sm:p-10 ${
            overlayWrapperClassName ?? ""
          }`}
        >
          {overlayContent}
        </div>
      </div>

      <div className="h-8 lg:hidden" />

      <div className="w-full flex justify-center lg:justify-center">
        <div className={wrapperClassName}>{children}</div>
      </div>
    </div>
  );
}

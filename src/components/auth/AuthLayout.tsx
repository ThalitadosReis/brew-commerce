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
    <div className="bg-black/5">
      <div className="mx-auto max-w-7xl px-6">
        <div className="py-24">
          <div className="grid gap-8 lg:grid-cols-2 lg:items-center lg:gap-12">
            <div className="relative h-[520px] md:h-[640px] lg:h-[720px] overflow-hidden">
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
                className={`relative flex h-full flex-col justify-end p-8 sm:p-10 ${
                  overlayWrapperClassName ?? ""
                }`}
              >
                {overlayContent}
              </div>
            </div>

            <div className="flex justify-center lg:justify-center">
              <div className={wrapperClassName}>{children}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { CaretLeftIcon } from "@phosphor-icons/react";
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 py-20">
      <div className="relative z-10 text-center space-y-8">
        <p className="text-5xl font-extrabold text-primary mb-2 tracking-tight">
          404
        </p>
        <h1 className="text-4xl md:text-5xl font-display text-primary/90 tracking-tight">
          This page has gone cold
        </h1>
        <p className="text-secondary/70">
          The page you’re looking for doesn’t exist.
          <br />
          Let’s get you back to something warm and familiar.
        </p>

        <Link
          href="/collection"
          className="inline-flex items-center gap-2 text-sm group transition-colors hover:text-primary/70"
        >
          <span className="transform transition-transform duration-300 group-hover:-translate-x-1">
            <CaretLeftIcon size={20} weight="light" />
          </span>
          Back Home
        </Link>
      </div>

      <div className="pt-8 text-center">
        <p className="text-sm text-secondary/70 ">
          Or try one of these popular pages:
        </p>
        <div className="flex flex-wrap justify-center gap-4 text-sm">
          <Link href="/collection" className="hover:underline">
            Our Collection
          </Link>
          <span className="text-secondary/40">/</span>
          <Link href="/about" className="hover:underline">
            About Us
          </Link>
          <span className="text-secondary/40">/</span>
          <Link href="/contact" className="hover:underline">
            Contact
          </Link>
        </div>
      </div>
    </main>
  );
}

"use client";

import Button from "@/components/common/Button";

export default function NotFound() {
  return (
    <main className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-4 py-24">
      <div className="max-w-lg mx-auto text-center space-y-6">
        <p className="text-[11px] uppercase tracking-[0.3em] text-amber-700">
          404
        </p>
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold tracking-[-0.03em] text-black leading-tight">
          This page has gone cold
        </h1>
        <p className="text-sm leading-7 text-neutral-500">
          The path you were looking for has vanished like steam from a fresh
          brew. Let&apos;s get you back on track.
        </p>
        <div className="flex justify-center gap-4 pt-2">
          <Button as="a" href="/" variant="primary">
            Go home
          </Button>
          <Button as="a" href="/collection" variant="secondary">
            Shop coffee
          </Button>
        </div>
      </div>
    </main>
  );
}

"use client";

import Button from "@/components/common/Button";

export default function NotFound() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-black/5">
      <div className="max-w-2xl mx-auto text-center py-24 px-6 space-y-8">
        <h1 className="text-4xl md:text-5xl font-heading">
          This page has gone cold
        </h1>

        <p className="text-sm font-body text-black/70">
          The path you seek has vanished like steam from a fresh brew. Our map
          seems to have taken an unexpected detour.
        </p>

        <div className="flex justify-center gap-4 pt-4">
          <Button as="link" href="/homepage" variant="primary">
            Home
          </Button>

          <Button as="link" href="/collection" variant="secondary">
            Shop collection
          </Button>
        </div>
      </div>
    </main>
  );
}

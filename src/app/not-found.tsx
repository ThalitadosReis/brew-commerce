"use client";

import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center">
      <div className="max-w-2xl mx-auto text-center py-24 px-6 space-y-8">
        <h1 className="text-4xl md:text-5xl font-heading">
          This page has gone cold
        </h1>   
        <p className="text-sm font-body">
          The path you seek has vanished like steam from a fresh brew. Our map
          seems to have taken an unexpected detour.
        </p>

        <div className="inline-flex gap-4">
          <Link
            href="/homepage"
            className="text-white bg-black hover:opacity-70 font-medium px-6 py-3"
          >
            Home
          </Link>
          <Link
            href="/collection"
            className="bg-black/5 hover:bg-black/10 font-medium px-6 py-3"
          >
            Shop collection
          </Link>
        </div>
      </div>
    </main>
  );
}

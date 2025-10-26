"use client";

import React from "react";

export default function Loading({
  message = "Loading...",
  fullscreen = true,
}: {
  message?: string;
  fullscreen?: boolean;
}) {
  return (
    <div
      className={`${
        fullscreen ? "min-h-screen" : ""
      } flex flex-col items-center justify-center bg-black/5 text-center`}
    >
      <div className="w-8 h-8 border-2 border-black/20 border-t-black rounded-full animate-spin mb-4" />
      <p className="text-sm text-black/70 font-medium">{message}</p>
    </div>
  );
}

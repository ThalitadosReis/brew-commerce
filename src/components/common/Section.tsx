"use client";

import type { ReactNode } from "react";

interface SectionProps {
  subtitle?: ReactNode;
  title: string;
  description?: string;
  className?: string;
  align?: "center" | "left";
  action?: ReactNode;
}

export default function Section({
  subtitle,
  title,
  description,
  className = "",
  align = "center",
  action,
}: SectionProps) {
  const isLeft = align === "left";

  return (
    <div className={`mb-8 md:mb-12 lg:mb-16 ${action ? "flex flex-col items-center md:flex-row md:items-end md:justify-between gap-4 md:gap-6" : ""}`}>
      <div className={`space-y-3 ${isLeft ? "max-w-xl mx-auto md:mx-0 text-center md:text-left" : "max-w-2xl mx-auto text-center"} ${className}`}>
        {subtitle && (
          <h6 className="text-[11px] uppercase tracking-[0.3em] text-amber-700">
            {subtitle}
          </h6>
        )}
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold tracking-[-0.03em] text-black">
          {title}
        </h2>
        {description && (
          <p className="text-sm md:text-base font-light text-neutral-600">
            {description}
          </p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

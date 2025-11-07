"use client";

import React from "react";

interface SectionProps {
  subtitle?: string;
  title: string;
  description?: string;
  className?: string;
}

export default function Section({
  subtitle,
  title,
  description,
  className = "",
}: SectionProps) {
  return (
    <div className="mb-12">
      <div className={`max-w-3xl mx-auto text-center ${className}`}>
        {subtitle && (
          <h6 className="text-base md:text-lg lg:text-xl text-black tracking-wide">
            {subtitle}
          </h6>
        )}
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold leading-snug">
          {title}
        </h2>
        {description && (
          <p className="text-sm md:text-base leading-6 text-black/75">
            {description}
          </p>
        )}
      </div>
    </div>
  );
}

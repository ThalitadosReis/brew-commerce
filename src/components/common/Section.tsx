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
    <div className="mb-10 lg:mb-14">
      <div className={`max-w-xl mx-auto text-center space-y-2 ${className}`}>
        {subtitle && (
          <h6 className="text-base md:text-lg lg:text-2xl text-black tracking-wide">
            {subtitle}
          </h6>
        )}
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold leading-snug">
          {title}
        </h2>
        {description && (
          <p className="text-sm sm:text-base md:text-[1.05rem] lg:text-[1.1rem] leading-6 text-black/75">
            {description}
          </p>
        )}
      </div>
    </div>
  );
}

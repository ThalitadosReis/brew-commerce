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
    <div className="mb-12 lg:mb-24">
      <div className={`max-w-2xl mx-auto text-center ${className}`}>
        {subtitle && <h6>{subtitle}</h6>}
        <h2 className="leading-tight!">{title}</h2>
        {description && <p>{description}</p>}
      </div>
    </div>
  );
}

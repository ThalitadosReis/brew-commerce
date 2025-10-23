"use client";

import React from "react";

interface SectionHeaderProps {
  subtitle?: string;
  title: string;
  description?: string;
  className?: string;
}

export default function SectionHeader({
  subtitle,
  title,
  description,
  className = "",
}: SectionHeaderProps) {
  return (
    <div className="mb-12 lg:mb-24">
      <div className={`max-w-3xl mx-auto text-center space-y-4 ${className}`}>
        {subtitle && <h5 className="mb-2 text-lg font-heading">{subtitle}</h5>}
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading">
          {title}
        </h2>
        {description && <p className="font-body">{description}</p>}
      </div>
    </div>
  );
}

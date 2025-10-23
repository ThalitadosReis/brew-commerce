"use client";

import React from "react";

interface PageHeaderProps {
  title: string;
  description: string;
  className?: string;
}

export default function PageHeader({
  title,
  description,
  className = "",
}: PageHeaderProps) {
  return (
    <div
      className={`max-w-2xl mx-auto text-center pt-24 px-6 space-y-4 ${className}`}
    >
      <h1 className="text-5xl md:text-6xl lg:text-7xl font-heading">{title}</h1>
      {description && <p className="text-sm font-body">{description}</p>}
    </div>
  );
}

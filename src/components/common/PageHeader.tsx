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
    <div className={`max-w-3xl mx-auto text-center px-6 ${className}`}>
      <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
        {title}
      </h1>
      {description && (
        <p className="mt-2 text-base lg:text-lg leading-7 text-black/75">
          {description}
        </p>
      )}
    </div>
  );
}

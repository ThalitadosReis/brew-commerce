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
    <div className={`max-w-3xl mx-auto text-center ${className}`}>
      <h1>{title}</h1>
      {description && <p>{description}</p>}
    </div>
  );
}

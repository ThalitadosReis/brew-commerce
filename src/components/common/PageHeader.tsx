"use client";

import Image from "next/image";

interface PageHeaderProps {
  title: string;
  description: string;
  backgroundImage?: string;
  className?: string;
}

export default function PageHeader({
  title,
  description,
  backgroundImage,
  className = "",
}: PageHeaderProps) {
  return (
    <section
      className={`relative isolate overflow-hidden px-6 pb-12 pt-40 lg:pb-24 lg:pt-48 ${className}`}
    >
      {backgroundImage && (
        <>
          <div className="absolute inset-0 -z-20">
            <Image
              src={backgroundImage}
              alt=""
              fill
              sizes="100vw"
              className="object-cover"
              priority
            />
          </div>
          <div className="absolute inset-0 -z-10 bg-linear-to-b from-black/25 via-black/50 to-black/75" />
        </>
      )}

      <div className="mx-auto max-w-3xl text-center">
        <h1 className="text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl text-white ">
          {title}
        </h1>
        {description && (
          <p
            className="mt-2 text-sm lg:text-base font-light leading-7 text-white/75"
          >
            {description}
          </p>
        )}
      </div>
    </section>
  );
}

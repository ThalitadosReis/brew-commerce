"use client";

import Link from "next/link";

export default function Footer() {
  const links = [
    { href: "/collection", label: "Collection" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <footer className="relative max-w-7xl mx-auto px-6 py-10">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-heading tracking-tight">brew.</h2>
        <p className="mx-auto text-sm text-secondary/70 leading-relaxed">
          Premium coffee delivered to your doorstep.
          <br className="hidden sm:block" />
          Ethically sourced, expertly roasted, and served with love.
        </p>
      </div>

      {/* links */}
      <nav className="flex items-center justify-center flex-wrap mt-4 text-sm font-medium text-secondary/70">
        {links.map(({ href, label }, i) => (
          <div key={href} className="flex items-center">
            <Link
              href={href}
              className="relative inline-block overflow-hidden group hover:text-foreground transition-colors"
            >
              <span className="block transition-transform duration-300 group-hover:-translate-y-full">
                {label}
              </span>
              <span className="absolute left-0 top-full block transition-transform duration-300 group-hover:-translate-y-full">
                {label}
              </span>
            </Link>
            {i < links.length - 1 && (
              <span className="mx-6 text-secondary/30">|</span>
            )}
          </div>
        ))}
      </nav>

      {/* bottom bar */}
      <div className="mt-8 pt-8 border-t border-secondary/10 flex flex-col md:flex-row items-center justify-between gap-2 text-sm text-secondary/70">
        <p>© 2025 brew. All rights reserved.</p>
        <p>Made with by Thalita dos Reis</p>
      </div>
    </footer>
  );
}

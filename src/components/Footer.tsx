"use client";

import Link from "next/link";

export default function Footer() {
  const links = [
    { href: "/collection", label: "Collection" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <footer className="max-w-7xl mx-auto px-8">
      <div className="space-y-8 py-12">
        <div className="space-y-2 text-center">
          <h5>brew.</h5>
          <p>
            Premium coffee delivered to your doorstep.
            <br />
            Ethically sourced, expertly roasted, and served with love.
          </p>
        </div>

        <nav className="flex items-center justify-center flex-wrap">
          {links.map(({ href, label }, i) => (
            <div key={href} className="flex items-center">
              <Link
                href={href}
                className="relative inline-block overflow-hidden text-sm group hover:text-foreground transition-colors"
              >
                <span className="block transition-transform duration-300 group-hover:-translate-y-full">
                  {label}
                </span>
                <span className="absolute left-0 top-full block transition-transform duration-300 group-hover:-translate-y-full">
                  {label}
                </span>
              </Link>
              {i < links.length - 1 && (
                <span className="mx-4 text-black/25">|</span>
              )}
            </div>
          ))}
        </nav>

        <div className="border-t border-black/10" />

        <div className="flex flex-col md:flex-row items-center justify-between font-normal text-black/75">
          <small>© 2025 brew. All rights reserved.</small>
          <small>Made with by Thalita dos Reis</small>
        </div>
      </div>
    </footer>
  );
}

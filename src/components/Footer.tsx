"use client";

import { ArrowUpRightIcon } from "@phosphor-icons/react";
import Button from "./common/Button";

export default function Footer() {
  const links = [
    { href: "/collection", label: "Collection" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <footer className="max-w-7xl mx-auto px-6">
      <div className="space-y-8 py-12">
        <div className="text-center">
          <span className="text-lg font-medium tracking-[0.15em] uppercase">
            brew<span className="text-amber-700">.</span>
          </span>
          <p className="mt-2 text-sm lg:text-base font-light text-black/75">
            Premium coffee delivered to your doorstep.
            <br />
            Ethically sourced, expertly roasted, and served with love.
          </p>
        </div>

        <nav className="flex items-center justify-center flex-wrap">
          {links.map(({ href, label }, i) => (
            <div key={href} className="flex items-center">
              <Button as="link" href={href} variant="link">
                {label}
              </Button>
              {i < links.length - 1 && (
                <span className="mx-4 text-black/25">/</span>
              )}
            </div>
          ))}
        </nav>

        <div className="border-t border-black/10" />

        <div className="flex flex-col md:flex-row items-center justify-between text-black/75">
          <small>© 2025 BREW. All rights reserved.</small>
          <small>
            <a
              href="https://thalitadosreis.ch/"
              target="_blank"
              rel="noreferrer"
              className="transition-colors hover:text-black"
            >
              Made by Thalita dos Reis
              <ArrowUpRightIcon size={12} className="inline-block ml-1" />
            </a>
          </small>
        </div>
      </div>
    </footer>
  );
}

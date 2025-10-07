"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full bg-muted">
      <div className="max-w-6xl mx-auto px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* brand */}
          <div className="space-y-4 text-center md:text-left lg:col-span-2">
            <h2 className="text-3xl font-heading">brew.</h2>
            <p className="text-sm font-body text-secondary/70 leading-relaxed max-w-xs mx-auto md:mx-0">
              Premium coffee delivered to your doorstep. Ethically sourced,
              expertly roasted, and served with love.
            </p>
          </div>

          {/* navigation links */}
          <div className="grid grid-cols-2 gap-8 text-center md:text-left lg:col-span-2">
            <div className="space-y-4">
              <h3 className="font-display italic text-xl">Shop</h3>
              <ul className="space-y-1">
                <li>
                  <Link
                    href="/collection"
                    className="relative inline-block overflow-hidden group text-sm font-heading text-secondary/70"
                  >
                    <span className="block transition-transform duration-300 group-hover:-translate-y-full">
                      Collection
                    </span>
                    <span className="absolute left-0 top-full block transition-transform duration-300 group-hover:-translate-y-full">
                      Collection
                    </span>
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="font-display italic text-xl">Company</h3>
              <ul className="space-y-1">
                <li>
                  <Link
                    href="/about"
                    className="relative inline-block overflow-hidden group text-sm font-heading text-secondary/70"
                  >
                    <span className="block transition-transform duration-300 group-hover:-translate-y-full">
                      About
                    </span>
                    <span className="absolute left-0 top-full block transition-transform duration-300 group-hover:-translate-y-full">
                      About
                    </span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="relative inline-block overflow-hidden group text-sm font-heading text-secondary/70"
                  >
                    <span className="block transition-transform duration-300 group-hover:-translate-y-full">
                      Contact
                    </span>
                    <span className="absolute left-0 top-full block transition-transform duration-300 group-hover:-translate-y-full">
                      Contact
                    </span>
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* map */}
          <div className="w-full h-fit rounded-lg overflow-hidden md:col-span-2">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m10!1m8!1m3!1d2701.7454063186087!2d8.5382009!3d47.3778873!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sch!4v1759865908352!5m2!1sen!2sch"
              width="100%"
              height="100%"
              style={{
                border: 0,
                filter:
                  "sepia(0.1) saturate(0.9) contrast(0.9) brightness(0.9)",
              }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>

        {/* bottom bar */}
        <div className="border-t border-secondary/10 mt-12 pt-6 flex flex-col md:flex-row justify-between items-center gap-4 md:gap-0">
          <p className="text-sm text-secondary/70 text-center md:text-left">
            © {new Date().getFullYear()} brew. All rights reserved.
          </p>
          <span className="text-sm text-secondary/70 text-center md:text-right">
            Made by Thalita dos Reis
          </span>
        </div>
      </div>
    </footer>
  );
}

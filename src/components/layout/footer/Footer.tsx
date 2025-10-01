import { Instagram, Linkedin } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full bg-white">
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2 space-y-4">
            <h2 className="font-display text-3xl text-primary">brew.</h2>
            <p className="max-w-md font-body text-accent">
              Premium coffee delivered to your doorstep. Ethically sourced,
              expertly roasted, and served with love.
            </p>
            <div className="flex space-x-4">
              <Link
                href="#"
                className="text-accent hover:text-primary transition-colors"
              >
                <Instagram className="h-5 w-5" />
              </Link>
              <Link
                href="#"
                className="text-accent hover:text-primary transition-colors"
              >
                <Linkedin className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* links */}
          <div className="grid grid-cols-2 col-span-1 md:col-span-2 font-body">
            <div>
              <h3 className="uppercase font-heading font-semibold tracking-wider text-base mb-1">
                Shop
              </h3>

              <Link
                href="/collections"
                className="text-accent hover:text-primary transition-colors"
              >
                All Products
              </Link>
            </div>

            <div>
              <h3 className="uppercase font-heading font-semibold tracking-wider text-base mb-1">
                Company
              </h3>
              <ul>
                <li>
                  <Link
                    href="/about"
                    className="text-accent hover:text-primary transition-colors"
                  >
                    About Us
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="text-accent hover:text-primary transition-colors"
                  >
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* bottom bar */}
        <div className="border-t border-neutral mt-10 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="font-body text-accent">
            © {new Date().getFullYear()} brew. All rights reserved.
          </p>
          <span className="font-body text-accent">
            Made with ❤️ by Thalita dos Reis
          </span>
        </div>
      </div>
    </footer>
  );
}

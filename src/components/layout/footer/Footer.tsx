import { Instagram, Linkedin } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full bg-mist">
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* brand */}
          <div className="col-span-1 md:col-span-2 space-y-4">
            <h2 className="font-primary text-3xl tracking-wide text-onyx">
              brew.
            </h2>
            <p className="font-secondary text-sm max-w-md text-onyx/80">
              Premium coffee delivered to your doorstep. Ethically sourced,
              expertly roasted, and served with love.
            </p>
            <div className="flex space-x-4">
              <Link
                href="#"
                className="text-onyx/70 hover:text-onyx transition-colors"
              >
                <Instagram className="h-5 w-5" />
              </Link>
              <Link
                href="#"
                className="text-onyx/70 hover:text-onyx transition-colors"
              >
                <Linkedin className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* links */}
          <div className="col-span-1 md:col-span-2 grid grid-cols-2 text-sm">
            <div>
              <h3 className="uppercase font-secondary font-bold tracking-wide text-onyx mb-2">
                Shop
              </h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="#"
                    className="text-onyx/70 hover:text-onyx transition-colors"
                  >
                    All Products
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-onyx/70 hover:text-onyx transition-colors"
                  >
                    Coffee Beans
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-onyx/70 hover:text-onyx transition-colors"
                  >
                    Equipment
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="uppercase font-secondary font-bold tracking-wide text-onyx mb-2">
                Company
              </h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="#"
                    className="text-onyx/70 hover:text-onyx transition-colors"
                  >
                    About Us
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-onyx/70 hover:text-onyx transition-colors"
                  >
                    Brewing Guides
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-onyx/70 hover:text-onyx transition-colors"
                  >
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* bottom bar */}
        <div className="border-t border-onyx/20 mt-10 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-onyx/70">
            © {new Date().getFullYear()} brew. All rights reserved.
          </p>
          <span className="text-sm text-onyx/70">
            Made with ❤️ by Thalita dos Reis
          </span>
        </div>
      </div>
    </footer>
  );
}

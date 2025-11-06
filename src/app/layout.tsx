import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://brew-commerce.app"),
  title: {
    default: "Brew Commerce",
    template: "%s · Brew Commerce",
  },
  description:
    "Brew Commerce helps coffee roasters launch and manage their online storefront with rich admin tooling and a premium shopping experience.",
  authors: [{ name: "Brew Commerce" }],
  icons: {
    icon: [
      {
        url: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ctext x='50%25' y='.85em' font-size='80' text-anchor='middle'%3E%26%239749%3B%3C/text%3E%3C/svg%3E",
        rel: "icon",
      },
    ],
    shortcut: [
      {
        url: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ctext x='50%25' y='.85em' font-size='80' text-anchor='middle'%3E%26%239749%3B%3C/text%3E%3C/svg%3E",
      },
    ],
    apple: [
      {
        url: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ctext x='50%25' y='.85em' font-size='80' text-anchor='middle'%3E%26%239749%3B%3C/text%3E%3C/svg%3E",
      },
    ],
  },
  openGraph: {
    title: "Brew Commerce",
    description:
      "Modern e-commerce platform for specialty coffee shops and roasters.",
    url: "https://brew-commerce.app",
    siteName: "Brew Commerce",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Brew Commerce",
    description:
      "Modern e-commerce platform for specialty coffee shops and roasters.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}

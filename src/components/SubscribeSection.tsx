"use client";
import { useState, useEffect } from "react";

export default function SubscribeSection() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setStatus("error");
      return;
    }

    // simulate request
    setStatus("loading");
    setTimeout(() => {
      setStatus("success");
      setEmail("");
    }, 1200);
  };

  // auto-reset status
  useEffect(() => {
    if (status === "success" || status === "error") {
      const timer = setTimeout(() => setStatus("idle"), 2500);
      return () => clearTimeout(timer);
    }
  }, [status]);

  return (
    <section className="pb-20 px-6">
      <div className="relative max-w-7xl mx-auto h-container overflow-hidden rounded-3xl">
        <div
          className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage:
              "url('https://images.pexels.com/photos/20121334/pexels-photo-20121334.jpeg')",
          }}
        ></div>

        <div className="absolute inset-0 bg-black/40"></div>

        {/* content */}
        <div className="relative z-10 py-20 px-6">
          <div className="space-y-8">
            <h2 className="font-display text-white text-5xl md:text-6xl lg:text-7xl">
              Stay connected
            </h2>
            <p className="max-w-md font-body text-neutral">
              Subscribe to our newsletter and stay up to date with the latest
              updates, news, and offers.
            </p>

            {/* form */}
            <form
              onSubmit={handleSubmit}
              className="bg-white flex items-center justify-between gap-2 p-1 rounded-full w-full md:w-md"
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="text-sm px-4 py-3  text-primary placeholder-muted/50 bg-transparent focus:outline-none rounded-full"
              />

              <button
                type="submit"
                disabled={status === "loading"}
                className={`text-sm w-fit px-6 py-3 rounded-full
      ${
        status === "success"
          ? "bg-accent text-white"
          : status === "error"
          ? "bg-accent/20 text-primary border border-accent/20"
          : "bg-primary text-white"
      }
      ${status === "loading" ? "opacity-70 cursor-not-allowed" : ""}
    `}
              >
                {status === "loading"
                  ? "Subscribing..."
                  : status === "success"
                  ? "Subscribed!"
                  : status === "error"
                  ? "Invalid Email"
                  : "Subscribe"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

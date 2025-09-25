"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { MoveRight, Coffee, Star, Users, Zap, ArrowRight } from "lucide-react";
import Image from "next/image";

type Product = {
  id: number;
  name: string;
  price: number;
  rating: number;
  image: string;
  description: string;
};

export default function Homepage() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const featuredProducts: Product[] = [
    {
      id: 1,
      name: "Ethiopian Yirgacheffe",
      price: 24.99,
      rating: 4.8,
      image: "/placeholder-coffee1.jpg",
      description: "Bright, floral notes with citrus undertones",
    },
    {
      id: 2,
      name: "Colombian Supremo",
      price: 22.99,
      rating: 4.9,
      image: "/placeholder-coffee2.jpg",
      description: "Rich, full-bodied with chocolate finish",
    },
    {
      id: 3,
      name: "Brazil Santos",
      price: 19.99,
      rating: 4.7,
      image: "/placeholder-coffee3.jpg",
      description: "Smooth, nutty flavor with low acidity",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* hero */}
      <section className="relative h-container overflow-hidden">
        {/* image background with parallax */}
        <div
          className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage:
              "url('https://i.pinimg.com/736x/fb/a6/ad/fba6adc34711997b82a6c670befd6a14.jpg')",
            transform: `translateY(${scrollY * 0.5}px)`,
          }}
        ></div>

        {/* overlay */}
        <div className="absolute inset-0 bg-black/40"></div>

        {/* content */}
        <div className="relative z-10 h-full flex items-center justify-center py-40">
          <div className="max-w-7xl mx-auto px-6 w-full">
            <div className="text-center">
              {/* coffee plant image */}
              <div>
                <Image
                  src="/logo.png"
                  alt="Coffee Plant"
                  width={150}
                  height={150}
                  className="mx-auto"
                />
              </div>

              <h1 className="uppercase text-white font-primary -mt-4 text-3xl md:text-4xl lg:text-5xl  mb-2">
                Crafting Coffee Excellence
                <br className="block" />
                One Bean at a Time
              </h1>
              <p className="lg:text-lg text-white/70 max-w-lg mb-8 mx-auto">
                Discover the perfect cup with our carefully sourced, expertly
                roasted coffee beans from around the world.
              </p>
              <div className="uppercase text-sm font-primary w-fit mx-auto flex flex-col sm:flex-row justify-center">
                <Link
                  href="/collection"
                  className="text-white px-8 py-3 border-1 rounded-full flex items-center gap-4 hover:bg-white/90 hover:text-black transition-colors "
                >
                  Shop Now
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}

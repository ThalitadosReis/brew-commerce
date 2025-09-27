"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, MoveRight } from "lucide-react";
import Image from "next/image";

type Product = {
  id: number;
  name: string;
  price: number;
  image: string;
  roast: string;
  country: string;
};

export default function Homepage() {
  const [scrollY, setScrollY] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const featuredProducts: Product[] = [
    {
      id: 1,
      name: "Morning Bloom",
      price: 24.99,
      image: "/mockup-coffee.png",
      roast: "Light Roast",
      country: "Ethiopia",
    },
    {
      id: 2,
      name: "Velvet Thunder",
      price: 22.99,
      image: "/mockup-coffee.png",
      roast: "Medium-Dark Roast",
      country: "Colombia",
    },
    {
      id: 3,
      name: "Golden Horizon",
      price: 19.99,
      image: "/mockup-coffee.png",
      roast: "Medium Roast",
      country: "Brazil",
    },
    {
      id: 4,
      name: "Midnight Fire",
      price: 26.99,
      image: "/mockup-coffee.png",
      roast: "Dark Roast",
      country: "Guatemala",
    },
    {
      id: 5,
      name: "Ruby Cascade",
      price: 28.99,
      image: "/mockup-coffee.png",
      roast: "Medium-Light Roast",
      country: "Kenya",
    },
    {
      id: 6,
      name: "Sapphire Peak",
      price: 34.99,
      image: "/mockup-coffee.png",
      roast: "Medium Roast",
      country: "Jamaica",
    },
  ];

  const nextProduct = () => {
    setCurrentIndex((prev) => (prev + 1) % featuredProducts.length);
  };

  const prevProduct = () => {
    setCurrentIndex(
      (prev) => (prev - 1 + featuredProducts.length) % featuredProducts.length
    );
  };

  return (
    <div className="min-h-screen bg-mist text-onyx">
      {/* hero */}
      <section className="relative overflow-hidden">
        {/* background with parallax */}
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
        <div className="relative z-10 h-full flex items-center justify-center py-50">
          <div className="text-center space-y-8 px-6">
            {/* logo */}
            <div>
              <Image
                src="/logo.png"
                alt="Logo"
                width={150}
                height={150}
                className="mx-auto"
              />
            </div>

            <h1 className="uppercase text-white font-primary -mt-8 text-3xl md:text-5xl lg:text-6xl">
              Crafting Coffee Excellence
              <br className="block" />
              One Bean at a Time
            </h1>
            <p className="lg:text-lg text-white/70 max-w-lg mx-auto">
              Discover the perfect cup with our carefully sourced, expertly
              roasted coffee beans from around the world.
            </p>
            <div className="uppercase text-sm font-primary w-fit mx-auto">
              <Link
                href="/collection"
                className="text-white px-8 py-3 border-1 flex items-center hover:bg-white hover:text-black transition-colors"
              >
                Shop Now
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* bestsellers list */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto">
          <div className="lg:grid lg:grid-cols-12 lg:gap-8 lg:items-start">
            {/* header */}
            <div className="my-auto lg:col-span-4">
              <div className="text-center lg:text-left px-6 lg:px-0 space-y-8">
                <h2 className="uppercase font-primary font-bold tracking-wider text-3xl md:text-4xl">
                  Bestsellers
                </h2>
                <p className="text-onyx/80">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                </p>
                <div className="uppercase text-sm font-primary flex mx-auto lg:mx-0 w-fit">
                  <Link
                    href="/collection"
                    className="text-onyx px-8 py-3 border-1 flex items-center hover:bg-onyx hover:text-white transition-colors"
                  >
                    View More
                  </Link>
                </div>
              </div>
            </div>

            {/* products list */}
            <div className="lg:col-span-8 relative">
              <div className="flex items-center">
                {/* left arrow */}
                <button
                  onClick={prevProduct}
                  disabled={currentIndex === 0}
                  className={`bg-gray/20 p-2 transition-colors rounded-r-full lg:rounded-full ${
                    currentIndex === 0
                      ? "cursor-not-allowed"
                      : "hover:bg-serene"
                  }`}
                >
                  <ChevronLeft
                    className={`h-5 w-5 ${
                      currentIndex === 0 ? "text-gray/50" : "text-onyx"
                    }`}
                  />
                </button>

                {/* product content */}
                <div className="flex-1 mt-8 md:mt-0">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 md:place-items-baseline">
                    {featuredProducts.map((product, index) => {
                      // Mobile
                      const showMobile =
                        (index >= currentIndex && index < currentIndex + 2) ||
                        (currentIndex + 2 > featuredProducts.length &&
                          index < (currentIndex + 2) % featuredProducts.length);

                      // Desktop
                      const showDesktop =
                        (index >= currentIndex && index < currentIndex + 3) ||
                        (currentIndex + 3 > featuredProducts.length &&
                          index < (currentIndex + 3) % featuredProducts.length);

                      if (!showMobile && !showDesktop) return null;

                      return (
                        <div
                          key={product.id}
                          className={`text-center ${
                            showMobile ? "block" : "hidden"
                          } ${showDesktop ? "md:block" : "md:hidden"}`}
                        >
                          <div className="mb-3 md:mb-0">
                            <Image
                              src={product.image}
                              width={200}
                              height={150}
                              alt={product.name}
                              className="w-full h-full object-contain"
                            />
                          </div>
                          <div className="space-y-1">
                            <h2 className="font-semibold text-onyx text-base md:text-lg">
                              {product.name}
                            </h2>
                            <h3 className="font-light text-onyx text-sm  md:text-base">
                              {product.country}
                            </h3>
                            <p className="text-onyx/50 text-xs">
                              {product.roast}
                            </p>
                            <span className="text-base md:text-lg">
                              CHF{product.price}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* right arrow */}
                <button
                  onClick={nextProduct}
                  disabled={currentIndex >= featuredProducts.length - 1}
                  className={`bg-gray/20 p-2 transition-colors rounded-l-full lg:rounded-full ${
                    currentIndex >= featuredProducts.length - 1
                      ? "cursor-not-allowed"
                      : "hover:bg-serene"
                  }`}
                >
                  <ChevronRight
                    className={`h-5 w-5 ${
                      currentIndex >= featuredProducts.length - 1
                        ? "text-gray/50"
                        : "text-onyx"
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* about */}
      <section className="relative h-container overflow-hidden">
        {/* background with parallax */}
        <div
          className="absolute w-full bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage:
              "url('https://res.cloudinary.com/douen1dwv/image/upload/v1758990337/default/brew..jpg')",
            transform: `translateY(${scrollY * 0.3}px)`,
            top: "-100%",
            height: "200%",
          }}
        ></div>

        {/* overlay */}
        <div className="absolute inset-0 bg-black/40"></div>

        {/* content */}
        <div className="relative z-10 py-20 px-6 lg:px-12">
          <div className="max-w-7xl mx-auto space-y-8">
            <h2 className="uppercase text-white font-primary text-3xl md:text-4xl lg:text-5xl">
              Our Passion for
              <br className="block" />
              Perfect Coffee
            </h2>
            <p className="lg:text-lg text-white/70 max-w-lg text-justify">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat.
            </p>
            <div className="uppercase text-sm font-primary w-fit">
              <Link
                href="/about"
                className="text-white px-8 py-3 border-1 flex items-center hover:bg-white hover:text-black transition-colors"
              >
                Learn more about us
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

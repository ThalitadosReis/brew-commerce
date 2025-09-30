"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { allProducts } from "@/data/products";
import {
  ChevronLeft,
  ChevronRight,
  CircleStar,
  Coffee,
  Sprout,
  Users,
} from "lucide-react";
import Image from "next/image";

export default function Homepage() {
  const [scrollY, setScrollY] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // get first 6 products from allProducts
  const featuredProducts = useMemo(() => {
    return allProducts.slice(0, 6);
  }, []);

  const nextProduct = () => {
    setCurrentIndex((prev) => (prev + 1) % featuredProducts.length);
  };

  const prevProduct = () => {
    setCurrentIndex(
      (prev) => (prev - 1 + featuredProducts.length) % featuredProducts.length
    );
  };

  return (
    <div className="min-h-screen bg-white text-primary">
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
                className="text-white px-8 py-3 border border-white rounded-full flex items-center hover:bg-white hover:text-primary transition-colors"
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
                <p className="text-accent">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                </p>
                <div className="uppercase text-sm font-primary flex mx-auto lg:mx-0 w-fit">
                  <Link
                    href="/collection"
                    className="text-primary px-8 py-3 border border-primary rounded-full flex items-center hover:bg-primary hover:text-white transition-colors"
                  >
                    View More
                  </Link>
                </div>
              </div>
            </div>

            {/* products list */}
            <div className="lg:col-span-8 relative">
              <div className="flex items-center gap-2 md:gap-4">
                {/* left arrow */}
                <button
                  onClick={prevProduct}
                  disabled={currentIndex === 0}
                  className={`bg-neutral/30 p-2 transition-colors rounded-r-full lg:rounded-full ${
                    currentIndex === 0
                      ? "cursor-not-allowed"
                      : "hover:bg-neutral/50"
                  }`}
                >
                  <ChevronLeft
                    className={`h-5 w-5 ${
                      currentIndex === 0 ? "text-accent/50" : "text-primary"
                    }`}
                  />
                </button>

                {/* product content */}
                <div className="flex-1 mt-8 lg:mt-0">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                    {featuredProducts.map((product, index) => {
                      // mobile
                      const showMobile =
                        (index >= currentIndex && index < currentIndex + 1) ||
                        (currentIndex + 1 > featuredProducts.length &&
                          index < (currentIndex + 1) % featuredProducts.length);

                      // desktop
                      const showDesktop =
                        (index >= currentIndex && index < currentIndex + 3) ||
                        (currentIndex + 3 > featuredProducts.length &&
                          index < (currentIndex + 3) % featuredProducts.length);

                      if (!showMobile && !showDesktop) return null;

                      return (
                        <div
                          key={product.id}
                          className={`flex flex-col h-full ${
                            showMobile ? "block" : "hidden"
                          } ${showDesktop ? "md:block" : "md:hidden"}`}
                        >
                          <div className="relative aspect-square bg-neutral/50 rounded-3xl overflow-hidden">
                            <span className="absolute top-2 right-2 z-10 bg-white border border-neutral text-secondary font-medium text-xs px-3 py-1 rounded-full">
                              {product.country}
                            </span>
                            <Link href={`/collection/${product.id}`}>
                              <Image
                                src={product.image}
                                alt={product.name}
                                fill
                                className="object-contain hover:scale-105 transition-transform duration-300"
                              />
                            </Link>
                          </div>

                          <div className="flex-1 flex flex-col mt-4">
                            <h3 className="font-semibold text-primary lg:text-lg">
                              {product.name}
                            </h3>
                            <span className="text-sm text-accent">
                              {product.roast}
                            </span>
                            <span className="text-xl font-semibold text-primary mt-2">
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
                  className={`bg-neutral/30 p-2 transition-colors rounded-l-full lg:rounded-full ${
                    currentIndex >= featuredProducts.length - 1
                      ? "cursor-not-allowed"
                      : "hover:bg-neutral/50"
                  }`}
                >
                  <ChevronRight
                    className={`h-5 w-5 ${
                      currentIndex >= featuredProducts.length - 1
                        ? "text-accent/50"
                        : "text-primary"
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
          <div className="max-w-7xl mx-auto space-y-8 text-center">
            <h2 className="uppercase text-white font-primary text-3xl md:text-4xl lg:text-5xl">
              Our Passion for
              <br className="block" />
              Perfect Coffee
            </h2>
            <p className="lg:text-lg text-white/70 max-w-2xl mx-auto">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat.
            </p>
            <div className="uppercase text-sm font-primary w-fit mx-auto">
              <Link
                href="/about"
                className="text-white px-8 py-3 border border-white rounded-full flex items-center hover:bg-white hover:text-primary transition-colors"
              >
                Learn more about us
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* features */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2">
            {/* header */}
            <div className="text-center lg:text-left px-6 lg:px-0">
              <div className="space-y-6">
                <h2 className="max-w-sm mx-auto lg:mx-0 font-secondary text-3xl md:text-4xl leading-tight">
                  We care about the quality of our{" "}
                  <strong className="font-bold">products</strong>
                </h2>
                <p className="max-w-lg mx-auto lg:mx-0 text-accent text-base leading-relaxed">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                </p>
                <div className="pt-2">
                  <Link
                    href="/collection"
                    className="inline-flex items-center uppercase text-sm font-primary text-primary px-8 py-3 border border-primary rounded-full hover:bg-primary hover:text-white transition-colors duration-300 ease-in-out"
                  >
                    Explore our products
                  </Link>
                </div>
              </div>
            </div>
            {/* content */}
            <div className="grid md:grid-cols-2 gap-8 px-6 lg:px-0 mt-8 lg:mt-0">
              <div className="flex flex-col">
                <Coffee strokeWidth={1} className="w-10 h-10 mb-4 text-primary" />
                <h3 className="text-xl font-semibold mb-2 text-primary">Fresh Roasted</h3>
                <p className="text-sm text-accent">
                  Beans roasted to order ensuring maximum freshness and flavor
                  in every cup.
                </p>
              </div>
              <div className="flex flex-col">
                <CircleStar strokeWidth={1} className="w-10 h-10 mb-4 text-primary" />
                <h3 className="text-xl font-semibold mb-2 text-primary">Premium Quality</h3>
                <p className="text-sm text-accent">
                  Sourced from the finest coffee regions with direct
                  relationships with farmers.
                </p>
              </div>
              <div className="flex flex-col">
                <Users strokeWidth={1} className="w-10 h-10 mb-4 text-primary" />
                <h3 className="text-xl font-semibold mb-2 text-primary">
                  Community Focused
                </h3>
                <p className="text-sm text-accent">
                  Supporting local communities and sustainable farming practices
                  worldwide.
                </p>
              </div>
              <div className="flex flex-col">
                <Sprout strokeWidth={1} className="w-10 h-10 mb-4 text-primary" />
                <h3 className="text-xl font-semibold mb-2 text-primary">
                  Sustainable Practices
                </h3>
                <p className="text-sm text-accent">
                  Environmentally conscious methods that protect our planet for
                  future generations.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* contact */}
      <section
        className="relative h-container bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "url('https://images.pexels.com/photos/894695/pexels-photo-894695.jpeg?_gl=1*4zlw1m*_ga*MTE1NTcwMTQwLjE3NTU4ODU3NjQ.*_ga_8JE65Q40S6*czE3NTkwNTIwODYkbzIxJGcxJHQxNzU5MDUyMTAzJGo0MyRsMCRoMA..')",
        }}
      >
        {/* overlay */}
        <div className="absolute inset-0 bg-black/60"></div>

        {/* contact */}
        <div className="relative z-10 py-20 px-6 lg:px-12">
          <div className="max-w-7xl mx-auto space-y-8 text-center">
            <h2 className="uppercase text-white font-primary text-3xl md:text-4xl lg:text-5xl">
              Stay connected
            </h2>
            <p className="lg:text-lg text-white/70 max-w-xl mx-auto">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>
            <div className="text-sm w-fit mx-auto">
              <div className="relative flex items-center bg-white/20 border border-white/30 rounded-full p-1 overflow-hidden">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="flex-1 px-8 py-3 bg-transparent text-white placeholder-white/50 focus:outline-none"
                />
                <button className="uppercase text-sm font-primary bg-white text-primary px-8 py-3 rounded-full hover:bg-primary hover:text-white transition-colors">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

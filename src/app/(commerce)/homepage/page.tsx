"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

import { Product } from "@/types/product";
import { useWishlist } from "@/contexts/WishlistContext";
import SubscribeSection from "@/components/SubscribeSection";
import ImageCard from "@/components/ImageCard";

import {
  CoffeeIcon,
  PlantIcon,
  QuotesIcon,
  SealCheckIcon,
  UsersThreeIcon,
} from "@phosphor-icons/react";

export default function Homepage() {
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const [scrollY, setScrollY] = useState(0);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // parallax scroll effect
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/products");
        if (response.ok) {
          const data = await response.json();
          setProducts(data);
        }
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen bg-secondary/10">
      {/* hero */}
      <section className="relative overflow-hidden h-[44rem] lg:h-[52rem]">
        <div
          className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage:
              "url('https://i.pinimg.com/736x/fb/a6/ad/fba6adc34711997b82a6c670befd6a14.jpg')",
            transform: `translateY(${scrollY * 0.5}px)`,
          }}
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="max-w-7xl absolute bottom-0 left-0 z-10 p-10 lg:p-20">
          <h1 className="font-display italic text-white text-6xl lg:text-8xl mb-4">
            <span className="block">Coffee</span>
            <span className="block opacity-70">Excellence</span>
          </h1>
          <p className="max-w-md font-body text-white/70 mb-4">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </p>
          <Link
            href="/collection"
            className="inline-block text-sm font-body text-white relative group"
          >
            Shop Now
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-white" />
            <span className="absolute bottom-0 right-0 w-0 h-0.5 bg-primary transition-all duration-300 ease-out group-hover:w-1/2" />
          </Link>
        </div>
      </section>

      {/* features */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex flex-col items-center space-y-2 bg-white rounded-xl p-6">
              <CoffeeIcon size={32} weight="light" />
              <h3 className="font-display font-normal text-xl">
                Fresh Roasted
              </h3>
              <p className="text-sm font-body text-center text-secondary/70">
                Beans roasted to order ensuring maximum freshness and flavor in
                every cup.
              </p>
            </div>

            <div className="flex flex-col items-center space-y-2 bg-white rounded-xl p-6">
              <SealCheckIcon size={32} weight="light" />
              <h3 className="font-display font-normal text-xl">
                Premium Quality
              </h3>
              <p className="text-sm font-body text-center text-secondary/70">
                Sourced from the finest coffee regions with direct relationships
                with farmers.
              </p>
            </div>

            <div className="flex flex-col items-center space-y-2 bg-white rounded-xl p-6">
              <UsersThreeIcon size={32} weight="light" />
              <h3 className="font-display font-normal text-xl">
                Community Focused
              </h3>
              <p className="text-sm font-body text-center text-secondary/70">
                Supporting local communities and sustainable farming practices
                worldwide.
              </p>
            </div>

            <div className="flex flex-col items-center space-y-2 bg-white rounded-xl p-6">
              <PlantIcon size={32} weight="light" />
              <h3 className="font-display font-normal text-xl">
                Sustainable Practices
              </h3>
              <p className="text-sm font-body text-center text-secondary/70">
                Environmentally conscious methods that protect our planet for
                future generations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* product showcase */}
      <section className="pb-20">
        <div className="max-w-7xl mx-auto px-8">
          <div className="space-y-20 text-center">
            <div className="max-w-3xl lg:max-w-4xl mx-auto">
              <h2 className="mx-auto font-display italic font-extralight text-3xl md:text-4xl lg:text-5xl">
                Explore our freshly roasted beans and find your perfect cup.
              </h2>
            </div>

            <div className="relative space-y-8">
              <div className="flex-1">
                {loading ? (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className={`flex flex-col h-full bg-secondary/10 rounded-2xl animate-pulse ${
                          i === 3 ? "hidden lg:flex" : "flex"
                        }`}
                      >
                        <div className="aspect-square bg-secondary/20 rounded-t-2xl" />
                        <div className="p-6 space-y-2">
                          <div className="h-6 bg-secondary/20 rounded w-3/4 mx-auto" />
                          <div className="h-4 bg-secondary/20 rounded w-1/2 mx-auto" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {products.slice(0, 3).map((product, index) => (
                      <ImageCard
                        key={product._id}
                        id={product._id}
                        name={product.name}
                        images={
                          product.images && product.images.length > 0
                            ? [product.image, ...product.images]
                            : [product.image, product.image]
                        }
                        price={product.price}
                        country={product.country}
                        isInWishlist={isInWishlist(product._id)}
                        onToggleWishlist={() =>
                          isInWishlist(product._id)
                            ? removeFromWishlist(product._id)
                            : addToWishlist({
                                id: product._id,
                                name: product.name,
                                description: product.description,
                                images:
                                  product.images && product.images.length > 0
                                    ? [product.image, ...product.images]
                                    : [product.image, product.image],
                                price: product.price,
                                country: product.country,
                                roast: product.category,
                                sizes: product.sizes.map((s) => s.size),
                              })
                        }
                        className={index === 2 ? "hidden lg:flex" : "flex"}
                      />
                    ))}
                  </div>
                )}
              </div>

              <Link
                href="/collection"
                className="inline-block text-sm font-body relative group"
              >
                Shop Coffees
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-secondary" />
                <span className="absolute bottom-0 right-0 w-0 h-0.5 bg-neutral transition-all duration-300 ease-out group-hover:w-1/2" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* about */}
      <section className="px-8">
        <div className="relative max-w-7xl mx-auto h-container overflow-hidden rounded-xl">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage:
                "url('https://res.cloudinary.com/douen1dwv/image/upload/v1758990337/default/brew..jpg')",
            }}
          />
          <div className="absolute inset-0 bg-black/40" />
          <div className="relative z-10 py-10">
            <div className="flex flex-col p-8">
              <div className="max-w-xl space-y-4">
                <h2 className="font-display text-white text-3xl md:text-5xl lg:text-6xl">
                  Our Passion for
                  <br className="block" />
                  Perfect Coffee
                </h2>
                <p className="max-w-md font-body text-white/70 mb-4">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                </p>
              </div>

              <Link
                href="/about"
                className="w-fit inline-block text-sm font-body text-white relative group"
              >
                Learn More
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-white" />
                <span className="absolute bottom-0 right-0 w-0 h-0.5 bg-primary transition-all duration-300 ease-out group-hover:w-1/2" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* features */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-8">
          <div className="grid space-y-12">
            {/* header */}
            <div className="max-w-xl mx-auto text-center space-y-8">
              <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl mb-4">
                <span className="font-extralight">We care about the</span>
                <span className="block font-semibold">
                  quality of our products
                </span>
              </h2>
              <p className="font-body text-secondary/70">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </p>
            </div>

            {/* content */}
            <div className="grid gap-4 lg:grid-cols-2">
              <div className="relative rounded-2xl overflow-hidden lg:row-span-2 h-[450px]">
                <Image
                  src="https://images.pexels.com/photos/4820812/pexels-photo-4820812.jpeg"
                  alt="Fresh Roasted Coffee"
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover"
                />

                <div className="absolute inset-0 bg-black/40"></div>

                <div className="absolute bottom-6 left-6 right-6 md:-auto md:max-w-sm bg-white rounded-xl space-y-2 p-6">
                  <CoffeeIcon size={32} weight="light" />
                  <h3 className="font-display font-normal text-xl">
                    Freshly Roasted
                  </h3>
                  <p className="text-sm font-body leading-relaxed text-secondary/70">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                    do eiusmod tempor incididunt ut labore et dolore magna
                    aliqua.
                  </p>
                </div>
              </div>

              <div className="grid bg-white rounded-2xl">
                <div className="flex flex-col justify-center space-y-2 p-6">
                  <PlantIcon size={32} weight="light" className="text-accent" />
                  <h3 className="font-display font-normal text-xl md:text-2xl ">
                    Sustainable Practices
                  </h3>
                  <p className="text-sm font-body leading-relaxed text-secondary/70">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                    do eiusmod tempor.
                  </p>
                </div>
              </div>

              <div className="grid bg-accent rounded-2xl">
                <div className="flex flex-col justify-center space-y-2 p-6">
                  <SealCheckIcon
                    size={32}
                    weight="light"
                    className="text-white"
                  />
                  <h3 className="font-display font-normal text-xl md:text-2xl text-white">
                    Premium Quality
                  </h3>
                  <p className="text-sm font-body leading-relaxed text-white/70">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                    do eiusmod tempor incididunt ut labore et dolore magna
                    aliqua.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* testimonials */}
      <section className="pb-20">
        <div className="max-w-7xl mx-auto px-8 text-center space-y-12">
          <div className="max-w-xl mx-auto space-y-2">
            <h2 className="font-display italic text-3xl md:text-4xl lg:text-5xl">
              <span className="font-extralight">What our customers say</span>
            </h2>
            <p className="font-body text-secondary/70">
              Real stories from people who start their mornings with our coffee.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-4">
            {[
              {
                name: "Samantha Lee",
                quote:
                  "Absolutely the best beans I’ve ever tasted. Every cup feels like a fresh start to my day.",
                image: "https://randomuser.me/api/portraits/women/68.jpg",
              },
              {
                name: "Jordan Smith",
                quote:
                  "Their roast is perfectly balanced—rich aroma and smooth taste every time.",
                image: "https://randomuser.me/api/portraits/men/75.jpg",
              },
              {
                name: "Emily Carter",
                quote:
                  "Love their commitment to sustainability and community. Plus, it tastes amazing!",
                image: "https://randomuser.me/api/portraits/women/32.jpg",
              },
            ].map((t, i) => (
              <div key={i} className="bg-white rounded-xl p-6 space-y-2">
                <QuotesIcon
                  size={32}
                  weight="light"
                  className="text-accent mx-auto"
                />
                <p className="text-secondary/70 font-body italic">
                  “{t.quote}”
                </p>
                <div className="flex items-center justify-center space-x-3 pt-2">
                  <Image
                    src={t.image}
                    alt={t.name}
                    width={44}
                    height={44}
                    className="rounded-full object-cover"
                  />
                  <span className="font-display text-secondary font-medium">
                    {t.name}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* contact */}
      <SubscribeSection />
    </div>
  );
}

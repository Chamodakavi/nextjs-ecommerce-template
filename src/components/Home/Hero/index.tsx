"use client";

import React from "react";
import HeroCarousel from "./HeroCarousel";
import HeroFeature from "./HeroFeature";
import Image from "next/image";
import Link from "next/link";
import { useWebData } from "@/context/WebCarouselContext";

const Hero = () => {
  const { promos, slides } = useWebData();

  // Filter active items
  const activePromos = promos?.filter((promo) => promo.isActive) || [];
  const activeSlides = slides?.filter((slide) => slide.isActive) || [];

  const hasActivePromos = activePromos.length > 0;
  const hasActiveSlides = activeSlides.length > 0;

  // If neither carousel nor promo cards exist, hide the section entirely
  if (!hasActiveSlides && !hasActivePromos) {
    return null;
  }

  return (
    <section className="overflow-hidden pb-10 lg:pb-12.5 xl:pb-15 pt-16 sm:pt-20 lg:pt-45 bg-[#E5EAF4]">
      <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
        <div className="flex flex-wrap gap-5">
          {/* Main Carousel Wrapper - Expands to full width when no active promos exist */}
          {hasActiveSlides && (
            <div
              className={`w-full transition-all duration-300 ${
                hasActivePromos ? "xl:max-w-[757px]" : "xl:max-w-full"
              }`}
            >
              <div className="relative z-1 rounded-[10px] bg-white overflow-hidden h-full">
                {/* Responsive Background Graphic */}
                <div className="absolute right-0 bottom-0 pointer-events-none -z-0 opacity-80 sm:opacity-100">
                  <Image
                    src="/images/hero/hero-bg.png"
                    alt="hero bg shapes"
                    width={700}
                    height={650}
                    className="object-contain object-bottom-right"
                  />
                </div>

                <HeroCarousel />
              </div>
            </div>
          )}

          {/* Right Promo Cards - Only renders if active promos exist */}
          {hasActivePromos && (
            <div
              className={`w-full ${
                hasActiveSlides ? "xl:max-w-[393px]" : "xl:max-w-full"
              }`}
            >
              <div className="flex flex-col sm:flex-row xl:flex-col gap-5">
                {activePromos.map((promo, index) => (
                  <div
                    className="w-full relative rounded-[10px] bg-white p-4 sm:p-7.5"
                    key={promo.id || index}
                  >
                    <div className="flex items-center justify-between gap-6">
                      <div>
                        <h2 className="max-w-[153px] font-semibold text-dark text-xl mb-4 sm:mb-8">
                          <Link href={promo.link || "#"}>{promo.title}</Link>
                        </h2>

                        <div>
                          <p className="font-medium text-dark-4 text-custom-sm mb-1.5">
                            {promo.badgeText || "limited time offer"}
                          </p>
                          <span className="flex items-center gap-3">
                            <span className="font-medium text-heading-5 text-red">
                              Rs{promo.salePrice}
                            </span>
                            {promo.regularPrice > 0 && (
                              <span className="font-medium text-2xl text-dark-4 line-through">
                                Rs{promo.regularPrice}
                              </span>
                            )}
                          </span>
                        </div>
                      </div>

                      {promo.imageUrl && (
                        <div className="relative w-[123px] h-[161px] flex-shrink-0">
                          <Image
                            src={promo.imageUrl}
                            alt={promo.title || "promo image"}
                            fill
                            className="object-contain"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Hero features */}
      <HeroFeature />
    </section>
  );
};

export default Hero;

"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePromoSecData } from "@/context/WebPromoSecContext";
import type { PromoSecCard, BigBanner } from "@/types/webData";

const PromoBanner = () => {
  const promoData = usePromoSecData();
  const rawData = promoData as any;

  // 1. Extract and validate big banner
  const bigBanner: BigBanner | undefined = rawData?.bigBanner;
  const isBigActive = Boolean(bigBanner?.isActive && bigBanner?.title);

  // 2. Extract and validate small banners
  const smallBanners: PromoSecCard[] = Array.isArray(rawData)
    ? rawData
    : Array.isArray(rawData?.smallBanners)
      ? rawData.smallBanners
      : Array.isArray(rawData?.promos)
        ? rawData.promos
        : [];

  const activeSmallBanners = smallBanners.filter(
    (banner) => banner?.isActive && banner?.title,
  );

  // If neither big banner nor small banners are active, hide the section
  if (!isBigActive && activeSmallBanners.length === 0) {
    return null;
  }

  return (
    <section className="overflow-hidden py-20">
      <div className="mx-auto w-full max-w-[1170px] px-4 sm:px-8 xl:px-0">
        {/* ================= Big Promo Banner ================= */}
        {isBigActive && bigBanner && (
          <div className="relative isolate mb-7.5 overflow-hidden rounded-lg bg-[#F5F5F7] px-4 py-12.5 sm:px-7.5 lg:px-14 lg:py-17.5 xl:px-19 xl:py-22.5">
            <div className="w-full max-w-[550px]">
              {bigBanner.subtitle && (
                <span className="mb-3 block text-xl font-medium text-dark">
                  {bigBanner.subtitle}
                </span>
              )}

              <h2 className="mb-5 text-xl font-bold text-dark lg:text-heading-4 xl:text-heading-3">
                {bigBanner.title}
              </h2>

              {bigBanner.description && (
                <p className="hidden text-body-color md:block">
                  {bigBanner.description}
                </p>
              )}

              <Link
                href={bigBanner.link || "#"}
                className="mt-7.5 inline-flex rounded-md bg-blue px-9.5 py-[11px] text-custom-sm font-medium text-white duration-200 ease-out hover:bg-blue-dark"
              >
                {bigBanner.buttonText || "Buy Now"}
              </Link>
            </div>

            {bigBanner.imageUrl && (
              <div className="absolute bottom-0 right-4 -z-10 h-[300px] w-[240px] sm:h-[350px] sm:w-[274px] lg:right-26">
                <Image
                  src={bigBanner.imageUrl}
                  alt={bigBanner.title || "Promotional banner"}
                  fill
                  sizes="(max-width: 640px) 240px, 274px"
                  className="object-contain object-bottom"
                />
              </div>
            )}
          </div>
        )}

        {/* ================= Small Promo Banners Grid ================= */}
        {activeSmallBanners.length > 0 && (
          <div
            className={`grid grid-cols-1 gap-7.5 ${
              activeSmallBanners.length > 1 ? "lg:grid-cols-2" : ""
            }`}
          >
            {activeSmallBanners.map((banner, index) => {
              const isEven = index % 2 === 0;

              return (
                <div
                  key={banner.id ?? index}
                  className={`relative isolate overflow-hidden rounded-lg px-4 py-10 sm:px-7.5 xl:px-10 xl:py-16 ${
                    isEven ? "bg-[#DBF4F3]" : "bg-[#FFECE1]"
                  }`}
                >
                  {banner.imageUrl && (
                    <div
                      className={`absolute top-1/2 -z-10 h-[160px] w-[160px] -translate-y-1/2 sm:h-[220px] sm:w-[220px] ${
                        isEven ? "left-2 sm:left-6" : "right-2 sm:right-6"
                      }`}
                    >
                      <Image
                        src={banner.imageUrl}
                        alt={banner.title || "Promotional banner"}
                        fill
                        sizes="(max-width: 640px) 160px, 220px"
                        className="object-contain"
                      />
                    </div>
                  )}

                  <div className={isEven ? "text-right" : "text-left"}>
                    {banner.subtitle && (
                      <span className="mb-1.5 hidden text-lg text-dark md:block">
                        {banner.subtitle}
                      </span>
                    )}

                    <h2 className="mb-2.5 text-xl font-bold text-dark lg:text-heading-4">
                      {banner.title}
                    </h2>

                    {banner.highlightText && (
                      <p
                        className={`font-semibold text-custom-1 ${
                          isEven ? "text-teal" : "text-orange"
                        }`}
                      >
                        {banner.highlightText}
                      </p>
                    )}

                    <Link
                      href={banner.link || "#"}
                      className={`mt-7.5 inline-flex rounded-md px-8.5 py-2.5 text-custom-sm font-medium text-white duration-200 sm:mt-9 ${
                        isEven
                          ? "bg-teal hover:bg-teal-dark"
                          : "bg-orange hover:bg-orange-dark"
                      }`}
                    >
                      {banner.buttonText || "Shop Now"}
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default PromoBanner;

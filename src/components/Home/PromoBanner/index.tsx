"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePromoSecData } from "@/context/WebPromoSecContext";

const PromoBanner = () => {
  const promoData = usePromoSecData();

  const bigBanner = promoData?.bigBanner;
  const isBigActive = bigBanner?.isActive && !!bigBanner.title;

  const activeSmallBanners =
    promoData?.smallBanners?.filter((banner) => banner.isActive) || [];

  // If nothing is active, hide the entire section
  if (!isBigActive && activeSmallBanners.length === 0) {
    return null;
  }

  return (
    <section className="overflow-hidden py-20">
      <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
        {/* <!-- Promo Banner Big --> */}
        {isBigActive && bigBanner && (
          <div className="relative z-1 overflow-hidden rounded-lg bg-[#F5F5F7] py-12.5 lg:py-17.5 xl:py-22.5 px-4 sm:px-7.5 lg:px-14 xl:px-19 mb-7.5">
            <div className="max-w-[550px] w-full">
              {bigBanner.subtitle && (
                <span className="block font-medium text-xl text-dark mb-3">
                  {bigBanner.subtitle}
                </span>
              )}

              <h2 className="font-bold text-xl lg:text-heading-4 xl:text-heading-3 text-dark mb-5">
                {bigBanner.title}
              </h2>

              {bigBanner.description && (
                <p className="hidden md:block text-body-color">
                  {bigBanner.description}
                </p>
              )}

              <Link
                href={bigBanner.link || "#"}
                className="inline-flex font-medium text-custom-sm text-white bg-blue py-[11px] px-9.5 rounded-md ease-out duration-200 hover:bg-blue-dark mt-7.5"
              >
                {bigBanner.buttonText || "Buy Now"}
              </Link>
            </div>

            {bigBanner.imageUrl && (
              <div className="absolute bottom-0 right-4 lg:right-26 -z-1 w-[274px] h-[350px]">
                <Image
                  src={bigBanner.imageUrl}
                  alt={bigBanner.title || "promo image"}
                  fill
                  className="object-contain object-bottom"
                />
              </div>
            )}
          </div>
        )}

        {/* <!-- Small Promo Banners Grid --> */}
        {activeSmallBanners.length > 0 && (
          <div
            className={`grid gap-7.5 grid-cols-1 ${
              activeSmallBanners.length > 1
                ? "lg:grid-cols-2"
                : "lg:grid-cols-1"
            }`}
          >
            {activeSmallBanners.map((banner, index) => {
              const isEven = index % 2 === 0;

              return (
                <div
                  key={banner.id || index}
                  className={`relative z-1 overflow-hidden rounded-lg py-10 xl:py-16 px-4 sm:px-7.5 xl:px-10 ${
                    isEven ? "bg-[#DBF4F3]" : "bg-[#FFECE1]"
                  }`}
                >
                  {banner.imageUrl && (
                    <div
                      className={`absolute top-1/2 -translate-y-1/2 -z-1 w-[200px] h-[200px] sm:w-[240px] sm:h-[240px] ${
                        isEven ? "left-3 sm:left-10" : "right-3 sm:right-8.5"
                      }`}
                    >
                      <Image
                        src={banner.imageUrl}
                        alt={banner.title || "promo image"}
                        fill
                        className="object-contain"
                      />
                    </div>
                  )}

                  <div className={isEven ? "text-right" : "text-left"}>
                    {banner.subtitle && (
                      <span className="block text-lg text-dark mb-1.5 hidden md:block">
                        {banner.subtitle}
                      </span>
                    )}

                    <h2 className="font-bold text-xl lg:text-heading-4 text-dark mb-2.5">
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
                      className={`inline-flex font-medium text-custom-sm text-white py-2.5 px-8.5 rounded-md ease-out duration-200 mt-7.5 sm:mt-9 ${
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

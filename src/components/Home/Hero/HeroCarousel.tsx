"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";

// Import Swiper styles
import "swiper/css/pagination";
import "swiper/css";

import Image from "next/image";
import Link from "next/link";
import { useWebData } from "@/context/WebCarouselContext";

const HeroCarousal = () => {
  const { slides } = useWebData();

  // Filter out any slides where isActive is false
  const activeSlides = slides?.filter((slide) => slide.isActive);

  if (!activeSlides || activeSlides.length === 0) {
    return null;
  }

  return (
    <Swiper
      spaceBetween={30}
      centeredSlides={true}
      autoplay={{
        delay: 3500,
        disableOnInteraction: false,
      }}
      pagination={{
        clickable: true,
      }}
      modules={[Autoplay, Pagination]}
      className="hero-carousel w-full h-full"
    >
      {activeSlides.map((slide, index) => (
        <SwiperSlide key={slide.id || index}>
          <div className="flex items-center justify-between min-h-[380px] sm:min-h-[460px] pt-6 sm:pt-0 flex-col-reverse sm:flex-row px-6 sm:px-10 lg:px-16 gap-8">
            {/* Left Content Column */}
            <div className="w-full sm:max-w-[500px] py-6 sm:py-10 z-10">
              <div className="flex items-center gap-4 mb-5 sm:mb-8">
                <span className="block font-bold text-heading-3 sm:text-heading-1 text-blue">
                  {slide.discountText}
                </span>
                <span className="block text-dark font-medium text-sm sm:text-base leading-tight">
                  Sale
                  <br />
                  Off
                </span>
              </div>

              <h1 className="font-bold text-dark text-2xl sm:text-4xl lg:text-5xl mb-4 leading-tight">
                <Link href={slide.link || "#"}>{slide.title}</Link>
              </h1>

              <p className="text-body-color text-sm sm:text-base mb-8 max-w-[460px] line-clamp-3">
                {slide.description}
              </p>

              <Link
                href={slide.link || "#"}
                className="inline-flex items-center justify-center font-medium text-white text-sm sm:text-base rounded-md bg-dark py-3.5 px-8 transition-colors duration-200 hover:bg-blue shadow-md"
              >
                {slide.buttonText || "Shop Now"}
              </Link>
            </div>

            {/* Right Image Column */}
            {slide.imageUrl && (
              <div className="relative w-full sm:w-[48%] h-[240px] sm:h-[340px] lg:h-[400px] flex items-center justify-center z-10">
                <Image
                  src={slide.imageUrl}
                  alt={slide.title || "Hero banner"}
                  fill
                  priority={index === 0}
                  className="object-contain"
                />
              </div>
            )}
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default HeroCarousal;

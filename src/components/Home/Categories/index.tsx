"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { useCallback, useRef, useEffect } from "react";
import Link from "next/link";
import { Tag, ChevronLeft, ChevronRight } from "lucide-react";
import { useCatData } from "@/context/WebCatProvider";

// Import Swiper styles
import "swiper/css/navigation";
import "swiper/css";

const Categories = () => {
  const categories = useCatData();
  const sliderRef = useRef<any>(null);

  const handlePrev = useCallback(() => {
    if (!sliderRef.current) return;
    sliderRef.current.swiper.slidePrev();
  }, []);

  const handleNext = useCallback(() => {
    if (!sliderRef.current) return;
    sliderRef.current.swiper.slideNext();
  }, []);

  useEffect(() => {
    if (sliderRef.current && sliderRef.current.swiper) {
      sliderRef.current.swiper.init();
    }
  }, []);

  if (!categories || categories.length === 0) {
    return null;
  }

  return (
    <section className="overflow-hidden pt-17.5">
      <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0 pb-15 border-b border-gray-3">
        <div className="swiper categories-carousel common-carousel">
          {/* Section title */}
          <div className="mb-10 flex items-center justify-between">
            <div>
              <span className="flex items-center gap-2.5 font-medium text-dark mb-1.5">
                <Tag className="w-5 h-5 text-blue" strokeWidth={1.5} />
                Categories
              </span>
              <h2 className="font-semibold text-xl xl:text-heading-5 text-dark">
                Browse by Category
              </h2>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handlePrev}
                className="swiper-button-prev flex items-center justify-center w-10 h-10 rounded-full border border-gray-3 hover:bg-gray-1 hover:text-blue transition duration-200"
                aria-label="Previous categories"
              >
                <ChevronLeft className="w-5 h-5 text-current" />
              </button>

              <button
                type="button"
                onClick={handleNext}
                className="swiper-button-next flex items-center justify-center w-10 h-10 rounded-full border border-gray-3 hover:bg-gray-1 hover:text-blue transition duration-200"
                aria-label="Next categories"
              >
                <ChevronRight className="w-5 h-5 text-current" />
              </button>
            </div>
          </div>

          <Swiper
            ref={sliderRef}
            spaceBetween={16}
            slidesPerView={6}
            breakpoints={{
              0: {
                slidesPerView: 2,
                spaceBetween: 12,
              },
              640: {
                slidesPerView: 3,
                spaceBetween: 14,
              },
              1000: {
                slidesPerView: 4,
                spaceBetween: 16,
              },
              1200: {
                slidesPerView: 6,
                spaceBetween: 16,
              },
            }}
          >
            {categories.map((cat) => (
              <SwiperSlide key={cat.id}>
                <Link
                  href={`/shop?category=${encodeURIComponent(cat.name)}`}
                  className="group flex items-center justify-center h-20 px-4 rounded-xl border border-gray-3 hover:border-blue hover:text-blue transition-all duration-200 text-center"
                >
                  <span className="text-sm font-medium text-dark group-hover:text-blue transition-colors line-clamp-1">
                    {cat.name}
                  </span>
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
};

export default Categories;

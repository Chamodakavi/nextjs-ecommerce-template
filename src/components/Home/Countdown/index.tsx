"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCountdownData } from "@/context/WebCountdownContext";

const CounDown = () => {
  const countdown = useCountdownData();

  const [days, setDays] = useState(0);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);

    if (!countdown?.deadline) return;

    const getTime = () => {
      const deadlineTime = new Date(countdown.deadline).getTime();
      const time = deadlineTime - Date.now();

      if (time > 0) {
        setDays(Math.floor(time / (1000 * 60 * 60 * 24)));
        setHours(Math.floor((time / (1000 * 60 * 60)) % 24));
        setMinutes(Math.floor((time / 1000 / 60) % 60));
        setSeconds(Math.floor((time / 1000) % 60));
      } else {
        setDays(0);
        setHours(0);
        setMinutes(0);
        setSeconds(0);
      }
    };

    // Calculate immediately on mount
    getTime();

    const interval = setInterval(getTime, 1000);
    return () => clearInterval(interval);
  }, [countdown?.deadline]);

  // Don't render if inactive or data is missing
  if (!countdown || !countdown.isActive) {
    return null;
  }

  const formatUnit = (value: number) => (value < 10 ? `0${value}` : `${value}`);

  return (
    <section className="overflow-hidden py-20">
      <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
        <div className="relative overflow-hidden z-1 rounded-lg bg-[#D0E9F3] p-4 sm:p-7.5 lg:p-10 xl:p-15">
          <div className="max-w-[422px] w-full">
            {countdown.badgeText && (
              <span className="block font-medium text-custom-1 text-blue mb-2.5">
                {countdown.badgeText}
              </span>
            )}

            <h2 className="font-bold text-dark text-xl lg:text-heading-4 xl:text-heading-3 mb-3">
              {countdown.title}
            </h2>

            {countdown.description && (
              <p className="text-body-color text-sm sm:text-base mb-6">
                {countdown.description}
              </p>
            )}

            {/* Countdown timer */}
            {isMounted && (
              <div className="flex flex-wrap gap-4 sm:gap-6 mt-6">
                {/* Timer Day */}
                <div>
                  <span className="min-w-[64px] h-14.5 font-semibold text-xl lg:text-3xl text-dark rounded-lg flex items-center justify-center bg-white shadow-2 px-4 mb-2">
                    {formatUnit(days)}
                  </span>
                  <span className="block text-custom-sm text-dark text-center">
                    Days
                  </span>
                </div>

                {/* Timer Hours */}
                <div>
                  <span className="min-w-[64px] h-14.5 font-semibold text-xl lg:text-3xl text-dark rounded-lg flex items-center justify-center bg-white shadow-2 px-4 mb-2">
                    {formatUnit(hours)}
                  </span>
                  <span className="block text-custom-sm text-dark text-center">
                    Hours
                  </span>
                </div>

                {/* Timer Minutes */}
                <div>
                  <span className="min-w-[64px] h-14.5 font-semibold text-xl lg:text-3xl text-dark rounded-lg flex items-center justify-center bg-white shadow-2 px-4 mb-2">
                    {formatUnit(minutes)}
                  </span>
                  <span className="block text-custom-sm text-dark text-center">
                    Minutes
                  </span>
                </div>

                {/* Timer Seconds */}
                <div>
                  <span className="min-w-[64px] h-14.5 font-semibold text-xl lg:text-3xl text-dark rounded-lg flex items-center justify-center bg-white shadow-2 px-4 mb-2">
                    {formatUnit(seconds)}
                  </span>
                  <span className="block text-custom-sm text-dark text-center">
                    Seconds
                  </span>
                </div>
              </div>
            )}

            <Link
              href={countdown.link || "#"}
              className="inline-flex font-medium text-custom-sm text-white bg-blue py-3 px-9.5 rounded-md ease-out duration-200 hover:bg-blue-dark mt-7.5"
            >
              {countdown.buttonText || "Check it Out!"}
            </Link>
          </div>

          {/* Background shapes */}
          <Image
            src="/images/countdown/countdown-bg.png"
            alt="bg shapes"
            className="sm:block absolute right-0 bottom-0 -z-1"
            width={737}
            height={482}
          />

          {/* Dynamic product image */}
          {countdown.productImageUrl && (
            <div className="hidden lg:block absolute right-4 xl:right-33 bottom-4 xl:bottom-10 -z-1 w-[380px] h-[340px] xl:w-[411px] xl:h-[376px]">
              <Image
                src={countdown.productImageUrl}
                alt={countdown.title || "product"}
                fill
                className="object-contain"
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default CounDown;

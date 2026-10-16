"use client";

import React from "react";
import Link from "next/link";
import { Flame } from "lucide-react";
import SingleItem from "./SingleItem";
import { useNewArrivals } from "@/context/NewArrivalContext";

const BestSeller = () => {
  const products = useNewArrivals();

  // Safely extract a slice for the Best Sellers section
  const bestSellers = (products || []).slice(0, 6);

  if (bestSellers.length === 0) {
    return null;
  }

  return (
    <section className="overflow-hidden py-10">
      <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
        {/* Section Title */}
        <div className="mb-10 flex items-center justify-between">
          <div>
            <span className="flex items-center gap-2 font-medium text-blue mb-1.5 text-sm">
              <Flame className="w-4 h-4 text-blue" />
              This Month
            </span>
            <h2 className="font-semibold text-xl xl:text-heading-5 text-dark">
              Best Sellers
            </h2>
          </div>
        </div>

        {/* Best Sellers Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7.5">
          {bestSellers.map((item) => (
            <SingleItem item={item} key={item.id} />
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12.5">
          <Link
            href="/shop-without-sidebar"
            className="inline-flex font-medium text-custom-sm py-3 px-7 sm:px-12.5 rounded-md border-gray-3 border bg-gray-1 text-dark ease-out duration-200 hover:bg-dark hover:text-white hover:border-transparent transition"
          >
            View All
          </Link>
        </div>
      </div>
    </section>
  );
};

export default BestSeller;

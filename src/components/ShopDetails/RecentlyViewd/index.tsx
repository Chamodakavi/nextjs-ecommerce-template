"use client";

import React from "react";
import ProductItem from "@/components/Common/ProductItem";
import { useProducts } from "@/context/ProductContext";

const RecentlyViewed = () => {
  const products = useProducts();

  // Safely take up to 4 products to display in the recently viewed section
  const recentlyViewedProducts = (products || []).slice(0, 4);

  if (recentlyViewedProducts.length === 0) {
    return null;
  }

  return (
    <section className="overflow-hidden py-15">
      <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
        <div className="mb-10 flex items-center justify-between">
          <div>
            <h2 className="font-semibold text-xl xl:text-heading-5 text-dark">
              Recently Viewed Products
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-7.5">
          {recentlyViewedProducts.map((product) => (
            <ProductItem item={product} key={product.id} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default RecentlyViewed;

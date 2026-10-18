import React from "react";
import Link from "next/link";
import { Sparkles } from "lucide-react";
import ProductItem from "@/components/Common/ProductItem";
import { getNewArrivalProducts } from "@/lib/services/getProducts";

const NewArrival = async () => {
  const products = await getNewArrivalProducts(8);

  if (!products || products.length === 0) {
    return null;
  }

  return (
    <section className="overflow-hidden pt-15">
      <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
        {/* Section Title */}
        <div className="mb-7 flex items-center justify-between">
          <div>
            <span className="flex items-center gap-2 font-medium text-blue mb-1.5 text-sm">
              <Sparkles className="w-4 h-4 text-blue" />
              This Week’s
            </span>
            <h2 className="font-semibold text-xl xl:text-heading-5 text-dark">
              New Arrivals
            </h2>
          </div>

          <Link
            href="/shop-with-sidebar"
            className="inline-flex font-medium text-custom-sm py-2.5 px-7 rounded-md border-gray-3 border bg-gray-1 text-dark ease-out duration-200 hover:bg-dark hover:text-white hover:border-transparent transition"
          >
            View All
          </Link>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-7.5 gap-y-9">
          {products.map((item) => (
            <ProductItem item={item} key={item.id} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default NewArrival;

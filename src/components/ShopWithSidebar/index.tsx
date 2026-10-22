"use client";

import React, { useState, useEffect, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { SlidersHorizontal } from "lucide-react";

import Breadcrumb from "../Common/Breadcrumb";
import CustomSelect, { Option } from "./CustomSelect";
import CategoryDropdown from "./CategoryDropdown";
import PriceDropdown from "./PriceDropdown";
import SingleGridItem from "../Shop/SingleGridItem";
import SingleListItem from "../Shop/SingleListItem";
import { useProducts } from "@/context/ProductContext";

const ShopWithSidebarContent = () => {
  const products = useProducts();
  const searchParams = useSearchParams();

  // Read URL query parameters
  const urlCategory = searchParams.get("category");
  const urlSearch = searchParams.get("search");

  const [productStyle] = useState<"grid" | "list">("grid");
  const [productSidebar, setProductSidebar] = useState(false);

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortOption, setSortOption] = useState<string>("0");

  // Synchronize state whenever URL query parameters change
  useEffect(() => {
    if (urlCategory && urlCategory !== "all") {
      setSelectedCategory(urlCategory);
    } else {
      setSelectedCategory(null);
    }

    if (urlSearch) {
      setSearchQuery(urlSearch);
    } else {
      setSearchQuery("");
    }
  }, [urlCategory, urlSearch]);

  // Dynamic price boundaries
  const { minProductPrice, maxProductPrice } = useMemo(() => {
    if (!products || products.length === 0) {
      return {
        minProductPrice: 0,
        maxProductPrice: 100000,
      };
    }

    const prices = products.map((p) => Number(p.selling_price || 0));

    return {
      minProductPrice: Math.min(...prices),
      maxProductPrice: Math.max(...prices),
    };
  }, [products]);

  const [priceRange, setPriceRange] = useState<[number, number]>([
    minProductPrice,
    maxProductPrice,
  ]);

  // Update price range when products load or change
  useEffect(() => {
    setPriceRange([minProductPrice, maxProductPrice]);
  }, [minProductPrice, maxProductPrice]);

  // Categories with product counts
  const categoriesWithCounts = useMemo(() => {
    const counts: Record<string, number> = {};

    products.forEach((product) => {
      if (product.category) {
        counts[product.category] = (counts[product.category] || 0) + 1;
      }
    });

    return Object.entries(counts).map(([name, count]) => ({
      name,
      products: count,
    }));
  }, [products]);

  // Reset all active filters
  const handleResetFilters = () => {
    setSelectedCategory(null);
    setSearchQuery("");
    setPriceRange([minProductPrice, maxProductPrice]);
    setSortOption("0");
  };

  // Filter and sort products based on Category, Search Query, and Price Range
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Category Filter (matches Category Name or ID)
    if (selectedCategory) {
      result = result.filter(
        (product) =>
          product.category === selectedCategory ||
          String(product.category) === selectedCategory,
      );
    }

    // Search Query Filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter((product) =>
        product.name?.toLowerCase().includes(q),
      );
    }

    // Price Filter
    result = result.filter((product) => {
      const price = Number(product.selling_price || 0);
      return price >= priceRange[0] && price <= priceRange[1];
    });

    // Sorting Logic
    if (sortOption === "1") {
      result.sort(
        (a, b) => Number(a.selling_price || 0) - Number(b.selling_price || 0),
      );
    } else if (sortOption === "2") {
      result.sort(
        (a, b) => Number(b.selling_price || 0) - Number(a.selling_price || 0),
      );
    } else {
      result.sort(
        (a, b) =>
          new Date(b.created_at || 0).getTime() -
          new Date(a.created_at || 0).getTime(),
      );
    }

    return result;
  }, [products, selectedCategory, searchQuery, priceRange, sortOption]);

  const sortOptions: Option[] = [
    { label: "Latest Products", value: "0" },
    { label: "Price: Low to High", value: "1" },
    { label: "Price: High to Low", value: "2" },
  ];

  return (
    <>
      <Breadcrumb
        title="Explore All Products"
        pages={["shop", ""]}
        rightContent={
          <button
            id="sidebar-toggle"
            type="button"
            onClick={() => setProductSidebar((prev) => !prev)}
            aria-label="Toggle product filters"
            aria-expanded={productSidebar}
            className="inline-flex items-center gap-2 rounded-md border border-gray-3 bg-white px-3 py-2 text-sm font-medium text-dark shadow-1 transition hover:border-blue hover:text-blue"
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filter
          </button>
        }
      />

      <section className="relative overflow-hidden bg-[#f3f4f6] pb-20 pt-5 lg:pt-20 xl:pt-28">
        <div className="mx-auto w-full max-w-[1170px] px-4 sm:px-8 xl:px-0">
          <div className="flex gap-7.5">
            {/* Mobile Backdrop */}
            {productSidebar && (
              <button
                type="button"
                aria-label="Close filters"
                onClick={() => setProductSidebar(false)}
                className="fixed inset-0 z-[9998] bg-black/40 xl:hidden"
              />
            )}

            {/* Sidebar */}
            <aside
              id="product-sidebar"
              aria-label="Product filters"
              aria-hidden={!productSidebar}
              className={`sidebar-content fixed left-0 top-0 z-[9999] h-screen w-full max-w-[310px] overflow-y-auto bg-white p-5 transition-transform duration-200 xl:sticky xl:top-24 xl:z-auto xl:h-fit xl:max-h-[calc(100vh-6rem)] xl:w-[270px] xl:max-w-[270px] xl:translate-x-0 xl:overflow-y-auto xl:p-0 ${
                productSidebar
                  ? "translate-x-0"
                  : "-translate-x-full xl:translate-x-0"
              }`}
            >
              <form onSubmit={(event) => event.preventDefault()}>
                <div className="flex flex-col gap-6">
                  <div className="rounded-lg bg-white px-5 py-4 shadow-1">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-dark">Filters:</p>
                      {(selectedCategory || searchQuery) && (
                        <button
                          type="button"
                          onClick={handleResetFilters}
                          className="text-xs font-medium text-blue hover:underline"
                        >
                          Clear All
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Category Dropdown Filter */}
                  <CategoryDropdown
                    categories={categoriesWithCounts}
                    selectedCategory={selectedCategory}
                    onSelectCategory={setSelectedCategory}
                  />

                  {/* Price Range Filter */}
                  <PriceDropdown
                    minPrice={minProductPrice}
                    maxPrice={maxProductPrice}
                    currentPriceRange={priceRange}
                    onPriceChange={setPriceRange}
                  />

                  <button
                    type="button"
                    onClick={handleResetFilters}
                    className="text-sm text-blue hover:underline bg-gray-1 px-3 py-2 rounded-md shadow-1 xl:hidden"
                  >
                    Clean All
                  </button>
                </div>
              </form>
            </aside>

            {/* Main Products Area */}
            <div className="w-full xl:max-w-[870px]">
              <div className="mb-6 rounded-lg bg-white py-2.5 pl-3 pr-2.5 shadow-1">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-4">
                    <CustomSelect
                      options={sortOptions}
                      onChange={(option) => setSortOption(option.value)}
                    />

                    <p className="text-sm text-gray-600">
                      Showing{" "}
                      <span className="font-medium text-dark">
                        {filteredProducts.length} of {products.length}
                      </span>{" "}
                      Products
                    </p>
                  </div>
                </div>
              </div>

              {/* Product Grid or Empty State */}
              {filteredProducts.length === 0 ? (
                <div className="rounded-lg bg-white p-12 text-center shadow-1">
                  <p className="mb-2 text-gray-500">
                    No products match your selected filters.
                  </p>

                  <button
                    type="button"
                    onClick={handleResetFilters}
                    className="text-sm font-medium text-blue hover:underline"
                  >
                    Reset Filters
                  </button>
                </div>
              ) : (
                <div
                  className={
                    productStyle === "grid"
                      ? "grid grid-cols-3 gap-4 sm:grid-cols-2 md:gap-x-5 md:gap-y-9 lg:grid-cols-3"
                      : "flex flex-col gap-7.5"
                  }
                >
                  {filteredProducts.map((item) =>
                    productStyle === "grid" ? (
                      <SingleGridItem item={item} key={item.id} />
                    ) : (
                      <SingleListItem item={item} key={item.id} />
                    ),
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default function ShopWithSidebar() {
  return (
    <Suspense
      fallback={
        <div className="p-10 text-center">Loading shop products...</div>
      }
    >
      <ShopWithSidebarContent />
    </Suspense>
  );
}

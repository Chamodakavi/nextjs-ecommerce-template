"use client";
import React, { useState, useEffect, useMemo } from "react";
import {
  LayoutGrid,
  List,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Breadcrumb from "../Common/Breadcrumb";
import CustomSelect, { Option } from "./CustomSelect";
import CategoryDropdown from "./CategoryDropdown";
import PriceDropdown from "./PriceDropdown";
import SingleGridItem from "../Shop/SingleGridItem";
import SingleListItem from "../Shop/SingleListItem";
import { useProducts } from "@/context/ProductContext";

const ShopWithSidebar = () => {
  const products = useProducts();
  const [productStyle, setProductStyle] = useState<"grid" | "list">("grid");
  const [productSidebar, setProductSidebar] = useState(false);
  const [stickyMenu, setStickyMenu] = useState(false);

  // --- Filter & Sorting States ---
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sortOption, setSortOption] = useState<string>("0"); // "0": Latest, "1": Price Low-High, "2": Price High-Low

  // Dynamic Price Range Defaults
  const { minProductPrice, maxProductPrice } = useMemo(() => {
    if (!products || products.length === 0)
      return { minProductPrice: 0, maxProductPrice: 100000 };
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

  // Sync price range boundaries when data arrives
  useEffect(() => {
    setPriceRange([minProductPrice, maxProductPrice]);
  }, [minProductPrice, maxProductPrice]);

  // Dynamic Category List with Product Counts
  const categoriesWithCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    products.forEach((p) => {
      if (p.category) {
        counts[p.category] = (counts[p.category] || 0) + 1;
      }
    });
    return Object.entries(counts).map(([name, count]) => ({
      name,
      products: count,
    }));
  }, [products]);

  // Clean / Reset Filters
  const handleResetFilters = () => {
    setSelectedCategory(null);
    setPriceRange([minProductPrice, maxProductPrice]);
    setSortOption("0");
  };

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Filter by Category
    if (selectedCategory) {
      result = result.filter((p) => p.category === selectedCategory);
    }

    // Filter by Price
    result = result.filter((p) => {
      const price = Number(p.selling_price || 0);
      return price >= priceRange[0] && price <= priceRange[1];
    });

    // Sorting Logic
    if (sortOption === "1") {
      result.sort((a, b) => Number(a.selling_price) - Number(b.selling_price));
    } else if (sortOption === "2") {
      result.sort((a, b) => Number(b.selling_price) - Number(a.selling_price));
    } else {
      // Default: Latest
      result.sort(
        (a, b) =>
          new Date(b.created_at || 0).getTime() -
          new Date(a.created_at || 0).getTime(),
      );
    }

    return result;
  }, [products, selectedCategory, priceRange, sortOption]);

  const sortOptions: Option[] = [
    { label: "Latest Products", value: "0" },
    { label: "Price: Low to High", value: "1" },
    { label: "Price: High to Low", value: "2" },
  ];

  const handleStickyMenu = () => {
    if (window.scrollY >= 80) {
      setStickyMenu(true);
    } else {
      setStickyMenu(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleStickyMenu);

    function handleClickOutside(event: MouseEvent) {
      const target = event.target as HTMLElement;
      if (
        !target.closest(".sidebar-content") &&
        !target.closest("#sidebar-toggle")
      ) {
        setProductSidebar(false);
      }
    }

    if (productSidebar) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      window.removeEventListener("scroll", handleStickyMenu);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [productSidebar]);

  return (
    <>
      <Breadcrumb
        title="Explore All Products"
        pages={["shop", "/", "shop with sidebar"]}
      />
      <section className="overflow-hidden relative pb-20 pt-5 lg:pt-20 xl:pt-28 bg-[#f3f4f6]">
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
          <div className="flex gap-7.5">
            {/* Sidebar Start */}
            <div
              className={`sidebar-content fixed xl:z-1 z-9999 left-0 top-0 xl:translate-x-0 xl:static max-w-[310px] xl:max-w-[270px] w-full ease-out duration-200 ${
                productSidebar
                  ? "translate-x-0 bg-white p-5 h-screen overflow-y-auto"
                  : "-translate-x-full"
              }`}
            >
              <button
                id="sidebar-toggle"
                onClick={() => setProductSidebar(!productSidebar)}
                aria-label="button for product sidebar toggle"
                className={`xl:hidden absolute -right-12 sm:-right-8 flex items-center justify-center w-9 h-9 rounded-md bg-white shadow-1 text-dark ${
                  stickyMenu
                    ? "lg:top-20 sm:top-34.5 top-35"
                    : "lg:top-24 sm:top-39 top-37"
                }`}
              >
                <SlidersHorizontal className="w-5 h-5" />
              </button>

              <form onSubmit={(e) => e.preventDefault()}>
                <div className="flex flex-col gap-6">
                  {/* Clean All Header */}
                  <div className="bg-white shadow-1 rounded-lg py-4 px-5">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-dark">Filters:</p>
                      <button
                        type="button"
                        onClick={handleResetFilters}
                        className="text-blue text-sm hover:underline"
                      >
                        Clean All
                      </button>
                    </div>
                  </div>

                  {/* Category Filter */}
                  <CategoryDropdown
                    categories={categoriesWithCounts}
                    selectedCategory={selectedCategory}
                    onSelectCategory={setSelectedCategory}
                  />

                  {/* Price Filter */}
                  <PriceDropdown
                    minPrice={minProductPrice}
                    maxPrice={maxProductPrice}
                    currentPriceRange={priceRange}
                    onPriceChange={setPriceRange}
                  />
                </div>
              </form>
            </div>
            {/* Sidebar End */}

            {/* Content Start */}
            <div className="xl:max-w-[870px] w-full">
              <div className="rounded-lg bg-white shadow-1 pl-3 pr-2.5 py-2.5 mb-6">
                <div className="flex items-center justify-between">
                  <div className="flex flex-wrap items-center gap-4">
                    <CustomSelect
                      options={sortOptions}
                      onChange={(opt) => setSortOption(opt.value)}
                    />
                    <p className="text-sm text-gray-600">
                      Showing{" "}
                      <span className="text-dark font-medium">
                        {filteredProducts.length} of {products.length}
                      </span>{" "}
                      Products
                    </p>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <button
                      onClick={() => setProductStyle("grid")}
                      aria-label="button for product grid tab"
                      className={`${
                        productStyle === "grid"
                          ? "bg-blue border-blue text-white"
                          : "text-dark bg-gray-1 border-gray-3"
                      } flex items-center justify-center w-10.5 h-9 rounded-[5px] border ease-out duration-200 hover:bg-blue hover:border-blue hover:text-white`}
                    >
                      <LayoutGrid className="w-4 h-4 text-current" />
                    </button>

                    <button
                      onClick={() => setProductStyle("list")}
                      aria-label="button for product list tab"
                      className={`${
                        productStyle === "list"
                          ? "bg-blue border-blue text-white"
                          : "text-dark bg-gray-1 border-gray-3"
                      } flex items-center justify-center w-10.5 h-9 rounded-[5px] border ease-out duration-200 hover:bg-blue hover:border-blue hover:text-white`}
                    >
                      <List className="w-4 h-4 text-current" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Products Display */}
              {filteredProducts.length === 0 ? (
                <div className="bg-white p-12 text-center rounded-lg shadow-1">
                  <p className="text-gray-500 mb-2">
                    No products match your selected filters.
                  </p>
                  <button
                    onClick={handleResetFilters}
                    className="text-blue text-sm hover:underline font-medium"
                  >
                    Reset Filters
                  </button>
                </div>
              ) : (
                <div
                  className={`${
                    productStyle === "grid"
                      ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-7.5 gap-y-9"
                      : "flex flex-col gap-7.5"
                  }`}
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

              {/* Pagination */}
              {filteredProducts.length > 0 && (
                <div className="flex justify-center mt-15">
                  <div className="bg-white shadow-1 rounded-md p-2">
                    <ul className="flex items-center gap-1">
                      <li>
                        <button
                          aria-label="button for pagination left"
                          type="button"
                          disabled
                          className="flex items-center justify-center w-8 h-9 rounded-[3px] disabled:text-gray-4 text-dark hover:bg-blue hover:text-white transition"
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </button>
                      </li>
                      <li>
                        <a
                          href="#"
                          className="flex py-1.5 px-3.5 rounded-[3px] bg-blue text-white hover:bg-blue-dark"
                        >
                          1
                        </a>
                      </li>
                      <li>
                        <button
                          aria-label="button for pagination right"
                          type="button"
                          className="flex items-center justify-center w-8 h-9 rounded-[3px] text-dark hover:bg-blue hover:text-white transition"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
            {/* Content End */}
          </div>
        </div>
      </section>
    </>
  );
};

export default ShopWithSidebar;

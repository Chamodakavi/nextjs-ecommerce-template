"use client";
import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import RangeSlider from "react-range-slider-input";
import "react-range-slider-input/dist/style.css";

interface PriceDropdownProps {
  minPrice: number;
  maxPrice: number;
  currentPriceRange: [number, number];
  onPriceChange: (range: [number, number]) => void;
}

const PriceDropdown: React.FC<PriceDropdownProps> = ({
  minPrice,
  maxPrice,
  currentPriceRange,
  onPriceChange,
}) => {
  const [toggleDropdown, setToggleDropdown] = useState(true);

  return (
    <div className="bg-white shadow-1 rounded-lg">
      <div
        onClick={() => setToggleDropdown(!toggleDropdown)}
        className="cursor-pointer flex items-center justify-between py-3 pl-6 pr-5.5 select-none"
      >
        <p className="text-dark font-medium">Price</p>
        <button
          type="button"
          aria-label="button for price dropdown"
          className="text-dark"
        >
          <ChevronDown
            className={`w-5 h-5 transition-transform duration-200 ${
              toggleDropdown ? "rotate-180" : ""
            }`}
          />
        </button>
      </div>

      <div className={`p-6 ${toggleDropdown ? "block" : "hidden"}`}>
        <div className="price-range">
          <RangeSlider
            min={minPrice}
            max={maxPrice > minPrice ? maxPrice : minPrice + 1000}
            step={100}
            value={currentPriceRange}
            onInput={(e: [number, number]) =>
              onPriceChange([Math.floor(e[0]), Math.ceil(e[1])])
            }
          />

          <div className="price-amount flex items-center justify-between pt-4">
            <div className="text-custom-xs text-dark flex rounded border border-gray-3/80">
              <span className="block border-r border-gray-3/80 px-2.5 py-1.5 font-medium">
                Rs.
              </span>
              <span className="block px-3 py-1.5">
                {currentPriceRange[0].toLocaleString()}
              </span>
            </div>

            <div className="text-custom-xs text-dark flex rounded border border-gray-3/80">
              <span className="block border-r border-gray-3/80 px-2.5 py-1.5 font-medium">
                Rs.
              </span>
              <span className="block px-3 py-1.5">
                {currentPriceRange[1].toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PriceDropdown;

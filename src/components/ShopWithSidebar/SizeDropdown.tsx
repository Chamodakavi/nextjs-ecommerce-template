"use client";
import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

const SizeDropdown = () => {
  const [toggleDropdown, setToggleDropdown] = useState(true);
  const [selectedSize, setSelectedSize] = useState<string>("M");

  const sizes = ["M", "L", "XL", "XXL"];

  return (
    <div className="bg-white shadow-1 rounded-lg">
      <div
        onClick={() => setToggleDropdown(!toggleDropdown)}
        className="cursor-pointer flex items-center justify-between py-3 pl-6 pr-5.5 select-none"
      >
        <p className="text-dark font-medium">Size</p>
        <button
          type="button"
          aria-label="button for size dropdown"
          className="text-dark"
        >
          <ChevronDown
            className={`w-5 h-5 transition-transform duration-200 ${
              toggleDropdown ? "rotate-180" : ""
            }`}
          />
        </button>
      </div>

      <div
        className={`flex-wrap gap-2.5 p-6 ${
          toggleDropdown ? "flex" : "hidden"
        }`}
      >
        {sizes.map((size) => (
          <label
            key={size}
            htmlFor={`size-${size}`}
            className={`cursor-pointer select-none flex items-center rounded-md border transition-colors ${
              selectedSize === size
                ? "bg-blue text-white border-blue"
                : "bg-white text-dark border-gray-3 hover:bg-blue hover:text-white hover:border-blue"
            }`}
          >
            <input
              type="radio"
              name="size"
              id={`size-${size}`}
              className="sr-only"
              checked={selectedSize === size}
              onChange={() => setSelectedSize(size)}
            />
            <div className="text-custom-sm py-[5px] px-3.5 rounded-[5px]">
              {size}
            </div>
          </label>
        ))}
      </div>
    </div>
  );
};

export default SizeDropdown;

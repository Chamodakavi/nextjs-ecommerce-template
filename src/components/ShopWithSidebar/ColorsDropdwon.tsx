"use client";
import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

const ColorsDropdwon = () => {
  const [toggleDropdown, setToggleDropdown] = useState(true);
  const [activeColor, setActiveColor] = useState("blue");

  const colors = ["red", "blue", "orange", "pink", "purple"];

  return (
    <div className="bg-white shadow-1 rounded-lg">
      <div
        onClick={() => setToggleDropdown(!toggleDropdown)}
        className="cursor-pointer flex items-center justify-between py-3 pl-6 pr-5.5 select-none"
      >
        <p className="text-dark font-medium">Colors</p>
        <button
          type="button"
          aria-label="button for colors dropdown"
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
        {colors.map((color, key) => (
          <label
            key={key}
            htmlFor={color}
            className="cursor-pointer select-none flex items-center"
          >
            <div className="relative">
              <input
                type="radio"
                name="color"
                id={color}
                className="sr-only"
                onChange={() => setActiveColor(color)}
              />
              <div
                className={`flex items-center justify-center w-6 h-6 rounded-full border-2 transition-all ${
                  activeColor === color ? "border-blue" : "border-transparent"
                }`}
              >
                <span
                  className="block w-4 h-4 rounded-full shadow-sm"
                  style={{ backgroundColor: color }}
                ></span>
              </div>
            </div>
          </label>
        ))}
      </div>
    </div>
  );
};

export default ColorsDropdwon;

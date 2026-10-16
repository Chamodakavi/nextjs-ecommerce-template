"use client";
import React, { useState } from "react";
import { ChevronDown, Check } from "lucide-react";

export interface Gender {
  name: string;
  products: number;
}

interface GenderDropdownProps {
  genders: Gender[];
}

const GenderItem = ({ category }: { category: Gender }) => {
  const [selected, setSelected] = useState(false);
  return (
    <button
      type="button"
      className={`${
        selected ? "text-blue" : "text-dark"
      } group flex items-center justify-between w-full ease-out duration-200 hover:text-blue`}
      onClick={() => setSelected(!selected)}
    >
      <div className="flex items-center gap-2">
        <div
          className={`cursor-pointer flex items-center justify-center rounded w-4 h-4 border ${
            selected ? "border-blue bg-blue" : "bg-white border-gray-3"
          }`}
        >
          {selected && <Check className="w-3 h-3 text-white" />}
        </div>
        <span>{category.name}</span>
      </div>

      <span
        className={`${
          selected ? "text-white bg-blue" : "bg-gray-2 text-dark"
        } inline-flex rounded-[30px] text-custom-xs px-2 ease-out duration-200 group-hover:text-white group-hover:bg-blue`}
      >
        {category.products}
      </span>
    </button>
  );
};

const GenderDropdown: React.FC<GenderDropdownProps> = ({ genders }) => {
  const [toggleDropdown, setToggleDropdown] = useState(true);

  return (
    <div className="bg-white shadow-1 rounded-lg">
      <div
        onClick={() => setToggleDropdown(!toggleDropdown)}
        className="cursor-pointer flex items-center justify-between py-3 pl-6 pr-5.5 select-none"
      >
        <p className="text-dark font-medium">Gender</p>
        <button
          type="button"
          aria-label="button for gender dropdown"
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
        className={`flex-col gap-3 py-6 pl-6 pr-5.5 ${
          toggleDropdown ? "flex" : "hidden"
        }`}
      >
        {genders.map((gender, key) => (
          <GenderItem key={key} category={gender} />
        ))}
      </div>
    </div>
  );
};

export default GenderDropdown;

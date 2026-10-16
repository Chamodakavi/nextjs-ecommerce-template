"use client";
import React from "react";
import { ChevronDown, Check } from "lucide-react";

export interface CategoryItemData {
  name: string;
  products: number;
}

interface CategoryDropdownProps {
  categories: CategoryItemData[];
  selectedCategory: string | null;
  onSelectCategory: (categoryName: string | null) => void;
}

const CategoryDropdown: React.FC<CategoryDropdownProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
}) => {
  const [toggleDropdown, setToggleDropdown] = React.useState(true);

  return (
    <div className="bg-white shadow-1 rounded-lg">
      <div
        onClick={() => setToggleDropdown(!toggleDropdown)}
        className="cursor-pointer flex items-center justify-between py-3 pl-6 pr-5.5 select-none"
      >
        <p className="text-dark font-medium">Category</p>
        <button
          type="button"
          aria-label="button for category dropdown"
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
        {categories.map((category) => {
          const isSelected = selectedCategory === category.name;
          return (
            <button
              key={category.name}
              type="button"
              className={`${
                isSelected ? "text-blue font-medium" : "text-dark"
              } group flex items-center justify-between w-full ease-out duration-200 hover:text-blue`}
              onClick={() =>
                onSelectCategory(isSelected ? null : category.name)
              }
            >
              <div className="flex items-center gap-2">
                <div
                  className={`cursor-pointer flex items-center justify-center rounded w-4 h-4 border ${
                    isSelected
                      ? "border-blue bg-blue"
                      : "bg-white border-gray-3"
                  }`}
                >
                  {isSelected && <Check className="w-3 h-3 text-white" />}
                </div>
                <span>{category.name}</span>
              </div>

              <span
                className={`${
                  isSelected ? "text-white bg-blue" : "bg-gray-2 text-dark"
                } inline-flex rounded-[30px] text-custom-xs px-2 ease-out duration-200 group-hover:text-white group-hover:bg-blue`}
              >
                {category.products}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryDropdown;

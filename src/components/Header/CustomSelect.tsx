"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown } from "lucide-react";

export interface SelectOption {
  label: string;
  value: string;
}

interface CustomSelectProps {
  options: SelectOption[];
  selectedOption: SelectOption;
  onSelect: (option: SelectOption) => void;
}

const CustomSelect: React.FC<CustomSelectProps> = ({
  options,
  selectedOption,
  onSelect,
}) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleOptionClick = (option: SelectOption) => {
    onSelect(option);
    setIsOpen(false);

    if (option.value === "all") {
      router.push("/shop-with-sidebar");
    } else {
      // Send category label as parameter
      router.push(
        `/shop-with-sidebar?category=${encodeURIComponent(option.label)}`,
      );
    }
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (!(event.target as HTMLElement)?.closest(".custom-select-wrapper")) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="custom-select-wrapper relative min-w-[160px] select-none">
      <button
        type="button"
        onClick={toggleDropdown}
        className="w-full flex items-center justify-between gap-2 py-2.5 px-4 bg-gray-1 border border-r-0 border-gray-3 rounded-l-[5px] text-sm text-dark font-medium outline-none focus:border-blue cursor-pointer"
      >
        <span className="truncate">
          {selectedOption?.label || "All Categories"}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute left-0 top-full mt-1 w-full max-h-60 overflow-y-auto bg-white border border-gray-3 rounded-md shadow-lg z-50 py-1">
          {options.map((option, index) => (
            <div
              key={index}
              onClick={() => handleOptionClick(option)}
              className={`py-2 px-4 text-sm cursor-pointer transition-colors hover:bg-gray-1 hover:text-blue ${
                selectedOption?.value === option.value
                  ? "bg-blue/10 text-blue font-medium"
                  : "text-dark"
              }`}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomSelect;

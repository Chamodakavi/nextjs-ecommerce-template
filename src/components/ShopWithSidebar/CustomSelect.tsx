"use client";
import React, { useState, useEffect, useRef } from "react";
import { ChevronDown } from "lucide-react";

export interface Option {
  label: string;
  value: string;
}

interface CustomSelectProps {
  options: Option[];
  onChange?: (option: Option) => void;
}

const CustomSelect: React.FC<CustomSelectProps> = ({ options, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<Option>(options[0]);
  const selectRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = (event: MouseEvent) => {
    if (
      selectRef.current &&
      !selectRef.current.contains(event.target as Node)
    ) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => {
    setIsOpen((prev) => !prev);
  };

  const handleOptionClick = (option: Option) => {
    setSelectedOption(option);
    if (onChange) onChange(option);
    setIsOpen(false);
  };

  return (
    <div
      className="custom-select custom-select-2 flex-shrink-0 relative cursor-pointer"
      ref={selectRef}
    >
      <div
        className={`select-selected whitespace-nowrap flex items-center justify-between gap-2 px-4 py-2 border rounded-md bg-white text-dark ${
          isOpen ? "select-arrow-active" : ""
        }`}
        onClick={toggleDropdown}
      >
        <span>{selectedOption.label}</span>
        {/* <ChevronDown
          className={`w-4 h-4 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        /> */}
      </div>
      {isOpen && (
        <div className="select-items absolute left-0 top-full mt-1 w-full bg-white border rounded-md shadow-lg z-20 overflow-hidden">
          {options.map((option, index) => (
            <div
              key={index}
              onClick={() => handleOptionClick(option)}
              className={`select-item px-4 py-2 hover:bg-gray-1 cursor-pointer text-sm ${
                selectedOption.value === option.value
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

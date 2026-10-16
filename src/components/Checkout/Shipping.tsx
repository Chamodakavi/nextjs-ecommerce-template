"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

const Shipping = () => {
  const [dropdown, setDropdown] = useState(false);

  return (
    <div className="bg-white shadow-1 rounded-[10px] mt-7.5">
      <div
        onClick={() => setDropdown(!dropdown)}
        className="cursor-pointer flex items-center justify-between font-medium text-lg text-dark py-5 px-5.5 select-none"
      >
        <span>Ship to a different address?</span>
        <ChevronDown
          className={`w-5 h-5 transition-transform duration-200 ${
            dropdown ? "rotate-180" : ""
          }`}
        />
      </div>

      <div className={`p-4 sm:p-8.5 ${dropdown ? "block" : "hidden"}`}>
        <div className="mb-5">
          <label htmlFor="shippingCountry" className="block mb-2.5">
            Country/ Region <span className="text-red">*</span>
          </label>

          <div className="relative">
            <select
              id="shippingCountry"
              defaultValue="0"
              className="w-full bg-gray-1 rounded-md border border-gray-3 text-dark-4 py-3 pl-5 pr-9 duration-200 appearance-none outline-none focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20 cursor-pointer"
            >
              <option value="0">Sri Lanka</option>
              <option value="1">Australia</option>
              <option value="2">United States</option>
            </select>
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-dark-4 pointer-events-none">
              <ChevronDown className="w-4 h-4" />
            </span>
          </div>
        </div>

        <div className="mb-5">
          <label htmlFor="shippingAddressOne" className="block mb-2.5">
            Street Address <span className="text-red">*</span>
          </label>

          <input
            type="text"
            id="shippingAddressOne"
            name="shippingAddressOne"
            placeholder="House number and street name"
            className="rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20 mb-5"
          />

          <input
            type="text"
            id="shippingAddressTwo"
            name="shippingAddressTwo"
            placeholder="Apartment, suite, unit, etc. (optional)"
            className="rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
          />
        </div>

        <div className="mb-5">
          <label htmlFor="shippingTown" className="block mb-2.5">
            Town/ City <span className="text-red">*</span>
          </label>
          <input
            type="text"
            id="shippingTown"
            name="shippingTown"
            className="rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
          />
        </div>

        <div className="mb-5">
          <label htmlFor="shippingPhone" className="block mb-2.5">
            Phone <span className="text-red">*</span>
          </label>
          <input
            type="text"
            id="shippingPhone"
            name="shippingPhone"
            className="rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
          />
        </div>

        <div>
          <label htmlFor="shippingEmail" className="block mb-2.5">
            Email Address <span className="text-red">*</span>
          </label>
          <input
            type="email"
            id="shippingEmail"
            name="shippingEmail"
            className="rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
          />
        </div>
      </div>
    </div>
  );
};

export default Shipping;

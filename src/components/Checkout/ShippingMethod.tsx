"use client";

import React, { useState } from "react";
import Image from "next/image";

const ShippingMethod = () => {
  const [shippingMethod, setShippingMethod] = useState("free");

  return (
    <div className="bg-white shadow-1 rounded-[10px] mt-7.5">
      <div className="border-b border-gray-3 py-5 px-4 sm:px-8.5">
        <h3 className="font-medium text-xl text-dark">Shipping Method</h3>
      </div>

      <div className="p-4 sm:p-8.5">
        <div className="flex flex-col gap-4">
          {/* Free Shipping */}
          <label
            htmlFor="free"
            className="flex cursor-pointer select-none items-center gap-3.5"
          >
            <div className="relative">
              <input
                type="radio"
                name="shippingMethod"
                id="free"
                checked={shippingMethod === "free"}
                className="sr-only"
                onChange={() => setShippingMethod("free")}
              />
              <div
                className={`flex h-4 w-4 items-center justify-center rounded-full transition-all ${
                  shippingMethod === "free"
                    ? "border-4 border-blue"
                    : "border border-gray-4"
                }`}
              ></div>
            </div>
            <span className="text-dark font-medium text-sm">Free Shipping</span>
          </label>

          {/* FedEx */}
          <label
            htmlFor="fedex"
            className="flex cursor-pointer select-none items-center gap-3.5"
          >
            <div className="relative">
              <input
                type="radio"
                name="shippingMethod"
                id="fedex"
                checked={shippingMethod === "fedex"}
                className="sr-only"
                onChange={() => setShippingMethod("fedex")}
              />
              <div
                className={`flex h-4 w-4 items-center justify-center rounded-full transition-all ${
                  shippingMethod === "fedex"
                    ? "border-4 border-blue"
                    : "border border-gray-4"
                }`}
              ></div>
            </div>

            <div className="rounded-md border-[0.5px] border-gray-4 shadow-1 py-3.5 px-5 ease-out duration-200 hover:bg-gray-2 hover:border-transparent hover:shadow-none w-full">
              <div className="flex items-center">
                <div className="pr-4">
                  <Image
                    src="/images/checkout/fedex.svg"
                    alt="fedex"
                    width={64}
                    height={18}
                  />
                </div>
                <div className="border-l border-gray-4 pl-4">
                  <p className="font-semibold text-dark">$10.99</p>
                  <p className="text-custom-xs text-gray-500">
                    Standard Shipping
                  </p>
                </div>
              </div>
            </div>
          </label>

          {/* DHL */}
          <label
            htmlFor="dhl"
            className="flex cursor-pointer select-none items-center gap-3.5"
          >
            <div className="relative">
              <input
                type="radio"
                name="shippingMethod"
                id="dhl"
                checked={shippingMethod === "dhl"}
                className="sr-only"
                onChange={() => setShippingMethod("dhl")}
              />
              <div
                className={`flex h-4 w-4 items-center justify-center rounded-full transition-all ${
                  shippingMethod === "dhl"
                    ? "border-4 border-blue"
                    : "border border-gray-4"
                }`}
              ></div>
            </div>

            <div className="rounded-md border-[0.5px] border-gray-4 shadow-1 py-3.5 px-5 ease-out duration-200 hover:bg-gray-2 hover:border-transparent hover:shadow-none w-full">
              <div className="flex items-center">
                <div className="pr-4">
                  <Image
                    src="/images/checkout/dhl.svg"
                    alt="dhl"
                    width={64}
                    height={20}
                  />
                </div>
                <div className="border-l border-gray-4 pl-4">
                  <p className="font-semibold text-dark">$12.50</p>
                  <p className="text-custom-xs text-gray-500">
                    Standard Shipping
                  </p>
                </div>
              </div>
            </div>
          </label>
        </div>
      </div>
    </div>
  );
};

export default ShippingMethod;

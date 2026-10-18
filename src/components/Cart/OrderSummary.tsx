"use client";

import React from "react";
import { useSelector } from "react-redux";
import { selectTotalPrice } from "@/redux/features/cart-slice";
import { useAppSelector } from "@/redux/store";

const OrderSummary = () => {
  const cartItems = useAppSelector((state) => state.cartReducer.items);
  const totalPrice = useSelector(selectTotalPrice);

  return (
    <div className="lg:max-w-[455px] w-full">
      <div className="bg-white shadow-1 rounded-[10px]">
        <div className="border-b border-gray-3 py-5 px-4 sm:px-8.5">
          <h3 className="font-medium text-xl text-dark">Order Summary</h3>
        </div>

        <div className="pt-2.5 pb-8.5 px-4 sm:px-8.5">
          {/* Table Header */}
          <div className="flex items-center justify-between py-5 border-b border-gray-3">
            <div>
              <h4 className="font-medium text-dark">Product</h4>
            </div>
            <div>
              <h4 className="font-medium text-dark text-right">Subtotal</h4>
            </div>
          </div>

          {/* Product Items */}
          {cartItems.map((item: any, key) => {
            const price =
              item.discountedPrice || item.selling_price || item.price || 0;
            return (
              <div
                key={key}
                className="flex items-center justify-between py-4 border-b border-gray-3 gap-4"
              >
                <div className="flex-1">
                  <p className="text-dark text-sm line-clamp-1">
                    {item.title || item.name}
                  </p>
                  <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                </div>
                <div>
                  <p className="text-dark font-medium text-right text-sm">
                    Rs. {Number(price * item.quantity).toLocaleString()}
                  </p>
                </div>
              </div>
            );
          })}

          {/* Total */}
          <div className="flex items-center justify-between pt-5">
            <div>
              <p className="font-medium text-lg text-dark">Total</p>
            </div>
            <div>
              <p className="font-bold text-xl text-dark text-right">
                Rs. {Number(totalPrice).toLocaleString()}
              </p>
            </div>
          </div>

          {/* Checkout Button */}
          <button
            type="button"
            className="w-full flex justify-center font-medium text-white bg-blue py-3 px-6 rounded-md ease-out duration-200 hover:bg-blue-dark mt-7.5 shadow-sm"
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;

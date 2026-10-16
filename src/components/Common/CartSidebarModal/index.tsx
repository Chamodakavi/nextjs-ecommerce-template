"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { X } from "lucide-react";
import { useSelector } from "react-redux";

import { useCartModalContext } from "@/app/context/CartSidebarModalContext";
import {
  removeItemFromCart,
  selectTotalPrice,
} from "@/redux/features/cart-slice";
import { useAppSelector } from "@/redux/store";
import SingleItem from "./SingleItem";
import EmptyCart from "./EmptyCart";

const CartSidebarModal = () => {
  const { isCartModalOpen, closeCartModal } = useCartModalContext();
  const cartItems = useAppSelector((state) => state.cartReducer.items);
  const totalPrice = useSelector(selectTotalPrice);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as HTMLElement;
      if (!target.closest(".modal-content")) {
        closeCartModal();
      }
    }

    if (isCartModalOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isCartModalOpen, closeCartModal]);

  return (
    <div
      className={`fixed top-0 left-0 z-99999 overflow-y-auto no-scrollbar w-full h-screen bg-dark/70 ease-linear duration-300 ${
        isCartModalOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <div className="flex items-center justify-end h-full">
        <div className="w-full max-w-[500px] h-full shadow-1 bg-white px-4 sm:px-7.5 lg:px-11 relative modal-content flex flex-col justify-between">
          <div>
            {/* Header */}
            <div className="sticky top-0 bg-white flex items-center justify-between pb-6 pt-4 sm:pt-7.5 lg:pt-11 border-b border-gray-3 z-10">
              <h2 className="font-medium text-dark text-lg sm:text-2xl">
                Cart View ({cartItems.length})
              </h2>
              <button
                type="button"
                onClick={() => closeCartModal()}
                aria-label="Close cart modal"
                className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-1 text-dark-5 hover:text-dark hover:bg-gray-2 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Cart List Container */}
            <div className="max-h-[calc(100vh-250px)] overflow-y-auto no-scrollbar py-4">
              <div className="flex flex-col gap-4">
                {cartItems.length > 0 ? (
                  cartItems.map((item) => (
                    <SingleItem
                      key={item.id}
                      item={item}
                      removeItemFromCart={removeItemFromCart}
                    />
                  ))
                ) : (
                  <EmptyCart />
                )}
              </div>
            </div>
          </div>

          {/* Footer Summary & Actions */}
          <div className="border-t border-gray-3 bg-white pt-5 pb-6 sm:pb-8 mt-auto sticky bottom-0">
            <div className="flex items-center justify-between gap-5 mb-6">
              <p className="font-medium text-lg sm:text-xl text-dark">
                Subtotal:
              </p>
              <p className="font-medium text-lg sm:text-xl text-dark">
                Rs. {Number(totalPrice || 0).toLocaleString()}
              </p>
            </div>

            <div className="flex items-center gap-4">
              <Link
                onClick={() => closeCartModal()}
                href="/cart"
                className="w-full flex justify-center font-medium text-white bg-blue py-3 px-6 rounded-md ease-out duration-200 hover:bg-blue-dark"
              >
                View Cart
              </Link>

              <Link
                onClick={() => closeCartModal()}
                href="/checkout"
                className="w-full flex justify-center font-medium text-white bg-dark py-3 px-6 rounded-md ease-out duration-200 hover:bg-opacity-90"
              >
                Checkout
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartSidebarModal;

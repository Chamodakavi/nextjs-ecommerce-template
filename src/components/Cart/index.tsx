"use client";

import React from "react";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import Discount from "./Discount";
import OrderSummary from "./OrderSummary";
import SingleItem from "./SingleItem";
import Breadcrumb from "../Common/Breadcrumb";
import { useAppSelector } from "@/redux/store";
import { useDispatch } from "react-redux";
import { removeAllItemsFromCart } from "@/redux/features/cart-slice";

const Cart = () => {
  const cartItems = useAppSelector((state) => state.cartReducer.items);
  const dispatch = useDispatch();

  const handleClearCart = () => {
    if (
      typeof window !== "undefined" &&
      window.confirm("Are you sure you want to clear your cart?")
    ) {
      dispatch(removeAllItemsFromCart());
    }
  };

  return (
    <>
      <section>
        <Breadcrumb title={"Cart"} pages={["Cart"]} />
      </section>

      {cartItems.length > 0 ? (
        <section className="overflow-hidden py-12 sm:py-20 bg-gray-2">
          <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
            <div className="flex flex-wrap items-center justify-between gap-5 mb-7.5">
              <h2 className="font-medium text-dark text-2xl">Your Cart</h2>
              <button
                type="button"
                onClick={handleClearCart}
                className="text-blue hover:text-red transition-colors text-sm font-medium"
              >
                Clear Shopping Cart
              </button>
            </div>

            <div className="bg-white rounded-[10px] shadow-1">
              <div className="w-full overflow-x-auto">
                <div className="min-w-[1170px]">
                  {/* Table Header */}
                  <div className="flex items-center py-5.5 px-7.5 bg-gray-1 border-b border-gray-3 rounded-t-[10px]">
                    <div className="min-w-[400px]">
                      <p className="text-dark font-medium">Product</p>
                    </div>

                    <div className="min-w-[180px]">
                      <p className="text-dark font-medium">Price</p>
                    </div>

                    <div className="min-w-[275px]">
                      <p className="text-dark font-medium">Quantity</p>
                    </div>

                    <div className="min-w-[200px]">
                      <p className="text-dark font-medium">Subtotal</p>
                    </div>

                    <div className="min-w-[50px]">
                      <p className="text-dark font-medium text-right">Action</p>
                    </div>
                  </div>

                  {/* Cart Item List */}
                  {cartItems.map((item, key) => (
                    <SingleItem item={item} key={key} />
                  ))}
                </div>
              </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-7.5 xl:gap-11 mt-9">
              <Discount />
              <OrderSummary />
            </div>
          </div>
        </section>
      ) : (
        <section className="py-20 bg-gray-2">
          <div className="max-w-[1170px] w-full mx-auto px-4 text-center">
            <div className="w-24 h-24 rounded-full bg-gray-1 border border-gray-3 flex items-center justify-center mx-auto mb-6 text-gray-400">
              <ShoppingBag className="w-12 h-12 stroke-[1.5]" />
            </div>

            <h3 className="font-semibold text-2xl text-dark mb-2">
              Your cart is currently empty!
            </h3>
            <p className="text-gray-500 pb-8 text-sm max-w-md mx-auto">
              Looks like you haven't added any automotive parts or accessories
              to your cart yet.
            </p>

            <Link
              href="/shop"
              className="inline-flex justify-center font-medium text-white bg-blue py-3.5 px-8 rounded-md ease-out duration-200 hover:bg-blue-dark shadow-sm"
            >
              Continue Shopping
            </Link>
          </div>
        </section>
      )}
    </>
  );
};

export default Cart;

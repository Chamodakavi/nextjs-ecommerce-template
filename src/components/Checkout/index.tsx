"use client";

import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import Breadcrumb from "../Common/Breadcrumb";
import Login from "./Login";
import Shipping from "./Shipping";
import ShippingMethod from "./ShippingMethod";
import PaymentMethod from "./PaymentMethod";
import Coupon from "./Coupon";
import Billing from "./Billing";

const Checkout = () => {
  const cartItems = useSelector((state: RootState) => state.cartReducer.items);

  const subtotal = cartItems.reduce(
    (acc, item) => acc + (item.discountedPrice || item.price) * item.quantity,
    0,
  );

  const shippingFee = cartItems.length > 0 ? 400 : 0;
  const total = subtotal + shippingFee;

  return (
    <>
      <Breadcrumb title="Checkout" pages={["checkout"]} />
      <section className="overflow-hidden py-20 bg-gray-2">
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
          <form onSubmit={(e) => e.preventDefault()}>
            <div className="flex flex-col lg:flex-row gap-7.5 xl:gap-11">
              {/* Checkout Left Column */}
              <div className="lg:max-w-[670px] w-full">
                <Login />
                <Billing />
                <Shipping />

                <div className="bg-white shadow-1 rounded-[10px] p-4 sm:p-8.5 mt-7.5">
                  <div>
                    <label htmlFor="notes" className="block mb-2.5">
                      Other Notes (optional)
                    </label>
                    <textarea
                      name="notes"
                      id="notes"
                      rows={5}
                      placeholder="Notes about your order, e.g. special notes for delivery."
                      className="rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full p-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
                    ></textarea>
                  </div>
                </div>
              </div>

              {/* Checkout Right Column */}
              <div className="max-w-[455px] w-full">
                <div className="bg-white shadow-1 rounded-[10px]">
                  <div className="border-b border-gray-3 py-5 px-4 sm:px-8.5">
                    <h3 className="font-medium text-xl text-dark">
                      Your Order
                    </h3>
                  </div>

                  <div className="pt-2.5 pb-8.5 px-4 sm:px-8.5">
                    <div className="flex items-center justify-between py-5 border-b border-gray-3">
                      <h4 className="font-medium text-dark">Product</h4>
                      <h4 className="font-medium text-dark text-right">
                        Subtotal
                      </h4>
                    </div>

                    {/* Dynamic Order List */}
                    {cartItems.length === 0 ? (
                      <div className="py-5 text-center text-gray-500 text-sm">
                        Your cart is empty.
                      </div>
                    ) : (
                      cartItems.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center justify-between py-5 border-b border-gray-3"
                        >
                          <div>
                            <p className="text-dark line-clamp-1 pr-2">
                              {item.title}{" "}
                              <span className="text-gray-500 text-sm">
                                x {item.quantity}
                              </span>
                            </p>
                          </div>
                          <div>
                            <p className="text-dark text-right font-medium whitespace-nowrap">
                              Rs.{" "}
                              {(
                                (item.discountedPrice || item.price) *
                                item.quantity
                              ).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      ))
                    )}

                    {/* Shipping Fee */}
                    <div className="flex items-center justify-between py-5 border-b border-gray-3">
                      <p className="text-dark">Shipping Fee</p>
                      <p className="text-dark text-right font-medium">
                        Rs. {shippingFee.toLocaleString()}
                      </p>
                    </div>

                    {/* Total */}
                    <div className="flex items-center justify-between pt-5">
                      <p className="font-medium text-lg text-dark">Total</p>
                      <p className="font-medium text-lg text-dark text-right">
                        Rs. {total.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>

                <Coupon />
                <ShippingMethod />
                <PaymentMethod />

                <button
                  type="submit"
                  className="w-full flex justify-center font-medium text-white bg-blue py-3 px-6 rounded-md ease-out duration-200 hover:bg-blue-dark mt-7.5"
                >
                  Proceed to Checkout
                </button>
              </div>
            </div>
          </form>
        </div>
      </section>
    </>
  );
};

export default Checkout;

"use client";

import React from "react";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { useCartModalContext } from "@/app/context/CartSidebarModalContext";

const EmptyCart = () => {
  const { closeCartModal } = useCartModalContext();

  return (
    <div className="text-center py-10">
      <div className="mx-auto mb-6 flex items-center justify-center w-20 h-20 rounded-full bg-gray-1 text-gray-400">
        <ShoppingBag className="w-10 h-10 text-gray-400" />
      </div>

      <h3 className="font-medium text-dark text-lg mb-2">
        Your cart is empty!
      </h3>
      <p className="text-custom-sm text-gray-500 mb-6">
        Looks like you haven&apos;t added anything to your cart yet.
      </p>

      <Link
        onClick={() => closeCartModal()}
        href="/shop-with-sidebar"
        className="w-full lg:w-10/12 mx-auto flex justify-center font-medium text-white bg-dark py-3 px-6 rounded-md ease-out duration-200 hover:bg-opacity-90"
      >
        Continue Shopping
      </Link>
    </div>
  );
};

export default EmptyCart;

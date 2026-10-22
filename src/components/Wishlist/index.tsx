"use client";
import React from "react";
import Link from "next/link";
import Breadcrumb from "../Common/Breadcrumb";
import { useAppSelector } from "@/redux/store";
import { useDispatch } from "react-redux";
import { removeAllItemsFromWishlist } from "@/redux/features/wishlist-slice";
import SingleItem from "./SingleItem";
import { Heart } from "lucide-react";

export const Wishlist = () => {
  const wishlistItems = useAppSelector((state) => state.wishlistReducer.items);
  const dispatch = useDispatch();

  const handleClearWishlist = () => {
    if (
      typeof window !== "undefined" &&
      window.confirm("Are you sure you want to clear your wishlist?")
    ) {
      dispatch(removeAllItemsFromWishlist());
    }
  };

  return (
    <>
      <Breadcrumb title={"Wishlist"} pages={["Wishlist"]} />
      <section className="overflow-hidden py-12 sm:py-20 bg-gray-2">
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
          <div className="flex flex-wrap items-center justify-between gap-5 mb-7.5">
            <h2 className="font-medium text-dark text-2xl">
              Your Wishlist ({wishlistItems.length})
            </h2>
            {wishlistItems.length > 0 && (
              <button
                type="button"
                onClick={handleClearWishlist}
                className="text-blue hover:underline cursor-pointer font-medium"
              >
                Clear Wishlist
              </button>
            )}
          </div>

          {wishlistItems.length === 0 ? (
            <div className="bg-white rounded-[10px] shadow-1 p-8 sm:p-12 text-center">
              <div className="w-16 h-16 bg-blue/10 text-blue rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8" />
              </div>
              <h3 className="font-semibold text-xl text-dark mb-2">
                Your wishlist is empty
              </h3>
              <p className="text-gray-500 mb-6 max-w-md mx-auto text-sm">
                Explore our catalog and save items you love to your wishlist. They will be saved to your account and synced across your devices!
              </p>
              <Link
                href="/shop-with-sidebar"
                className="inline-flex items-center justify-center py-3 px-7 rounded-md bg-blue text-white font-medium hover:bg-blue-dark transition-colors shadow-sm"
              >
                Start Shopping
              </Link>
            </div>
          ) : (
            <div className="bg-white rounded-[10px] shadow-1">
              <div className="w-full overflow-x-auto">
                <div className="min-w-[1170px]">
                  {/* <!-- table header --> */}
                  <div className="flex items-center py-5.5 px-10 border-b border-gray-2">
                    <div className="min-w-[83px]"></div>
                    <div className="min-w-[387px]">
                      <p className="text-dark font-medium">Product</p>
                    </div>

                    <div className="min-w-[205px]">
                      <p className="text-dark font-medium">Unit Price</p>
                    </div>

                    <div className="min-w-[265px]">
                      <p className="text-dark font-medium">Stock Status</p>
                    </div>

                    <div className="min-w-[150px]">
                      <p className="text-dark text-right font-medium">Action</p>
                    </div>
                  </div>

                  {/* <!-- wish item --> */}
                  {wishlistItems.map((item, key) => (
                    <SingleItem item={item} key={item.id || key} />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

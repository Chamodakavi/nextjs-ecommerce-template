"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { Heart, Star, ShoppingBag } from "lucide-react";

import { Product } from "@/types/product";
import { useModalContext } from "@/app/context/QuickViewModalContext";
import { updateQuickView } from "@/redux/features/quickView-slice";
import { addItemToCart } from "@/redux/features/cart-slice";
import { addItemToWishlist } from "@/redux/features/wishlist-slice";
import { AppDispatch } from "@/redux/store";

const SingleGridItem = ({ item }: { item: Product }) => {
  const { openModal } = useModalContext();
  const dispatch = useDispatch<AppDispatch>();

  const handleOpenDetailModal = () => {
    dispatch(updateQuickView({ ...item }));
    openModal();
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(
      addItemToCart({
        ...item,
        title: item.name,
        price: Number(item.cost_price || item.selling_price),
        discountedPrice: Number(item.selling_price),
        quantity: 1,
      } as any),
    );
  };

  const handleItemToWishList = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(
      addItemToWishlist({
        ...item,
        title: item.name,
        price: Number(item.cost_price || item.selling_price),
        discountedPrice: Number(item.selling_price),
        status: item.availability_status || "available",
        quantity: 1,
      } as any),
    );
  };

  const displayImage =
    item.image_url ||
    (item.image_urls && item.image_urls[0]) ||
    "/images/products/product-placeholder.png";

  return (
    <div
      onClick={handleOpenDetailModal}
      className="group cursor-pointer flex flex-col h-full bg-white rounded-lg p-2.5 shadow-1 transition-all duration-200 hover:shadow-2"
    >
      {/* Product Image Box */}
      <div className="relative w-full aspect-[4/5] overflow-hidden rounded-md bg-[#F6F7FB] flex items-center justify-center mb-3">
        <Image
          src={displayImage}
          alt={item.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-contain p-3 group-hover:scale-105 transition-transform duration-300"
        />

        {/* Hover Quick Actions */}
        <div className="absolute left-0 bottom-0 translate-y-full w-full flex items-center justify-center gap-2 p-2 bg-gradient-to-t from-black/40 to-transparent ease-linear duration-200 group-hover:translate-y-0 z-10">
          <button
            type="button"
            onClick={handleAddToCart}
            className="flex-1 flex items-center justify-center gap-1 font-medium text-xs py-1.5 px-2 rounded bg-blue text-white ease-out duration-200 hover:bg-blue-dark shadow-sm"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Add</span>
          </button>

          <button
            type="button"
            onClick={handleItemToWishList}
            aria-label="Add to wishlist"
            className="flex items-center justify-center w-7 h-7 rounded bg-white text-dark hover:text-blue shadow-sm"
          >
            <Heart className="w-3.5 h-3.5 text-current" />
          </button>
        </div>
      </div>

      {/* Product Meta */}
      <div className="flex flex-col flex-grow justify-between">
        <div>
          {/* Rating */}
          <div className="flex items-center gap-1 mb-1">
            <div className="flex items-center gap-0.5 text-[#FBB040]">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3 h-3 fill-current" />
              ))}
            </div>
            <span className="text-custom-xs text-gray-500">(5.0)</span>
          </div>

          {/* Title */}
          <h3 className="font-medium text-xs sm:text-sm text-dark hover:text-blue mb-1 line-clamp-2 leading-tight">
            <Link
              href={`/shop/${item.custom_product_id || item.id}`}
              onClick={(e) => e.stopPropagation()}
            >
              {item.name}
            </Link>
          </h3>
        </div>

        {/* Pricing */}
        <div className="flex flex-wrap items-baseline gap-1.5 mt-1">
          <span className="font-semibold text-sm sm:text-base text-dark">
            Rs. {Number(item.selling_price).toLocaleString()}
          </span>
          {item.cost_price && item.cost_price > item.selling_price && (
            <span className="text-gray-400 line-through text-xs">
              Rs. {Number(item.cost_price).toLocaleString()}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default SingleGridItem;

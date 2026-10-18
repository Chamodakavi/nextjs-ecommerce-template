"use client";

import React, { useState } from "react";
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
import AddToCartModal from "@/components/Shop/AddToCartModal";

const SingleGridItem = ({ item }: { item: Product }) => {
  const { openModal } = useModalContext();
  const dispatch = useDispatch<AppDispatch>();
  const [showCartModal, setShowCartModal] = useState(false);

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
    setShowCartModal(true);
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
    <>
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
          <div className="absolute inset-x-0 bottom-0 z-10 flex translate-y-0 items-center justify-center gap-2 bg-gradient-to-t from-black/40 to-transparent p-2 opacity-100 transition-all duration-200 sm:translate-y-full sm:opacity-0 sm:group-hover:translate-y-0 sm:group-hover:opacity-100">
            <button
              type="button"
              onClick={handleAddToCart}
              className="flex flex-1 items-center justify-center gap-1 rounded bg-blue px-2 py-1.5 text-xs font-medium text-white shadow-sm transition hover:bg-blue-dark"
            >
              <ShoppingBag className="h-3.5 w-3.5" />
              <span>Add to Cart</span>
            </button>

            <button
              type="button"
              onClick={handleItemToWishList}
              aria-label="Add to wishlist"
              className="flex h-7 w-7 items-center justify-center rounded bg-white text-dark shadow-sm hover:text-blue"
            >
              <Heart className="h-3.5 w-3.5" />
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

      {/* Cart Notification Popup Modal */}
      <AddToCartModal
        isOpen={showCartModal}
        onClose={() => setShowCartModal(false)}
        productName={item.name}
      />
    </>
  );
};

export default SingleGridItem;

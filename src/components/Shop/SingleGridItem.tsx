"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { Heart, Star } from "lucide-react";

import { Product } from "@/types/product";
import { useModalContext } from "@/app/context/QuickViewModalContext";
import { updateQuickView } from "@/redux/features/quickView-slice";
import { addItemToCart } from "@/redux/features/cart-slice";
import { addItemToWishlist } from "@/redux/features/wishlist-slice";
import { AppDispatch } from "@/redux/store";

const SingleGridItem = ({ item }: { item: Product }) => {
  const { openModal } = useModalContext();
  const dispatch = useDispatch<AppDispatch>();

  // Open QuickView modal with current product data
  const handleOpenDetailModal = () => {
    dispatch(updateQuickView({ ...item }));
    openModal();
  };

  // Add to cart with mapped properties
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

  // Add to wishlist with mapped properties
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

  // Safe fallback for image display
  const displayImage =
    item.image_url ||
    (item.image_urls && item.image_urls[0]) ||
    "/images/products/product-placeholder.png";

  return (
    <div onClick={handleOpenDetailModal} className="group cursor-pointer">
      <div className="relative overflow-hidden flex items-center justify-center rounded-lg bg-white shadow-1 min-h-[270px] mb-4">
        <div className="relative w-[220px] h-[220px]">
          <Image
            src={displayImage}
            alt={item.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            className="object-contain group-hover:scale-105 transition-transform duration-300"
          />
        </div>

        {/* Hover Action Controls (Eye icon removed) */}
        <div className="absolute left-0 bottom-0 translate-y-full w-full flex items-center justify-center gap-2.5 pb-5 ease-linear duration-200 group-hover:translate-y-0 z-10">
          <button
            onClick={handleAddToCart}
            className="inline-flex font-medium text-custom-sm py-[7px] px-5 rounded-[5px] bg-blue text-white ease-out duration-200 hover:bg-blue-dark"
          >
            Add to cart
          </button>

          <button
            onClick={handleItemToWishList}
            aria-label="button for favorite select"
            id="favOne"
            className="flex items-center justify-center w-9 h-9 rounded-[5px] shadow-1 ease-out duration-200 text-dark bg-white hover:text-blue"
          >
            <Heart className="w-4 h-4 text-current" />
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2.5 mb-2">
        <div className="flex items-center gap-1 text-[#FFA645]">
          {[...Array(5)].map((_, index) => (
            <Star key={index} className="w-3.5 h-3.5 fill-current" />
          ))}
        </div>

        <p className="text-custom-sm text-gray-500">(5.0)</p>
      </div>

      <h3 className="font-medium text-dark ease-out duration-200 hover:text-blue mb-1.5 line-clamp-1">
        <Link
          href={`/shop/${item.custom_product_id || item.id}`}
          onClick={(e) => e.stopPropagation()}
        >
          {item.name}
        </Link>
      </h3>

      <div className="flex items-center gap-2 font-medium text-lg">
        <span className="text-dark">
          Rs. {Number(item.selling_price).toLocaleString()}
        </span>
        {item.cost_price && item.cost_price > item.selling_price && (
          <span className="text-dark-4 line-through text-sm">
            Rs. {Number(item.cost_price).toLocaleString()}
          </span>
        )}
      </div>
    </div>
  );
};

export default SingleGridItem;

"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Product } from "@/types/product";
import { useModalContext } from "@/app/context/QuickViewModalContext";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { updateQuickView } from "@/redux/features/quickView-slice";
import { addItemToCart } from "@/redux/features/cart-slice";
import { addItemToWishlist } from "@/redux/features/wishlist-slice";
import { Star, ShoppingCart, Heart } from "lucide-react";

const SingleItem = ({ item }: { item: Product }) => {
  const { openModal } = useModalContext();
  const dispatch = useDispatch<AppDispatch>();

  // Open QuickView modal with current product data
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
    <div onClick={handleOpenDetailModal} className="group cursor-pointer">
      <div className="relative overflow-hidden rounded-lg bg-[#F6F7FB] min-h-[403px]">
        {/* Card Header & Info */}
        <div className="text-center px-4 py-7.5">
          <div className="flex items-center justify-center gap-2.5 mb-2">
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

          <span className="flex items-center justify-center gap-2 font-medium text-lg">
            <span className="text-dark">
              Rs. {Number(item.selling_price).toLocaleString()}
            </span>
            {item.cost_price && item.cost_price > item.selling_price && (
              <span className="text-dark-4 line-through text-sm">
                Rs. {Number(item.cost_price).toLocaleString()}
              </span>
            )}
          </span>
        </div>

        {/* Image Display Container */}
        <div className="relative w-full h-[220px] flex justify-center items-center">
          <Image
            src={displayImage}
            alt={item.name}
            fill
            sizes="(max-width: 768px) 100vw, 280px"
            className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
          />
        </div>

        {/* Hover Action Bar (Without Eye Icon) */}
        <div className="absolute right-0 bottom-0 translate-x-full u-w-full flex flex-col gap-2 p-5.5 ease-linear duration-300 group-hover:translate-x-0 z-10">
          <button
            onClick={handleAddToCart}
            aria-label="Add to cart"
            id="addCartOne"
            className="flex items-center justify-center w-9 h-9 rounded-[5px] shadow-1 ease-out duration-200 text-dark bg-white hover:text-white hover:bg-blue"
          >
            <ShoppingCart className="w-4 h-4 text-current" />
          </button>

          <button
            onClick={handleItemToWishList}
            aria-label="Add to wishlist"
            id="addFavOne"
            className="flex items-center justify-center w-9 h-9 rounded-[5px] shadow-1 ease-out duration-200 text-dark bg-white hover:text-white hover:bg-blue"
          >
            <Heart className="w-4 h-4 text-current" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SingleItem;

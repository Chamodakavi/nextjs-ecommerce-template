"use client";
import React from "react";
import Image from "next/image";
import { Product } from "@/types/product";
import { useModalContext } from "@/app/context/QuickViewModalContext";
import { updateQuickView } from "@/redux/features/quickView-slice";
import { addItemToCart } from "@/redux/features/cart-slice";
import { addItemToWishlist } from "@/redux/features/wishlist-slice";
import { updateproductDetails } from "@/redux/features/product-details";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import Link from "next/link";
import { Heart, Star, ShoppingBag } from "lucide-react";

const ProductItem = ({ item }: { item: Product }) => {
  const { openModal } = useModalContext();
  const dispatch = useDispatch<AppDispatch>();

  // Open modal with current product data
  const handleOpenDetailModal = () => {
    dispatch(updateQuickView({ ...item }));
    openModal();
  };

  // Add to cart with mapped properties matching CartItem
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

  // Add to wishlist with mapped properties matching WishlistItem
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

  const handleProductDetails = () => {
    dispatch(
      updateproductDetails({
        ...item,
        title: item.name,
        price: Number(item.cost_price || item.selling_price),
        discountedPrice: Number(item.selling_price),
      }),
    );
  };

  // Display image fallback logic
  const displayImage =
    item.image_url ||
    (item.image_urls && item.image_urls[0]) ||
    "/images/products/product-placeholder.png";

  return (
    <div className="group cursor-pointer">
      {/* Clickable Image Container that triggers detail modal */}
      <div
        onClick={handleOpenDetailModal}
        className="relative overflow-hidden flex items-center justify-center rounded-lg bg-[#F6F7FB] min-h-[270px] mb-4"
      >
        <div className="relative w-[220px] h-[220px]">
          <Image
            src={displayImage}
            alt={item.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            className="object-contain group-hover:scale-105 transition-transform duration-300"
          />
        </div>

        {/* Hover action bar */}
        <div className="absolute left-0 bottom-0 translate-y-full w-full flex items-center justify-center gap-2.5 pb-5 ease-linear duration-200 group-hover:translate-y-0 z-10">
          <button
            type="button"
            onClick={handleAddToCart}
            className="inline-flex items-center gap-2 font-medium text-custom-sm py-[7px] px-5 rounded-[5px] bg-blue text-white ease-out duration-200 hover:bg-blue-dark shadow-sm"
          >
            <ShoppingBag className="w-4 h-4" />
            Add to cart
          </button>

          <button
            type="button"
            onClick={handleItemToWishList}
            aria-label="Add to wishlist"
            className="flex items-center justify-center w-9 h-9 rounded-[5px] shadow-1 ease-out duration-200 text-dark bg-white hover:text-blue hover:bg-gray-50"
          >
            <Heart className="w-4 h-4 text-current" />
          </button>
        </div>
      </div>

      {/* Ratings */}
      <div className="flex items-center gap-2.5 mb-2">
        <div className="flex items-center gap-1 text-[#FBB040]">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="w-3.5 h-3.5 fill-current" />
          ))}
        </div>
        <p className="text-custom-sm text-gray-500">(5.0)</p>
      </div>

      {/* Product Title */}
      <h3
        className="font-medium text-dark ease-out duration-200 hover:text-blue mb-1.5 line-clamp-1"
        onClick={handleProductDetails}
      >
        <Link href={`/shop/${item.custom_product_id || item.id}`}>
          {item.name}
        </Link>
      </h3>

      {/* Price */}
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

export default ProductItem;

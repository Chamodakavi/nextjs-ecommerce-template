"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { Eye, Heart, Star } from "lucide-react";

import { Product } from "@/types/product";
import { useModalContext } from "@/app/context/QuickViewModalContext";
import { updateQuickView } from "@/redux/features/quickView-slice";
import { addItemToCart } from "@/redux/features/cart-slice";
import { addItemToWishlist } from "@/redux/features/wishlist-slice";
import { AppDispatch } from "@/redux/store";
import AddToCartModal from "@/components/Shop/AddToCartModal";

const SingleListItem = ({ item }: { item: Product }) => {
  const { openModal } = useModalContext();
  const dispatch = useDispatch<AppDispatch>();
  const [showCartModal, setShowCartModal] = useState(false);

  // update the QuickView state
  const handleQuickViewUpdate = () => {
    dispatch(updateQuickView({ ...item }));
  };

  // add to cart with mapped properties
  const handleAddToCart = () => {
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

  // add to wishlist with mapped properties
  const handleItemToWishList = () => {
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

  // Safe fallback for product image
  const displayImage =
    item.image_url ||
    (item.image_urls && item.image_urls[0]) ||
    "/images/products/product-placeholder.png";

  return (
    <>
      <div className="group rounded-lg bg-white shadow-1">
        <div className="flex flex-col sm:flex-row">
          {/* Product Image and Overlay Controls */}
          <div className="shadow-list relative overflow-hidden flex items-center justify-center max-w-[270px] w-full min-h-[220px] sm:min-h-[270px] p-4 bg-gray-1">
            <div className="relative w-[200px] h-[200px]">
              <Image
                src={displayImage}
                alt={item.name}
                fill
                sizes="(max-width: 640px) 100vw, 200px"
                className="object-contain group-hover:scale-105 transition-transform duration-300"
              />
            </div>

            <div className="absolute left-0 bottom-0 translate-y-full w-full flex items-center justify-center gap-2.5 pb-5 ease-linear duration-200 group-hover:translate-y-0 z-10">
              <button
                type="button"
                onClick={() => {
                  openModal();
                  handleQuickViewUpdate();
                }}
                aria-label="Quick view product"
                className="flex items-center justify-center w-9 h-9 rounded-[5px] shadow-1 ease-out duration-200 text-dark bg-white hover:text-blue"
              >
                <Eye className="w-4 h-4 text-current" />
              </button>

              <button
                type="button"
                onClick={handleAddToCart}
                className="inline-flex font-medium text-custom-sm py-[7px] px-5 rounded-[5px] bg-blue text-white ease-out duration-200 hover:bg-blue-dark"
              >
                Add to cart
              </button>

              <button
                type="button"
                onClick={handleItemToWishList}
                aria-label="Add to wishlist"
                className="flex items-center justify-center w-9 h-9 rounded-[5px] shadow-1 ease-out duration-200 text-dark bg-white hover:text-blue"
              >
                <Heart className="w-4 h-4 text-current" />
              </button>
            </div>
          </div>

          {/* Product Details and Price */}
          <div className="w-full flex flex-col gap-4 sm:flex-row sm:items-center justify-center sm:justify-between py-5 px-4 sm:px-7.5 lg:pl-11 lg:pr-12">
            <div>
              <h3 className="font-medium text-dark ease-out duration-200 hover:text-blue mb-1.5 line-clamp-1">
                <Link href={`/shop/${item.custom_product_id || item.id}`}>
                  {item.name}
                </Link>
              </h3>

              <span className="flex items-center gap-2 font-medium text-lg">
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

            <div className="flex items-center gap-2.5 mb-2">
              <div className="flex items-center gap-1 text-[#FFA645]">
                {[...Array(5)].map((_, index) => (
                  <Star key={index} className="w-3.5 h-3.5 fill-current" />
                ))}
              </div>

              <p className="text-custom-sm text-gray-500">(5.0)</p>
            </div>
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

export default SingleListItem;

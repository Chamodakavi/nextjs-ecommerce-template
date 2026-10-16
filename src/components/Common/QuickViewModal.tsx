"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useDispatch } from "react-redux";
import {
  X,
  Maximize2,
  Star,
  CheckCircle2,
  Minus,
  Plus,
  Heart,
} from "lucide-react";

import { useModalContext } from "@/app/context/QuickViewModalContext";
import { AppDispatch, useAppSelector } from "@/redux/store";
import { addItemToCart } from "@/redux/features/cart-slice";
import { addItemToWishlist } from "@/redux/features/wishlist-slice";
import { usePreviewSlider } from "@/app/context/PreviewSliderContext";
import { updateproductDetails } from "@/redux/features/product-details";

const QuickViewModal = () => {
  const { isModalOpen, closeModal } = useModalContext();
  const { openPreviewModal } = usePreviewSlider();
  const [quantity, setQuantity] = useState(1);
  const [activePreview, setActivePreview] = useState(0);

  const dispatch = useDispatch<AppDispatch>();

  // Extract selected product from Redux store safely
  const product = useAppSelector((state) => state.quickViewReducer?.value);

  // Close modal when clicking outside of the content container
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as HTMLElement;
      if (!target.closest(".modal-content")) {
        closeModal();
      }
    }

    if (isModalOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      setQuantity(1);
      setActivePreview(0);
    };
  }, [isModalOpen, closeModal]);

  // Prevent crashes if modal is closed or product data is not loaded yet
  if (!isModalOpen || !product) {
    return null;
  }

  // Derive all available images from database fields
  const productImages: string[] =
    product.image_urls && product.image_urls.length > 0
      ? product.image_urls
      : product.image_url
        ? [product.image_url]
        : (product as any)?.imgs?.previews || [
            "/images/products/product-placeholder.png",
          ];

  const currentPreviewImage = productImages[activePreview] || productImages[0];

  const handlePreviewSlider = () => {
    dispatch(updateproductDetails(product));
    openPreviewModal();
  };

  const handleAddToCart = () => {
    dispatch(
      addItemToCart({
        ...product,
        quantity,
      }),
    );
    closeModal();
  };

  const handleAddToWishlist = () => {
    dispatch(
      addItemToWishlist({
        ...product,
        status: "available",
        quantity: 1,
      }),
    );
  };

  return (
    <div className="fixed top-0 left-0 z-99999 overflow-y-auto no-scrollbar w-full h-screen sm:py-20 xl:py-25 bg-dark/70 sm:px-8 px-4 py-5 flex items-center justify-center">
      <div className="w-full max-w-[1100px] rounded-xl shadow-3 bg-white p-6 sm:p-7.5 relative modal-content">
        {/* Close Button */}
        <button
          onClick={closeModal}
          aria-label="Close modal"
          className="absolute top-4 right-4 sm:top-6 sm:right-6 flex items-center justify-center w-10 h-10 rounded-full transition-colors duration-150 bg-gray-2 text-dark hover:bg-gray-3 hover:text-blue z-20"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex flex-wrap items-center gap-8 lg:gap-12.5">
          {/* Left Column: Image Previews */}
          <div className="max-w-[526px] w-full">
            <div className="flex flex-col-reverse sm:flex-row gap-4 sm:gap-5">
              {/* Thumbnails */}
              {productImages.length > 1 && (
                <div className="flex sm:flex-col gap-3 overflow-x-auto sm:overflow-visible">
                  {productImages.map((img, key) => (
                    <button
                      onClick={() => setActivePreview(key)}
                      key={key}
                      className={`flex-shrink-0 flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 overflow-hidden rounded-lg bg-gray-1 transition-all duration-200 border-2 ${
                        activePreview === key
                          ? "border-blue"
                          : "border-transparent hover:border-gray-4"
                      }`}
                    >
                      <Image
                        src={img}
                        alt={`${product.name} thumbnail ${key + 1}`}
                        width={60}
                        height={60}
                        className="object-contain aspect-square"
                      />
                    </button>
                  ))}
                </div>
              )}

              {/* Main Active Preview */}
              <div className="relative z-1 overflow-hidden flex items-center justify-center w-full min-h-[300px] sm:min-h-[460px] bg-gray-1 rounded-lg border border-gray-3 p-4">
                <button
                  onClick={handlePreviewSlider}
                  aria-label="Zoom image"
                  className="w-10 h-10 rounded-[5px] bg-white shadow-1 flex items-center justify-center transition-colors duration-200 text-dark hover:text-blue absolute top-4 right-4 z-10"
                >
                  <Maximize2 className="w-4 h-4" />
                </button>

                <div className="relative w-full h-[280px] sm:h-[400px]">
                  <Image
                    src={currentPreviewImage}
                    alt={product.name || "Product preview"}
                    fill
                    sizes="(max-width: 768px) 100vw, 500px"
                    className="object-contain"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Product Details */}
          <div className="max-w-[445px] w-full">
            {product.category && (
              <span className="inline-block text-custom-xs font-semibold uppercase tracking-wider text-blue py-1 px-3 bg-blue/10 rounded mb-4">
                {product.category}
              </span>
            )}

            <h3 className="font-semibold text-xl xl:text-heading-5 text-dark mb-3">
              {product.name}
            </h3>

            {/* Ratings & Stock Badge */}
            <div className="flex flex-wrap items-center gap-5 mb-5">
              <div className="flex items-center gap-1.5">
                <div className="flex items-center gap-1 text-[#FFA645]">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <span className="text-custom-sm font-medium text-dark">
                  5.0{" "}
                  <span className="text-dark-2 font-normal">(5 reviews)</span>
                </span>
              </div>

              <div className="flex items-center gap-1.5 text-green">
                <CheckCircle2 className="w-4 h-4" />
                <span className="font-medium text-custom-sm text-dark">
                  {product.availability_status || "In Stock"}
                </span>
              </div>
            </div>

            {/* Description */}
            <p className="text-body-color text-sm sm:text-base mb-6 line-clamp-3">
              {product.description ||
                "High quality automotive component designed for exceptional performance and durability."}
            </p>

            {/* Price and Counter */}
            <div className="flex flex-wrap justify-between items-end gap-5 mb-8 pb-6 border-b border-gray-3">
              <div>
                <h4 className="font-medium text-xs text-dark-4 uppercase tracking-wider mb-2">
                  Price
                </h4>
                <div className="flex items-center gap-3">
                  <span className="font-bold text-dark text-2xl xl:text-heading-4">
                    Rs. {Number(product.selling_price || 0).toLocaleString()}
                  </span>
                  {product.cost_price &&
                    Number(product.cost_price) >
                      Number(product.selling_price) && (
                      <span className="font-medium text-dark-4 text-lg line-through">
                        Rs. {Number(product.cost_price).toLocaleString()}
                      </span>
                    )}
                </div>
              </div>

              {/* Quantity Counter */}
              <div>
                <h4 className="font-medium text-xs text-dark-4 uppercase tracking-wider mb-2">
                  Quantity
                </h4>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                    aria-label="Decrease quantity"
                    className="flex items-center justify-center w-10 h-10 rounded-md bg-gray-2 text-dark transition-colors hover:bg-gray-3 hover:text-blue disabled:opacity-50"
                    disabled={quantity <= 1}
                  >
                    <Minus className="w-4 h-4" />
                  </button>

                  <span className="flex items-center justify-center w-12 h-10 rounded-md border border-gray-4 bg-white font-semibold text-dark text-sm">
                    {quantity}
                  </span>

                  <button
                    type="button"
                    onClick={() => setQuantity((prev) => prev + 1)}
                    aria-label="Increase quantity"
                    className="flex items-center justify-center w-10 h-10 rounded-md bg-gray-2 text-dark transition-colors hover:bg-gray-3 hover:text-blue"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={handleAddToCart}
                className="flex-1 inline-flex justify-center items-center font-medium text-white bg-blue py-3 px-6 rounded-md transition duration-200 hover:bg-blue-dark shadow-sm"
              >
                Add to Cart
              </button>

              <button
                type="button"
                onClick={handleAddToWishlist}
                className="inline-flex items-center gap-2 font-medium text-white bg-dark py-3 px-5 rounded-md transition duration-200 hover:bg-opacity-90"
              >
                <Heart className="w-4 h-4" />
                Wishlist
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickViewModal;

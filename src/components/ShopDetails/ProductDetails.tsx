"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useDispatch } from "react-redux";
import {
  Star,
  CheckCircle2,
  Minus,
  Plus,
  Heart,
  ShoppingBag,
} from "lucide-react";
import Breadcrumb from "@/components/Common/Breadcrumb";
import { addItemToCart } from "@/redux/features/cart-slice";
import { addItemToWishlist } from "@/redux/features/wishlist-slice";
import AddToCartModal from "@/components/Shop/AddToCartModal";
import AddToWishlistModal from "@/components/Common/AddToWishlistModal";
import { AppDispatch } from "@/redux/store";

const ProductDetails = ({ product }: { product: any }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [quantity, setQuantity] = useState(1);
  const [activePreview, setActivePreview] = useState(0);
  const [showCartAlert, setShowCartAlert] = useState(false);
  const [showWishlistAlert, setShowWishlistAlert] = useState(false);

  // Normalize image sources
  const productImages: string[] =
    product.image_urls && product.image_urls.length > 0
      ? product.image_urls
      : product.image_url
        ? [product.image_url]
        : product.imgs?.previews || [
            "/images/products/product-placeholder.png",
          ];

  const currentPreviewImage = productImages[activePreview] || productImages[0];
  const itemPrice = product.selling_price || product.price || 0;
  const costPrice = product.cost_price || product.discountedPrice;

  const handleAddToCart = () => {
    dispatch(
      addItemToCart({
        ...product,
        title: product.name || product.title,
        price: Number(costPrice || itemPrice),
        discountedPrice: Number(itemPrice),
        quantity,
      }),
    );
    setShowCartAlert(true);
  };

  const handleAddToWishlist = () => {
    dispatch(
      addItemToWishlist({
        ...product,
        title: product.name || product.title,
        price: Number(costPrice || itemPrice),
        discountedPrice: Number(itemPrice),
        status: product.availability_status || "available",
        quantity: 1,
      }),
    );
    setShowWishlistAlert(true);
  };

  return (
    <>
      <Breadcrumb
        title={product.name || product.title || "Product Details"}
        pages={["Shop", product.name || product.title]}
      />

      <section className="py-12 sm:py-16 lg:py-20 bg-gray-2">
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
          <div className="bg-white rounded-xl shadow-1 p-6 sm:p-8 lg:p-10">
            <div className="flex flex-col lg:flex-row gap-8 lg:gap-12.5 items-start">
              {/* Left Column: Image Gallery */}
              <div className="w-full lg:max-w-[520px]">
                <div className="flex flex-col-reverse sm:flex-row gap-4">
                  {/* Thumbnails */}
                  {productImages.length > 1 && (
                    <div className="flex sm:flex-col gap-3 overflow-x-auto sm:overflow-visible">
                      {productImages.map((img, key) => (
                        <button
                          key={key}
                          onClick={() => setActivePreview(key)}
                          className={`flex-shrink-0 flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-lg bg-gray-1 border-2 transition-all ${
                            activePreview === key
                              ? "border-blue"
                              : "border-transparent hover:border-gray-3"
                          }`}
                        >
                          <Image
                            src={img}
                            alt="thumbnail"
                            width={60}
                            height={60}
                            className="object-contain"
                          />
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Main Preview */}
                  <div className="relative w-full h-[320px] sm:h-[420px] rounded-lg bg-gray-1 border border-gray-3 flex items-center justify-center p-4">
                    <Image
                      src={currentPreviewImage}
                      alt={product.name || "Product"}
                      fill
                      sizes="(max-width: 768px) 100vw, 500px"
                      className="object-contain p-2"
                      unoptimized={currentPreviewImage.startsWith("http")}
                    />
                  </div>
                </div>
              </div>

              {/* Right Column: Information & Actions */}
              <div className="w-full lg:max-w-[550px]">
                {product.category && (
                  <span className="inline-block text-xs font-semibold uppercase tracking-wider text-blue py-1 px-3 bg-blue/10 rounded mb-3">
                    {product.category}
                  </span>
                )}

                <h1 className="font-semibold text-2xl sm:text-3xl text-dark mb-3">
                  {product.name || product.title}
                </h1>

                {/* Rating & Stock */}
                <div className="flex flex-wrap items-center gap-5 mb-5">
                  <div className="flex items-center gap-1.5">
                    <div className="flex items-center gap-1 text-[#FFA645]">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-current" />
                      ))}
                    </div>
                    <span className="text-sm font-medium text-dark">5.0</span>
                  </div>

                  <div className="flex items-center gap-1.5 text-green-600">
                    <CheckCircle2 className="w-4 h-4" />
                    <span className="font-medium text-sm text-dark">
                      {product.availability_status || "In Stock"}
                    </span>
                  </div>
                </div>

                <p className="text-gray-600 text-sm sm:text-base mb-6 leading-relaxed">
                  {product.description ||
                    "High quality automotive component designed for exceptional performance and durability."}
                </p>

                {/* Price & Quantity */}
                <div className="flex flex-wrap justify-between items-end gap-5 mb-8 pb-6 border-b border-gray-3">
                  <div>
                    <span className="block text-xs uppercase text-gray-400 font-medium mb-1">
                      Price
                    </span>
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-dark text-2xl sm:text-3xl">
                        Rs. {Number(itemPrice).toLocaleString()}
                      </span>
                      {costPrice && Number(costPrice) > Number(itemPrice) && (
                        <span className="text-gray-400 line-through text-lg font-medium">
                          Rs. {Number(costPrice).toLocaleString()}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Quantity Controls */}
                  <div>
                    <span className="block text-xs uppercase text-gray-400 font-medium mb-1">
                      Quantity
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          setQuantity((prev) => Math.max(1, prev - 1))
                        }
                        disabled={quantity <= 1}
                        className="w-10 h-10 rounded-md bg-gray-1 border border-gray-3 flex items-center justify-center text-dark hover:bg-gray-2 disabled:opacity-40"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-12 h-10 rounded-md border border-gray-3 flex items-center justify-center font-semibold text-dark text-sm bg-white">
                        {quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => setQuantity((prev) => prev + 1)}
                        className="w-10 h-10 rounded-md bg-gray-1 border border-gray-3 flex items-center justify-center text-dark hover:bg-gray-2"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-wrap items-center gap-4">
                  <button
                    type="button"
                    onClick={handleAddToCart}
                    className="flex-1 inline-flex justify-center items-center gap-2 font-medium text-white bg-blue py-3.5 px-6 rounded-md transition duration-200 hover:bg-blue-dark shadow-sm"
                  >
                    <ShoppingBag className="w-5 h-5" />
                    Add to Cart
                  </button>

                  <button
                    type="button"
                    onClick={handleAddToWishlist}
                    className="inline-flex items-center gap-2 font-medium text-white bg-dark py-3.5 px-5 rounded-md transition duration-200 hover:bg-opacity-90"
                  >
                    <Heart className="w-5 h-5" />
                    Wishlist
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Modals */}
      <AddToCartModal
        isOpen={showCartAlert}
        onClose={() => setShowCartAlert(false)}
        productName={product.name || product.title}
      />
      <AddToWishlistModal
        isOpen={showWishlistAlert}
        onClose={() => setShowWishlistAlert(false)}
        productName={product.name || product.title}
      />
    </>
  );
};

export default ProductDetails;

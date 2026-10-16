"use client";

import React from "react";
import Image from "next/image";
import { useDispatch } from "react-redux";
import { Trash2 } from "lucide-react";

import { AppDispatch } from "@/redux/store";

interface CartItem {
  id: string | number;
  custom_product_id?: string | number;
  image_url?: string;
  image_urls?: string[];
  img?: string;
  title?: string;
  name?: string;
  quantity: number;
  discountedPrice?: number;
  price?: number;
  selling_price?: number;
}

interface SingleItemProps {
  item: CartItem;
  removeItemFromCart: (id: string | number) => any;
}

const SingleItem: React.FC<SingleItemProps> = ({
  item,
  removeItemFromCart,
}) => {
  const dispatch = useDispatch<AppDispatch>();

  const handleRemoveFromCart = () => {
    dispatch(removeItemFromCart(item.id));
  };

  const displayImage =
    item.image_url ||
    (item.image_urls && item.image_urls[0]) ||
    item.img ||
    "/images/products/product-placeholder.png";

  const price = item.discountedPrice || item.price || item.selling_price || 0;

  return (
    <div className="flex items-center justify-between gap-5 py-2">
      <div className="w-full flex items-center gap-4">
        <div className="relative flex items-center justify-center rounded-[10px] bg-gray-1 max-w-[80px] w-full h-20 overflow-hidden border border-gray-3 shrink-0">
          <Image
            src={displayImage}
            alt={item.title || item.name || "Product image"}
            fill
            sizes="80px"
            className="object-contain p-2"
          />
        </div>

        <div className="flex-1">
          <h3 className="font-medium text-dark text-sm mb-1 line-clamp-1 ease-out duration-200 hover:text-blue">
            <a href={`/shop/${item.custom_product_id || item.id}`}>
              {item.title || item.name}
            </a>
          </h3>
          <p className="text-custom-sm text-gray-600">
            Qty: <span className="text-dark font-medium">{item.quantity}</span>
          </p>
          <p className="text-custom-sm font-medium text-dark mt-0.5">
            Rs. {Number(price).toLocaleString()}
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={handleRemoveFromCart}
        aria-label="Remove item from cart"
        className="flex items-center justify-center rounded-lg w-9 h-9 bg-gray-2 border border-gray-3 text-dark ease-out duration-200 hover:bg-red-50 hover:border-red-200 hover:text-red shrink-0"
      >
        <Trash2 className="w-4 h-4 text-current" />
      </button>
    </div>
  );
};

export default SingleItem;

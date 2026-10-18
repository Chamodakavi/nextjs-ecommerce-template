import React, { useState } from "react";
import { AppDispatch } from "@/redux/store";
import { useDispatch } from "react-redux";
import {
  removeItemFromCart,
  updateCartItemQuantity,
} from "@/redux/features/cart-slice";
import Image from "next/image";
import { Minus, Plus, Trash2 } from "lucide-react";

const SingleItem = ({ item }: { item: any }) => {
  const [quantity, setQuantity] = useState(item.quantity || 1);
  const dispatch = useDispatch<AppDispatch>();

  const handleRemoveFromCart = () => {
    dispatch(removeItemFromCart(item.id));
  };

  const handleIncreaseQuantity = () => {
    const nextQty = quantity + 1;
    setQuantity(nextQty);
    dispatch(updateCartItemQuantity({ id: item.id, quantity: nextQty }));
  };

  const handleDecreaseQuantity = () => {
    if (quantity > 1) {
      const nextQty = quantity - 1;
      setQuantity(nextQty);
      dispatch(updateCartItemQuantity({ id: item.id, quantity: nextQty }));
    }
  };

  // Comprehensive fallback strategy for product image resolution
  const displayImage =
    item.image_url ||
    (item.image_urls && item.image_urls[0]) ||
    "/images/products/product-placeholder.png";

  const itemPrice =
    item.discountedPrice || item.selling_price || item.price || 0;

  return (
    <div className="flex items-center border-t border-gray-3 py-5 px-7.5">
      {/* Product Image & Title */}
      <div className="min-w-[400px]">
        <div className="flex items-center justify-between gap-5">
          <div className="w-full flex items-center gap-5.5">
            <div className="relative flex items-center justify-center rounded-[5px] bg-gray-2 max-w-[80px] w-full h-17.5 overflow-hidden shrink-0">
              <Image
                width={80}
                height={70}
                src={displayImage}
                alt={item.title || item.name || "Product image"}
                className="object-contain p-1 w-auto h-auto max-h-full max-w-full"
              />
            </div>

            <div>
              <h3 className="text-dark ease-out duration-200 hover:text-blue font-medium line-clamp-2">
                <a href={`/shop/${item.custom_product_id || item.id}`}>
                  {item.title || item.name}
                </a>
              </h3>
            </div>
          </div>
        </div>
      </div>

      {/* Unit Price */}
      <div className="min-w-[180px]">
        <p className="text-dark font-medium">
          Rs. {Number(itemPrice).toLocaleString()}
        </p>
      </div>

      {/* Quantity Controls */}
      <div className="min-w-[275px]">
        <div className="w-max flex items-center rounded-md border border-gray-3 bg-white">
          <button
            type="button"
            onClick={handleDecreaseQuantity}
            disabled={quantity <= 1}
            aria-label="Decrease quantity"
            className="flex items-center justify-center w-11.5 h-11.5 ease-out duration-200 text-dark hover:text-blue disabled:opacity-40"
          >
            <Minus className="w-4 h-4" />
          </button>

          <span className="flex items-center justify-center w-16 h-11.5 border-x border-gray-3 font-semibold text-dark text-sm">
            {quantity}
          </span>

          <button
            type="button"
            onClick={handleIncreaseQuantity}
            aria-label="Increase quantity"
            className="flex items-center justify-center w-11.5 h-11.5 ease-out duration-200 text-dark hover:text-blue"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Subtotal */}
      <div className="min-w-[200px]">
        <p className="text-dark font-semibold">
          Rs. {Number(itemPrice * quantity).toLocaleString()}
        </p>
      </div>

      {/* Remove Action */}
      <div className="min-w-[50px] flex justify-end">
        <button
          type="button"
          onClick={handleRemoveFromCart}
          aria-label="Remove item from cart"
          className="flex items-center justify-center rounded-lg w-9.5 h-9.5 bg-gray-2 border border-gray-3 text-dark ease-out duration-200 hover:bg-red hover:border-red hover:text-white"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default SingleItem;

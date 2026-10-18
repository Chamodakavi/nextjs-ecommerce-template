"use client";

import React, { useEffect, useState } from "react";
import { Heart, Loader2 } from "lucide-react";

interface AddToWishlistModalProps {
  isOpen: boolean;
  onClose: () => void;
  productName?: string;
}

const AddToWishlistModal: React.FC<AddToWishlistModalProps> = ({
  isOpen,
  onClose,
  productName,
}) => {
  const [status, setStatus] = useState<"loading" | "success">("loading");

  useEffect(() => {
    if (isOpen) {
      setStatus("loading");

      const timer1 = setTimeout(() => {
        setStatus("success");
      }, 500);

      const timer2 = setTimeout(() => {
        onClose();
      }, 1300);

      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
      };
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-99999 flex items-center justify-center bg-black/40 backdrop-blur-xs transition-opacity duration-200">
      <div className="bg-white rounded-2xl p-6 w-[280px] sm:w-[320px] shadow-2xl flex flex-col items-center justify-center text-center animate-in fade-in zoom-in-95 duration-200 wishlist-alert-modal">
        <div className="relative flex items-center justify-center w-16 h-16 mb-4">
          {status === "loading" ? (
            <div className="flex items-center justify-center w-14 h-14 rounded-full bg-red-50">
              <Loader2 className="w-8 h-8 text-red animate-spin" />
            </div>
          ) : (
            <div className="flex items-center justify-center w-14 h-14 rounded-full bg-red text-white animate-in zoom-in-75 duration-200">
              <Heart className="w-8 h-8 fill-current" />
            </div>
          )}
        </div>

        <h4 className="font-semibold text-dark text-base sm:text-lg mb-1">
          {status === "loading" ? "Saving..." : "Added to Wishlist!"}
        </h4>

        {productName && (
          <p className="text-xs sm:text-sm text-gray-500 line-clamp-1 max-w-[240px]">
            {productName}
          </p>
        )}
      </div>
    </div>
  );
};

export default AddToWishlistModal;

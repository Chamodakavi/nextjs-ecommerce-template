import { configureStore } from "@reduxjs/toolkit";
import quickViewReducer from "./features/quickView-slice";
import cartReducer from "./features/cart-slice";
import wishlistReducer from "./features/wishlist-slice";
import productDetailsReducer from "./features/product-details";
import { TypedUseSelectorHook, useSelector } from "react-redux";
import { onCartStateChanged } from "@/lib/supabase/cartSync";
import { onWishlistStateChanged } from "@/lib/supabase/wishlistSync";

// Load persisted state from localStorage
const loadState = () => {
  if (typeof window === "undefined") return undefined;
  try {
    const serializedCart = localStorage.getItem("cart_items");
    const serializedWishlist = localStorage.getItem("wishlist_items");

    return {
      cartReducer: {
        items: serializedCart ? JSON.parse(serializedCart) : [],
      },
      wishlistReducer: {
        items: serializedWishlist ? JSON.parse(serializedWishlist) : [],
      },
    };
  } catch (e) {
    console.error("Error loading state from localStorage", e);
    return undefined;
  }
};

export const store = configureStore({
  reducer: {
    quickViewReducer,
    cartReducer,
    wishlistReducer,
    productDetailsReducer,
  },
  preloadedState: loadState(),
});

// Save cart and wishlist to localStorage on state change & trigger DB sync if user is active
if (typeof window !== "undefined") {
  let prevCartItems = store.getState().cartReducer.items;
  let prevWishlistItems = store.getState().wishlistReducer.items;

  store.subscribe(() => {
    try {
      const state = store.getState();
      const currentCartItems = state.cartReducer.items;
      const currentWishlistItems = state.wishlistReducer.items;

      localStorage.setItem(
        "cart_items",
        JSON.stringify(currentCartItems),
      );
      localStorage.setItem(
        "wishlist_items",
        JSON.stringify(currentWishlistItems),
      );

      // Trigger automatic DB sync if state changed
      if (currentCartItems !== prevCartItems) {
        prevCartItems = currentCartItems;
        onCartStateChanged(currentCartItems);
      }

      if (currentWishlistItems !== prevWishlistItems) {
        prevWishlistItems = currentWishlistItems;
        onWishlistStateChanged(currentWishlistItems);
      }
    } catch (e) {
      console.error("Error saving state to localStorage", e);
    }
  });
}

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

import { configureStore } from "@reduxjs/toolkit";
import quickViewReducer from "./features/quickView-slice";
import cartReducer from "./features/cart-slice";
import wishlistReducer from "./features/wishlist-slice";
import productDetailsReducer from "./features/product-details";
import { TypedUseSelectorHook, useSelector } from "react-redux";

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

// Save cart and wishlist to localStorage on state change
if (typeof window !== "undefined") {
  store.subscribe(() => {
    try {
      const state = store.getState();
      localStorage.setItem(
        "cart_items",
        JSON.stringify(state.cartReducer.items),
      );
      localStorage.setItem(
        "wishlist_items",
        JSON.stringify(state.wishlistReducer.items),
      );
    } catch (e) {
      console.error("Error saving state to localStorage", e);
    }
  });
}

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

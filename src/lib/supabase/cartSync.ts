import { getSupabaseBrowserClient } from "./auth";
import { store } from "@/redux/store";
import {
  addItemToCart,
  removeAllItemsFromCart,
} from "@/redux/features/cart-slice";

/**
 * Pushes local Redux cart items to Supabase when user logs in
 */
export async function syncReduxCartToSupabase(userId: string) {
  const supabase = getSupabaseBrowserClient();
  const localCartItems = store.getState().cartReducer.items;

  // 1. Get or create user cart
  let { data: cart } = await supabase
    .from("carts")
    .select("id")
    .eq("user_id", userId)
    .single();

  if (!cart) {
    const { data: newCart, error } = await supabase
      .from("carts")
      .insert({ user_id: userId })
      .select("id")
      .single();

    if (error || !newCart) {
      console.error("Failed to create cart in Supabase:", error);
      return;
    }
    cart = newCart;
  }

  // 2. Sync local items to Supabase
  if (localCartItems.length > 0) {
    for (const item of localCartItems) {
      await supabase.from("cart_items").upsert(
        {
          cart_id: cart.id,
          product_id: String(item.id),
          quantity: item.quantity,
        },
        { onConflict: "cart_id, product_id" },
      );
    }
  }

  // 3. Fetch full synced cart back from Supabase to hydrate state
  await fetchSupabaseCartToRedux(userId);
}

/**
 * Pulls database cart items from Supabase into Redux store
 */
export async function fetchSupabaseCartToRedux(userId: string) {
  const supabase = getSupabaseBrowserClient();

  const { data: cart } = await supabase
    .from("carts")
    .select("id, cart_items(*)")
    .eq("user_id", userId)
    .single();

  if (cart && cart.cart_items) {
    // Clear existing local items first
    store.dispatch(removeAllItemsFromCart());

    // Populate Redux with database cart items
    for (const dbItem of cart.cart_items) {
      // Fetch product details for full rendering data
      const { data: product } = await supabase
        .from("products")
        .select("*")
        .eq("id", dbItem.product_id)
        .single();

      if (product) {
        store.dispatch(
          addItemToCart({
            id: Number(product.id),
            title: product.name || product.title,
            price: product.price,
            discountedPrice: product.discounted_price || product.price,
            quantity: dbItem.quantity,
            imgs: {
              thumbnails: [
                product.image_url || "/images/product/product-01.jpg",
              ],
              previews: [product.image_url || "/images/product/product-01.jpg"],
            },
          }),
        );
      }
    }
  }
}

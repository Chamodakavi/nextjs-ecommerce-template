import { getSupabaseBrowserClient } from "./auth";
import { store } from "@/redux/store";
import {
  addItemToCart,
  removeAllItemsFromCart,
} from "@/redux/features/cart-slice";

/**
 * Sync local Redux cart to Supabase on login, then pull total synced cart back to Redux
 */
export async function syncReduxCartToSupabase(userId: string) {
  const supabase = getSupabaseBrowserClient();
  const localCartItems = store.getState().cartReducer.items;

  // 1. Fetch or create user cart record in Supabase
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
      console.error("Failed to create database cart:", error);
      return;
    }
    cart = newCart;
  }

  // 2. Upsert local guest items (if any) to Supabase database
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

  // 3. Pull all database cart items into Redux for cross-device consistency
  await fetchSupabaseCartToRedux(userId);
}

/**
 * Fetch cart items stored in Supabase into Redux store
 */
export async function fetchSupabaseCartToRedux(userId: string) {
  const supabase = getSupabaseBrowserClient();

  // Retrieve user cart along with its items
  const { data: cart } = await supabase
    .from("carts")
    .select("id, cart_items(*)")
    .eq("user_id", userId)
    .single();

  if (cart && cart.cart_items && cart.cart_items.length > 0) {
    // Clear initial empty/local Redux state
    store.dispatch(removeAllItemsFromCart());

    // Fetch product details for each item to populate state
    for (const dbItem of cart.cart_items) {
      const { data: product } = await supabase
        .from("products")
        .select("*")
        .eq("id", dbItem.product_id)
        .single();

      if (product) {
        store.dispatch(
          addItemToCart({
            id: Number(product.id),
            title: product.name,
            price: product.cost_price || product.selling_price,
            discountedPrice: product.selling_price,
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

/**
 * Add or update item in Supabase database cart directly for active logged-in users
 */
export async function addOrUpdateDatabaseCartItem(
  userId: string,
  productId: number | string,
  quantity: number,
) {
  const supabase = getSupabaseBrowserClient();

  let { data: cart } = await supabase
    .from("carts")
    .select("id")
    .eq("user_id", userId)
    .single();

  if (!cart) {
    const { data: newCart } = await supabase
      .from("carts")
      .insert({ user_id: userId })
      .select("id")
      .single();
    cart = newCart;
  }

  if (cart) {
    await supabase.from("cart_items").upsert(
      {
        cart_id: cart.id,
        product_id: String(productId),
        quantity: quantity,
      },
      { onConflict: "cart_id, product_id" },
    );
  }
}

/**
 * Remove item from Supabase database cart directly
 */
export async function removeDatabaseCartItem(
  userId: string,
  productId: number | string,
) {
  const supabase = getSupabaseBrowserClient();

  const { data: cart } = await supabase
    .from("carts")
    .select("id")
    .eq("user_id", userId)
    .single();

  if (cart) {
    await supabase
      .from("cart_items")
      .delete()
      .eq("cart_id", cart.id)
      .eq("product_id", String(productId));
  }
}

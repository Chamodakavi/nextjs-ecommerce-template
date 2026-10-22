import { getSupabaseBrowserClient } from "./auth";
import { store } from "@/redux/store";
import {
  setCartItems,
  removeAllItemsFromCart,
  addItemToCart,
} from "@/redux/features/cart-slice";

export type CartItem = {
  id: number;
  title: string;
  price: number;
  discountedPrice: number;
  quantity: number;
  imgs?: {
    thumbnails: string[];
    previews: string[];
  };
};

let activeCartUserId: string | null = null;
let isCartHydrating = false;
let cartDebounceTimeout: NodeJS.Timeout | null = null;

export function setActiveCartUserId(userId: string | null) {
  activeCartUserId = userId;
}

export function getActiveCartUserId(): string | null {
  return activeCartUserId;
}

export function setIsCartHydrating(val: boolean) {
  isCartHydrating = val;
}

/**
 * Helper to fetch or create the user's cart record in Supabase
 */
export async function getOrCreateUserCartId(
  userId: string,
): Promise<string | null> {
  const supabase = getSupabaseBrowserClient();

  try {
    const { data: cart, error: selectErr } = await supabase
      .from("carts")
      .select("id")
      .eq("user_id", userId)
      .maybeSingle();

    if (selectErr) {
      console.error("[CartSync] Error finding cart:", selectErr);
      return null;
    }

    if (cart?.id) {
      return cart.id;
    }

    const { data: newCart, error: insertErr } = await supabase
      .from("carts")
      .insert({ user_id: userId })
      .select("id")
      .maybeSingle();

    if (newCart?.id) {
      return newCart.id;
    }

    // Re-check in case of concurrent insert
    const { data: retryCart } = await supabase
      .from("carts")
      .select("id")
      .eq("user_id", userId)
      .maybeSingle();

    return retryCart?.id || null;
  } catch (err) {
    console.error("[CartSync] Exception in getOrCreateUserCartId:", err);
    return null;
  }
}

/**
 * Synchronize local Redux cart with Supabase database on login,
 * merging any guest cart items into the database and hydrating Redux.
 */
export async function syncReduxCartToSupabase(userId: string) {
  setActiveCartUserId(userId);
  const supabase = getSupabaseBrowserClient();
  const localCartItems = store.getState().cartReducer.items;

  const cartId = await getOrCreateUserCartId(userId);
  if (!cartId) {
    return;
  }

  // Merge any local guest items into Supabase cart
  if (localCartItems.length > 0) {
    const { data: existingItems } = await supabase
      .from("cart_items")
      .select("id, product_id, quantity")
      .eq("cart_id", cartId);

    const existingMap = new Map<string, any>(
      (existingItems || []).map((i: any) => [String(i.product_id), i]),
    );

    for (const item of localCartItems) {
      const pId = String(item.id);
      const existing = existingMap.get(pId);

      if (existing) {
        // Merge quantities if user already had this item in their account cart
        const newQty = existing.quantity + item.quantity;
        await supabase
          .from("cart_items")
          .update({
            quantity: newQty,
            updated_at: new Date().toISOString(),
          })
          .eq("id", existing.id);
      } else {
        await supabase.from("cart_items").insert({
          cart_id: cartId,
          product_id: pId,
          quantity: item.quantity,
        });
      }
    }
  }

  // Fetch full unified cart back into Redux
  await fetchSupabaseCartToRedux(userId);
}

/**
 * Fetch cart items stored in Supabase into Redux store
 */
export async function fetchSupabaseCartToRedux(userId: string) {
  const supabase = getSupabaseBrowserClient();

  const cartId = await getOrCreateUserCartId(userId);
  if (!cartId) {
    return [];
  }

  const { data: cart, error } = await supabase
    .from("carts")
    .select("id, cart_items(*)")
    .eq("id", cartId)
    .maybeSingle();

  if (error) {
    console.error("[CartSync] Error fetching cart items:", error);
    return [];
  }

  if (cart && cart.cart_items) {
    if (cart.cart_items.length === 0) {
      setIsCartHydrating(true);
      store.dispatch(setCartItems([]));
      setIsCartHydrating(false);
      return [];
    }

    const productIds = cart.cart_items.map((i: any) => i.product_id);
    const { data: products } = await supabase
      .from("products")
      .select("*")
      .in("id", productIds);

    const productsMap = new Map<string, any>(
      (products || []).map((p: any) => [String(p.id), p]),
    );

    const mappedItems: CartItem[] = [];
    for (const dbItem of cart.cart_items) {
      const product = productsMap.get(String(dbItem.product_id));
      if (product) {
        mappedItems.push({
          id: Number(product.id),
          title: product.name,
          price: Number(product.cost_price || product.selling_price),
          discountedPrice: Number(product.selling_price),
          quantity: Number(dbItem.quantity || 1),
          imgs: {
            thumbnails: [
              product.image_url ||
                (product.image_urls && product.image_urls[0]) ||
                "/images/products/product-placeholder.png",
            ],
            previews:
              product.image_urls && product.image_urls.length > 0
                ? product.image_urls
                : [
                    product.image_url ||
                      "/images/products/product-placeholder.png",
                  ],
          },
        });
      }
    }

    setIsCartHydrating(true);
    store.dispatch(setCartItems(mappedItems));
    setIsCartHydrating(false);
    return mappedItems;
  }

  return [];
}

/**
 * Persist the current full Redux cart state to Supabase for the authenticated user
 */
export async function persistCartToSupabase(
  userId: string,
  items: CartItem[],
) {
  if (isCartHydrating) return;
  const cartId = await getOrCreateUserCartId(userId);
  if (!cartId) return;

  const supabase = getSupabaseBrowserClient();

  const { data: dbItems, error: fetchErr } = await supabase
    .from("cart_items")
    .select("id, product_id, quantity")
    .eq("cart_id", cartId);

  if (fetchErr) {
    console.error("[CartSync] Error fetching existing cart items:", fetchErr);
    return;
  }

  const existingMap = new Map<string, any>(
    (dbItems || []).map((dbItem: any) => [String(dbItem.product_id), dbItem]),
  );

  // Upsert each item from Redux to Supabase
  for (const item of items) {
    const pId = String(item.id);
    const existing = existingMap.get(pId);

    if (existing) {
      if (existing.quantity !== item.quantity) {
        await supabase
          .from("cart_items")
          .update({
            quantity: item.quantity,
            updated_at: new Date().toISOString(),
          })
          .eq("id", existing.id);
      }
    } else {
      await supabase.from("cart_items").insert({
        cart_id: cartId,
        product_id: pId,
        quantity: item.quantity,
      });
    }
  }

  // Delete items from Supabase that were removed from Redux
  const activeProductIds = new Set(items.map((i) => String(i.id)));
  const toDelete = (dbItems || []).filter(
    (dbItem: any) => !activeProductIds.has(String(dbItem.product_id)),
  );

  if (toDelete.length > 0) {
    const idsToDelete = toDelete.map((i: any) => i.id);
    await supabase.from("cart_items").delete().in("id", idsToDelete);
  }
}

/**
 * Called automatically whenever Redux cart state changes. Debounces DB writes.
 */
export function onCartStateChanged(items: CartItem[]) {
  if (isCartHydrating || !activeCartUserId) return;
  if (cartDebounceTimeout) clearTimeout(cartDebounceTimeout);

  cartDebounceTimeout = setTimeout(() => {
    if (activeCartUserId) {
      persistCartToSupabase(activeCartUserId, items).catch((err) =>
        console.error("[CartSync] Error persisting cart to Supabase:", err),
      );
    }
  }, 300);
}

/**
 * Realtime Subscription: listens for cart_items changes across devices
 */
export function subscribeToCartChanges(userId: string) {
  const supabase = getSupabaseBrowserClient();

  const channel = supabase
    .channel("realtime_cart_changes")
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "cart_items",
      },
      () => {
        if (!isCartHydrating && activeCartUserId === userId) {
          fetchSupabaseCartToRedux(userId);
        }
      },
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}

/**
 * Directly add or update an item in Supabase database cart for active logged-in user
 */
export async function addOrUpdateDatabaseCartItem(
  userId: string,
  productId: number | string,
  quantity: number,
) {
  const cartId = await getOrCreateUserCartId(userId);
  if (!cartId) return;

  const supabase = getSupabaseBrowserClient();
  const pId = String(productId);

  const { data: existing } = await supabase
    .from("cart_items")
    .select("id, quantity")
    .eq("cart_id", cartId)
    .eq("product_id", pId)
    .maybeSingle();

  if (existing) {
    await supabase
      .from("cart_items")
      .update({
        quantity: quantity,
        updated_at: new Date().toISOString(),
      })
      .eq("id", existing.id);
  } else {
    await supabase.from("cart_items").insert({
      cart_id: cartId,
      product_id: pId,
      quantity: quantity,
    });
  }
}

/**
 * Directly remove item from Supabase database cart
 */
export async function removeDatabaseCartItem(
  userId: string,
  productId: number | string,
) {
  const cartId = await getOrCreateUserCartId(userId);
  if (!cartId) return;

  const supabase = getSupabaseBrowserClient();
  await supabase
    .from("cart_items")
    .delete()
    .eq("cart_id", cartId)
    .eq("product_id", String(productId));
}

/**
 * Clears all items from the user's database cart in Supabase
 */
export async function clearDatabaseCart(userId: string) {
  const cartId = await getOrCreateUserCartId(userId);
  if (!cartId) return;

  const supabase = getSupabaseBrowserClient();
  await supabase.from("cart_items").delete().eq("cart_id", cartId);
}

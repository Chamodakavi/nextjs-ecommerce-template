import { getSupabaseBrowserClient } from "./auth";
import { store } from "@/redux/store";
import {
  setWishlistItems,
  removeAllItemsFromWishlist,
} from "@/redux/features/wishlist-slice";

export type WishListItem = {
  id: number;
  title: string;
  price: number;
  discountedPrice: number;
  quantity: number;
  status?: string;
  imgs?: {
    thumbnails: string[];
    previews: string[];
  };
};

let activeWishlistUserId: string | null = null;
let isWishlistHydrating = false;
let wishlistDebounceTimeout: NodeJS.Timeout | null = null;
let hasLoggedWishlistMissingWarning = false;

export function setActiveWishlistUserId(userId: string | null) {
  activeWishlistUserId = userId;
}

export function getActiveWishlistUserId(): string | null {
  return activeWishlistUserId;
}

export function setIsWishlistHydrating(val: boolean) {
  isWishlistHydrating = val;
}

/**
 * Helper to fetch or create the user's wishlist record in Supabase
 */
export async function getOrCreateUserWishlistId(
  userId: string,
): Promise<string | null> {
  const supabase = getSupabaseBrowserClient();

  try {
    const { data: wishlist, error: selectErr } = await supabase
      .from("wishlists")
      .select("id")
      .eq("user_id", userId)
      .maybeSingle();

    if (selectErr) {
      if (selectErr.code === "PGRST205") {
        if (!hasLoggedWishlistMissingWarning) {
          console.warn(
            "[WishlistSync] Database table 'wishlists' not found in Supabase. Run SQL in 'supabase/schema_cart_wishlist.sql' to enable cloud wishlist sync. Using local storage.",
          );
          hasLoggedWishlistMissingWarning = true;
        }
        return null;
      }
      console.error("[WishlistSync] Error finding wishlist:", selectErr);
      return null;
    }

    if (wishlist?.id) {
      return wishlist.id;
    }

    const { data: newWishlist, error: insertErr } = await supabase
      .from("wishlists")
      .insert({ user_id: userId })
      .select("id")
      .maybeSingle();

    if (newWishlist?.id) {
      return newWishlist.id;
    }

    // Re-check in case of concurrent insert
    const { data: retryWishlist } = await supabase
      .from("wishlists")
      .select("id")
      .eq("user_id", userId)
      .maybeSingle();

    return retryWishlist?.id || null;
  } catch (err: any) {
    if (err?.code === "PGRST205") {
      return null;
    }
    console.error("[WishlistSync] Exception in getOrCreateUserWishlistId:", err);
    return null;
  }
}

/**
 * Synchronize local Redux wishlist with Supabase on login
 */
export async function syncReduxWishlistToSupabase(userId: string) {
  setActiveWishlistUserId(userId);
  const supabase = getSupabaseBrowserClient();
  const localWishlistItems = store.getState().wishlistReducer.items;

  const wishlistId = await getOrCreateUserWishlistId(userId);
  if (!wishlistId) {
    return;
  }

  // If there were local guest items, push them into Supabase
  if (localWishlistItems.length > 0) {
    const { data: existingItems } = await supabase
      .from("wishlist_items")
      .select("product_id")
      .eq("wishlist_id", wishlistId);

    const existingSet = new Set(
      (existingItems || []).map((i: any) => String(i.product_id)),
    );

    for (const item of localWishlistItems) {
      const pId = String(item.id);
      if (!existingSet.has(pId)) {
        await supabase.from("wishlist_items").insert({
          wishlist_id: wishlistId,
          product_id: pId,
        });
      }
    }
  }

  // Fetch full combined database wishlist into Redux
  await fetchSupabaseWishlistToRedux(userId);
}

/**
 * Fetch wishlist items from Supabase into Redux store
 */
export async function fetchSupabaseWishlistToRedux(userId: string) {
  const supabase = getSupabaseBrowserClient();

  const wishlistId = await getOrCreateUserWishlistId(userId);
  if (!wishlistId) {
    return [];
  }

  const { data: wishlist, error } = await supabase
    .from("wishlists")
    .select("id, wishlist_items(*)")
    .eq("id", wishlistId)
    .maybeSingle();

  if (error) {
    if (error.code !== "PGRST205") {
      console.error("[WishlistSync] Error fetching wishlist items:", error);
    }
    return [];
  }

  if (wishlist && wishlist.wishlist_items) {
    if (wishlist.wishlist_items.length === 0) {
      setIsWishlistHydrating(true);
      store.dispatch(setWishlistItems([]));
      setIsWishlistHydrating(false);
      return [];
    }

    const productIds = wishlist.wishlist_items.map((i: any) => i.product_id);
    const { data: products } = await supabase
      .from("products")
      .select("*")
      .in("id", productIds);

    const productsMap = new Map<string, any>(
      (products || []).map((p: any) => [String(p.id), p]),
    );

    const mappedItems: WishListItem[] = [];
    for (const dbItem of wishlist.wishlist_items) {
      const product = productsMap.get(String(dbItem.product_id));
      if (product) {
        mappedItems.push({
          id: Number(product.id),
          title: product.name,
          price: Number(product.cost_price || product.selling_price),
          discountedPrice: Number(product.selling_price),
          quantity: 1,
          status: product.availability_status || "available",
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

    setIsWishlistHydrating(true);
    store.dispatch(setWishlistItems(mappedItems));
    setIsWishlistHydrating(false);
    return mappedItems;
  }

  return [];
}

/**
 * Persist the full wishlist state to Supabase for the authenticated user
 */
export async function persistWishlistToSupabase(
  userId: string,
  items: WishListItem[],
) {
  if (isWishlistHydrating) return;
  const wishlistId = await getOrCreateUserWishlistId(userId);
  if (!wishlistId) return;

  const supabase = getSupabaseBrowserClient();

  const { data: dbItems, error: fetchErr } = await supabase
    .from("wishlist_items")
    .select("id, product_id")
    .eq("wishlist_id", wishlistId);

  if (fetchErr) {
    if (fetchErr.code !== "PGRST205") {
      console.error("[WishlistSync] Error fetching wishlist_items:", fetchErr);
    }
    return;
  }

  const existingMap = new Map<string, any>(
    (dbItems || []).map((item: any) => [String(item.product_id), item]),
  );

  // Insert items present in Redux that aren't yet in DB
  for (const item of items) {
    const pId = String(item.id);
    if (!existingMap.has(pId)) {
      await supabase.from("wishlist_items").insert({
        wishlist_id: wishlistId,
        product_id: pId,
      });
    }
  }

  // Delete items from DB that were removed from Redux
  const currentProductIds = new Set(items.map((i) => String(i.id)));
  const toDelete = (dbItems || []).filter(
    (item: any) => !currentProductIds.has(String(item.product_id)),
  );

  if (toDelete.length > 0) {
    const idsToDelete = toDelete.map((i: any) => i.id);
    await supabase.from("wishlist_items").delete().in("id", idsToDelete);
  }
}

/**
 * Called on Redux state change to debounce persistence to Supabase
 */
export function onWishlistStateChanged(items: WishListItem[]) {
  if (isWishlistHydrating || !activeWishlistUserId) return;
  if (wishlistDebounceTimeout) clearTimeout(wishlistDebounceTimeout);

  wishlistDebounceTimeout = setTimeout(() => {
    if (activeWishlistUserId) {
      persistWishlistToSupabase(activeWishlistUserId, items).catch((err) =>
        console.error(
          "[WishlistSync] Error syncing wishlist to Supabase:",
          err,
        ),
      );
    }
  }, 300);
}

/**
 * Realtime subscription to reflect wishlist changes across devices
 */
export function subscribeToWishlistChanges(userId: string) {
  const supabase = getSupabaseBrowserClient();

  const channel = supabase
    .channel("realtime_wishlist_changes")
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "wishlist_items",
      },
      () => {
        if (!isWishlistHydrating && activeWishlistUserId === userId) {
          fetchSupabaseWishlistToRedux(userId);
        }
      },
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}

/**
 * Directly add or update an item in Supabase wishlist for logged-in user
 */
export async function addOrUpdateDatabaseWishlistItem(
  userId: string,
  productId: number | string,
) {
  const wishlistId = await getOrCreateUserWishlistId(userId);
  if (!wishlistId) return;

  const supabase = getSupabaseBrowserClient();
  const pId = String(productId);

  const { data: existing } = await supabase
    .from("wishlist_items")
    .select("id")
    .eq("wishlist_id", wishlistId)
    .eq("product_id", pId)
    .maybeSingle();

  if (!existing) {
    await supabase.from("wishlist_items").insert({
      wishlist_id: wishlistId,
      product_id: pId,
    });
  }
}

/**
 * Directly remove an item from Supabase wishlist for logged-in user
 */
export async function removeDatabaseWishlistItem(
  userId: string,
  productId: number | string,
) {
  const wishlistId = await getOrCreateUserWishlistId(userId);
  if (!wishlistId) return;

  const supabase = getSupabaseBrowserClient();
  await supabase
    .from("wishlist_items")
    .delete()
    .eq("wishlist_id", wishlistId)
    .eq("product_id", String(productId));
}

/**
 * Clears all items in Supabase wishlist for logged-in user
 */
export async function clearDatabaseWishlist(userId: string) {
  const wishlistId = await getOrCreateUserWishlistId(userId);
  if (!wishlistId) return;

  const supabase = getSupabaseBrowserClient();
  await supabase
    .from("wishlist_items")
    .delete()
    .eq("wishlist_id", wishlistId);
}

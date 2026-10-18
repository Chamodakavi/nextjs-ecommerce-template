import { createPublicClient } from "@/lib/supabase/server";
import { Product } from "@/types/product";

export async function getNewArrivalProducts(
  limit: number = 8,
): Promise<Product[]> {
  try {
    const supabase = createPublicClient();

    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error || !data) {
      console.error("Error fetching new arrival products:", error);
      return [];
    }

    return data as Product[];
  } catch (err: any) {
    if (err?.digest === "DYNAMIC_SERVER_USAGE") throw err;
    console.error("Exception in getNewArrivalProducts:", err);
    return [];
  }
}

export async function getAllProducts(): Promise<Product[]> {
  try {
    const supabase = createPublicClient();

    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (error || !data) {
      console.error("Error fetching all products:", error);
      return [];
    }

    return data as Product[];
  } catch (err: any) {
    if (err?.digest === "DYNAMIC_SERVER_USAGE") throw err;
    console.error("Exception in getAllProducts:", err);
    return [];
  }
}

export async function getProductById(id: string): Promise<Product | null> {
  try {
    const supabase = createPublicClient();

    // Check if `id` is numeric or string to query the appropriate column
    const isNumeric = /^\d+$/.test(id);

    let query = supabase.from("products").select("*");

    if (isNumeric) {
      // Query using standard numeric primary key or custom ID
      query = query.or(`id.eq.${id},custom_product_id.eq.${id}`);
    } else {
      // Query string IDs (UUIDs or custom string slugs)
      query = query.or(`id.eq.${id},custom_product_id.eq.${id}`);
    }

    const { data, error } = await query.single();

    if (error || !data) {
      console.error(`Error fetching product with ID ${id}:`, error);
      return null;
    }

    return data as Product;
  } catch (err: any) {
    if (err?.digest === "DYNAMIC_SERVER_USAGE") throw err;
    console.error(`Exception in getProductById for ID ${id}:`, err);
    return null;
  }
}

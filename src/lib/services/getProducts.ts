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

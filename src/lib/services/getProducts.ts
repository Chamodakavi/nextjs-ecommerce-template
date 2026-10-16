import { createClient } from "@/lib/supabase/server";
import { Product } from "@/types/product";

export async function getNewArrivalProducts(
  limit: number = 8,
): Promise<Product[]> {
  const supabase = await createClient();

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
}

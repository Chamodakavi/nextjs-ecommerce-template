import { createPublicClient } from "@/lib/supabase/server";
import { GeneralCat } from "@/types/catData";

export async function getCatData(): Promise<GeneralCat[] | null> {
  try {
    const supabase = createPublicClient();

    const { data, error } = await supabase
      .from("categories")
      .select("cat_id, cat_name")
      .order("cat_id", { ascending: true });

    if (error || !data) {
      console.error("Error fetching categories:", {
        message: error?.message,
        details: error?.details,
        hint: error?.hint,
        code: error?.code,
      });
      return [];
    }

    return data.map((cat) => ({
      id: cat.cat_id,
      name: cat.cat_name ?? "Unnamed Category",
    }));
  } catch (err: any) {
    if (err?.digest === "DYNAMIC_SERVER_USAGE") throw err;
    console.error("Exception in getCatData:", err);
    return [];
  }
}

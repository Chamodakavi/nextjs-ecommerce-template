import { createPublicClient } from "@/lib/supabase/server";
import { CountdownConfig } from "@/types/countdown";

export async function getCountdownData(): Promise<CountdownConfig | null> {
  try {
    const supabase = createPublicClient();

    const { data, error } = await supabase
      .from("storefront_settings")
      .select("countdown_config")
      .limit(1)
      .single();

    if (error || !data?.countdown_config) {
      console.error("Error fetching countdown configuration:", error);
      return null;
    }

    return data.countdown_config as CountdownConfig;
  } catch (err: any) {
    if (err?.digest === "DYNAMIC_SERVER_USAGE") throw err;
    console.error("Exception in getCountdownData:", err);
    return null;
  }
}

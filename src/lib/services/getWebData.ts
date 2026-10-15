import { createClient } from "@/lib/supabase/server";
import { WebData } from "@/types/webData";

export async function getWebData(): Promise<WebData | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("storefront_settings")
    .select("general_config")
    .limit(1)
    .single();

  if (error || !data?.general_config) {
    console.error("Error fetching site settings:", error);
    return null;
  }

  const config = data.general_config;

  return {
    email: config.email ?? "",
    address: config.address ?? "",
    phone: config.telephone ?? "",
    logoUrl: config.logoUrl ?? "",
    site_name: config.site_name ?? "Premier Auto Hub",
  };
}

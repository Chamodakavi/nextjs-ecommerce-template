import { createPublicClient } from "@/lib/supabase/server";
import { WebCarousel, WebData, PromoCard, PromoSecCard } from "@/types/webData";

export async function getWebData(): Promise<WebData | null> {
  try {
    const supabase = createPublicClient();

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
  } catch (err: any) {
    if (err?.digest === "DYNAMIC_SERVER_USAGE") throw err;
    console.error("Exception in getWebData:", err);
    return null;
  }
}

export interface HeroSectionData {
  slides: WebCarousel[];
  promos: PromoCard[];
}

export async function getHeroData(): Promise<HeroSectionData> {
  try {
    const supabase = createPublicClient();

    const { data, error } = await supabase
      .from("storefront_settings")
      .select("carousel_slides, promo_cards")
      .limit(1)
      .single();

    if (error) {
      console.error("Error fetching hero section data:", error);
      return { slides: [], promos: [] };
    }

    return {
      slides: (data?.carousel_slides as WebCarousel[]) ?? [],
      promos: (data?.promo_cards as PromoCard[]) ?? [],
    };
  } catch (err: any) {
    if (err?.digest === "DYNAMIC_SERVER_USAGE") throw err;
    console.error("Exception in getHeroData:", err);
    return { slides: [], promos: [] };
  }
}

export async function getPromoData(): Promise<PromoSecCard[]> {
  try {
    const supabase = createPublicClient();

    const { data, error } = await supabase
      .from("storefront_settings")
      .select("promo_banners")
      .limit(1)
      .single();

    if (error) {
      console.error("Error fetching promo section data:", error);
      return [];
    }

    return (data?.promo_banners as PromoSecCard[]) ?? [];
  } catch (err: any) {
    if (err?.digest === "DYNAMIC_SERVER_USAGE") throw err;
    console.error("Exception in getPromoData:", err);
    return [];
  }
}

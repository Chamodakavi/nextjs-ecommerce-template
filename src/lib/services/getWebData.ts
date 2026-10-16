import { createClient } from "@/lib/supabase/server";
import { WebCarousel, WebData } from "@/types/webData";
import { PromoCard, PromoSecCard } from "@/types/webData";

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

export interface HeroSectionData {
  slides: WebCarousel[];
  promos: PromoCard[];
}

export async function getHeroData(): Promise<HeroSectionData> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("storefront_settings")
    .select("carousel_slides, promo_cards")
    .limit(1)
    .single();

  if (error) {
    console.error("Error fetching hero section data:", error);
    return {
      slides: [],
      promos: [],
    };
  }

  return {
    slides: (data?.carousel_slides as WebCarousel[]) || [],
    promos: (data?.promo_cards as PromoCard[]) || [],
  };
}

export interface PromoSectionData {
  promos: PromoSecCard[];
}

export async function getPromoData(): Promise<PromoSectionData> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("storefront_settings")
    .select("promo_banners")
    .limit(1)
    .single();

  if (error) {
    console.error("Error fetching promo section data:", error);
    return {
      promos: [],
    };
  }

  return {
    promos: (data?.promo_banners as PromoSecCard[]) || [],
  };
}

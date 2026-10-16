export interface GeneralConfig {
  email: string;
  address: string;
  logoUrl?: string;
  telephone: string;
  site_name?: string;
  support_hours?: string;
}

export interface StorefrontSettingsRow {
  id?: string | number;
  general_config: GeneralConfig;
  promo_banners?: any;
  countdown_config?: any;
  updated_at?: string;
}

// Flat structure for easy use inside Header and Footer components
export interface WebData {
  email: string;
  address: string;
  phone: string;
  logoUrl?: string;
  site_name?: string;
}

// Main hero carousel slide structure
export interface WebCarousel {
  id: string | number;
  link: string;
  title: string;
  imageUrl: string;
  isActive: boolean;
  buttonText: string;
  description: string;
  discountText: string;
}

// Right-side promotional card structure
export interface PromoCard {
  id: string | number;
  title: string;
  badgeText: string;
  salePrice: number;
  regularPrice: number;
  link: string;
  imageUrl: string;
  isActive: boolean;
}

// Combined structure containing both carousel slides and promo cards
export interface HeroSectionData {
  slides: WebCarousel[];
  promos: PromoCard[];
}

export interface BigBanner {
  link: string;
  title: string;
  imageUrl: string;
  isActive: boolean;
  subtitle: string;
  buttonText: string;
  description: string;
}

export interface PromoSecCard {
  id: string | number;
  link: string;
  title: string;
  imageUrl: string;
  isActive: boolean;
  subtitle: string;
  buttonText: string;
  description?: string;
  highlightText: string;
}

export interface PromoBannersData {
  bigBanner?: BigBanner;
  smallBanners?: PromoSecCard[];
}

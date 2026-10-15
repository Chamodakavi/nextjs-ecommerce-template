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

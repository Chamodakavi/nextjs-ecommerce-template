export interface Product {
  id: number;
  custom_product_id: string;
  name: string;
  category: string | null;
  brand: string | null;
  stock_quantity: number;
  availability_status: string;
  description: string | null;
  image_url: string | null;
  cost_price: number;
  selling_price: number;
  image_urls: string[];
  created_at?: string;
}

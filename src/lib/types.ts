export type StoreMode = "catalogue" | "menu";

export type StoreCategory = "jewellery" | "clothing" | "homemade" | "food";

export type ProductCategory =
  | "todays_special"
  | "always_available"
  | "weekly_special"
  | "festival_special"
  | "preorder";

export type Store = {
  id: string;
  user_id: string;
  store_name: string;
  display_name: string;
  bio: string | null;
  profile_image_url: string | null;
  instagram_handle: string | null;
  whatsapp_number: string | null;
  upi_id: string | null;
  store_mode: StoreMode;
  category: StoreCategory | null;
  is_open: boolean;
  is_pro: boolean;
  // daily menu mode
  order_start_time: string | null;
  order_end_time: string | null;
  operating_days: number[]; // 0=Sun..6=Sat
  delivery_info: string | null;
  min_order: string | null;
  advance_order_notice: string | null;
  holiday_mode: boolean;
  holiday_return_date: string | null;
  created_at: string;
}

export type Product = {
  id: string;
  store_id: string;
  name: string;
  description: string | null;
  price: number; // paise
  image_url: string | null;
  quantity_available: number; // -1 unlimited, 0 sold out
  is_available: boolean;
  is_todays_special: boolean;
  // daily menu mode
  category: ProductCategory;
  weekly_day: number | null; // 0=Sun..6=Sat
  festival_name: string | null;
  festival_deadline: string | null;
  prep_time_mins: number | null;
  dietary_tags: string[];
  serves: string | null; // '1' | '2' | '4' | 'family'
  order_index: number;
  created_at: string;
}

export type Order = {
  id: string;
  store_id: string;
  product_id: string | null;
  product_name: string;
  amount: number; // paise
  status: string;
  created_at: string;
}

export interface Database {
  public: {
    Tables: {
      stores: {
        Row: Store;
        Insert: Omit<
          Store,
          | "id"
          | "created_at"
          | "category"
          | "order_start_time"
          | "order_end_time"
          | "operating_days"
          | "delivery_info"
          | "min_order"
          | "advance_order_notice"
          | "holiday_mode"
          | "holiday_return_date"
        > & {
          id?: string;
          created_at?: string;
          category?: StoreCategory | null;
          order_start_time?: string | null;
          order_end_time?: string | null;
          operating_days?: number[];
          delivery_info?: string | null;
          min_order?: string | null;
          advance_order_notice?: string | null;
          holiday_mode?: boolean;
          holiday_return_date?: string | null;
        };
        Update: Partial<Omit<Store, "id" | "user_id" | "created_at">>;
        Relationships: [];
      };
      products: {
        Row: Product;
        Insert: Omit<
          Product,
          | "id"
          | "created_at"
          | "category"
          | "weekly_day"
          | "festival_name"
          | "festival_deadline"
          | "prep_time_mins"
          | "dietary_tags"
          | "serves"
        > & {
          id?: string;
          created_at?: string;
          category?: ProductCategory;
          weekly_day?: number | null;
          festival_name?: string | null;
          festival_deadline?: string | null;
          prep_time_mins?: number | null;
          dietary_tags?: string[];
          serves?: string | null;
        };
        Update: Partial<Omit<Product, "id" | "store_id" | "created_at">>;
        Relationships: [];
      };
      orders: {
        Row: Order;
        Insert: Omit<Order, "id" | "created_at"> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Omit<Order, "id" | "store_id" | "created_at">>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}

import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? "";

export const supabase = createClient(url, key);

export const isSupabaseConfigured =
  url.startsWith("https://") && key.length > 20;

export type Confirmacion = {
  id?:                    number;
  nombre:                 string;
  tipo:                   "familia" | "amigo";
  asiste:                 boolean;
  cantidad_personas?:     number;
  nombres_acompañantes?:  string | null;
  transporte:             boolean;
  created_at?:            string;
};

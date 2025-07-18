// src/lib/supabaseClient.ts
import { createClient } from "@supabase/supabase-js";
import { createBrowserClient, createServerClient, CookieOptions } from "@supabase/ssr";

// Inisialisasi variabel lingkungan
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Supabase client untuk server-side (tanpa sesi)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Supabase client untuk client-side
export const createClientComponentClient = () => createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

// Supabase client untuk server-side dengan akses sesi
export const createServerComponentClient = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  cookiesInstance: any
) =>
  createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    cookies: {
      get: (name: string) => cookiesInstance.get(name)?.value,
      set: (name: string, value: string, options: CookieOptions) => cookiesInstance.set(name, value, options),
      remove: (name: string, options: CookieOptions) => cookiesInstance.delete(name, options),
    },
  });

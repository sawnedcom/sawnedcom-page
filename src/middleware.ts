// src/middleware.ts
// Impor createServerClient dan CookieOptions dari @supabase/ssr
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // Inisialisasi Supabase client untuk middleware
  const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    cookies: {
      get(name: string) {
        return request.cookies.get(name)?.value ?? null;
      },
      set(name: string, value: string, options: CookieOptions) {
        response.cookies.set({ name, value, ...options });
      },
      remove(name: string, options: CookieOptions) {
        response.cookies.set({ name, value: "", ...options });
      },
    },
  });

  // --- Ambil user yang terverifikasi ---
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  // Daftar rute yang dilindungi (hanya admin terverifikasi)
  const protectedRoutes = ["/dashboard", "/dashboard/portfolio", "/dashboard/templates", "/dashboard/tutorials"];

  const isProtectedRoute = protectedRoutes.some((route) => request.nextUrl.pathname.startsWith(route));

  // --- Logika Autentikasi dan Otorisasi ---

  // 1. Jika tidak ada user + coba akses protected route → redirect ke endpoint login rahasia
  if (isProtectedRoute && (!user || userError)) {
    console.warn("Middleware: No verified user, redirecting to hidden login.");
    const redirectUrl = new URL("/public/api/v2/session", request.url);
    redirectUrl.searchParams.set("redirectedFrom", request.nextUrl.pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // 2. Jika sudah login, tapi coba akses endpoint login rahasia → redirect ke dashboard
  if (user && request.nextUrl.pathname === "/public/api/v2/session") {
    console.log("Middleware: User already logged in, redirecting from hidden login to dashboard.");
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // 3. Jika user terverifikasi dan akses protected route → cek apakah admin
  if (isProtectedRoute && user) {
    const { data: profile, error: profileError } = await supabase.from("profiles").select("is_admin").eq("id", user.id).single();

    if (profileError || !profile || !profile.is_admin) {
      console.warn("Middleware: Verified user is not admin, redirecting from protected route.");
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return response;
}

// Konfigurasi matcher
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};

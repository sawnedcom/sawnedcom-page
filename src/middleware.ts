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

  // --- PERBAIKAN DI SINI ---
  // Dapatkan pengguna yang terverifikasi. Ini adalah cara paling aman untuk mendapatkan data pengguna di middleware.
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  // --- END PERBAIKAN ---

  // Daftar rute yang dilindungi (membutuhkan login)
  const protectedRoutes = ["/dashboard", "/dashboard/portfolio", "/dashboard/templates", "/dashboard/tutorials"];

  // Cek apakah path saat ini adalah salah satu rute yang dilindungi
  const isProtectedRoute = protectedRoutes.some((route) => request.nextUrl.pathname.startsWith(route));

  // --- Logika Autentikasi dan Otorisasi ---

  // 1. Jika tidak ada pengguna yang terverifikasi dan pengguna mencoba mengakses rute yang dilindungi,
  //    arahkan mereka ke halaman login.
  if (isProtectedRoute && (!user || userError)) {
    // Menggunakan 'user' dan 'userError'
    console.warn("Middleware: No verified user or user verification error, redirecting to login.");
    const redirectUrl = new URL("/login", request.url);
    redirectUrl.searchParams.set("redirectedFrom", request.nextUrl.pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // 2. Jika ada pengguna yang terverifikasi dan pengguna mencoba mengakses halaman login,
  //    arahkan mereka ke dashboard (agar tidak bisa login lagi saat sudah login).
  if (user && request.nextUrl.pathname === "/login") {
    // Menggunakan 'user'
    console.log("Middleware: User already logged in, redirecting from login to dashboard.");
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // 3. Jika ada pengguna yang terverifikasi dan ini adalah rute yang dilindungi,
  //    periksa apakah pengguna adalah admin.
  if (isProtectedRoute && user) {
    // Menggunakan 'user'
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("is_admin")
      .eq("id", user.id) // Menggunakan user.id yang sudah diverifikasi
      .single();

    if (profileError || !profile || !profile.is_admin) {
      console.warn("Middleware: Verified user is not admin or profile not found, redirecting from protected route.");
      // Jika bukan admin atau profil tidak ditemukan, arahkan ke halaman utama atau halaman error akses
      return NextResponse.redirect(new URL("/", request.url)); // Arahkan ke halaman utama
    }
  }

  // Lanjutkan ke permintaan berikutnya jika semua pemeriksaan lolos
  return response;
}

// Konfigurasi matcher untuk middleware
// Ini menentukan rute mana yang akan dilewati oleh middleware
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};

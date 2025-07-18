// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Properti 'content', 'theme', dan 'plugins' telah dihapus dari sini
  // karena mereka seharusnya berada di tailwind.config.ts

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "hcgzqvzrubxdinscozaf.supabase.co", // GANTI DENGAN HOSTNAME SUPABASE ANDA
        port: "",
        pathname: "/storage/v1/object/public/images/**", // Untuk bucket 'images'
      },
      {
        protocol: "https",
        hostname: "hcgzqvzrubxdinscozaf.supabase.co", // GANTI DENGAN HOSTNAME SUPABASE ANDA
        port: "",
        pathname: "/storage/v1/object/public/portimages/**", // Untuk bucket 'portimages'
      },
      {
        protocol: "https",
        hostname: "hcgzqvzrubxdinscozaf.supabase.co", // GANTI DENGAN HOSTNAME SUPABASE ANDA
        port: "",
        // PERBAIKAN KRITIS: Mengubah 'blog_images' menjadi 'blogimages' (tanpa underscore)
        pathname: "/storage/v1/object/public/blogimages/**", // <-- KOREKSI INI
      },
      {
        protocol: "https",
        hostname: "placehold.co",
        port: "",
        pathname: "/**",
      },
    ],
    dangerouslyAllowSVG: true,
    contentDispositionType: "inline",
  },
};
export default nextConfig;

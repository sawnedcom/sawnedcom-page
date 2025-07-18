// src/app/layout.tsx
import type { Metadata } from "next";
import { Poppins } from "next/font/google"; // Mengimpor font Poppins
import "./css/globals.css"; // Mengimpor CSS global

import Header from "@/components/common/Header"; // Mengimpor komponen Header
import Footer from "@/components/common/Footer"; // Mengimpor komponen Footer

// Inisialisasi font Poppins dengan berbagai weight yang tersedia
const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

// Metadata global untuk seluruh aplikasi
// Ini akan menjadi metadata default untuk semua halaman
export const metadata: Metadata = {
  title: {
    default: "Sawnedcom - Pengembang Web & Desainer Template", // Judul default untuk situs
    template: "%s - Sawnedcom", // Format judul untuk halaman dinamis (misal: "Portfolio - Sawnedcom")
  },
  description: "Website pribadi Sawnedcom, menampilkan portfolio, template gratis & premium, tutorial, dan blog seputar web development.",
  keywords: ["Sawnedcom", "Web Developer", "Frontend Developer", "Next.js", "Tailwind CSS", "Supabase", "Portfolio", "Templates", "Tutorials"],
  authors: [{ name: "Sawnedcom" }],
  creator: "Sawnedcom",
  publisher: "Sawnedcom",
  openGraph: {
    title: "Sawnedcom - Pengembang Web & Desainer Template",
    description: "Website pribadi Sawnedcom, menampilkan portfolio, template gratis & premium, tutorial, dan blog seputar web development.",
    url: "https://www.sawnedcom.com", // Ganti dengan URL domain Anda nanti
    siteName: "Sawnedcom",
    images: [
      {
        url: "https://placehold.co/1200x630.png?text=Sawnedcom+OpenGraph", // Gambar Open Graph default
        width: 1200,
        height: 630,
        alt: "Sawnedcom Website",
      },
    ],
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sawnedcom - Pengembang Web & Desainer Template",
    description: "Website pribadi Sawnedcom, menampilkan portfolio, template gratis & premium, tutorial, dan blog seputar web development.",
    creator: "@yourtwitterhandle", // Ganti dengan Twitter handle Anda
    images: ["https://placehold.co/1200x630.png?text=Sawnedcom+Twitter"], // Gambar Twitter Card
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={poppins.variable}>
      <body className="antialiased">
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}

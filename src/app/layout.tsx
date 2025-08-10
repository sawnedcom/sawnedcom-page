import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./css/globals.css";

import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: {
    default: "Sawnedcom - Pengembang Web & Desainer Template",
    template: "%s - Sawnedcom",
  },
  description: "Website pribadi Sawnedcom, menampilkan portfolio, template gratis & premium, tutorial, dan blog seputar web development.",
  keywords: ["Sawnedcom", "Web Developer", "Frontend Developer", "Next.js", "Tailwind CSS", "Supabase", "Portfolio", "Templates", "Tutorials"],
  authors: [{ name: "Sawnedcom" }],
  creator: "Sawnedcom",
  publisher: "Sawnedcom",
  openGraph: {
    title: "Sawnedcom - Pengembang Web & Desainer Template",
    description: "Website pribadi Sawnedcom, menampilkan portfolio, template gratis & premium, tutorial, dan blog seputar web development.",
    url: "https://www.sawnedcom.com",
    siteName: "Sawnedcom",
    images: [
      {
        url: "https://placehold.co/1200x630.png?text=Sawnedcom+OpenGraph",
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
    creator: "@yourtwitterhandle",
    images: ["https://placehold.co/1200x630.png?text=Sawnedcom+Twitter"],
  },
  // KODE VERIFIKASI GOOGLE DITAMBAHKAN DI SINI
  verification: {
    google: "NovntjfjIuPYZtaw17QHVpl1QmwI7xR0AfzP0PgC_dc",
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

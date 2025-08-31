// src/app/page.tsx
import { Metadata } from "next";
import HeroSection from "@/components/home/HeroSection";
import AboutSectionHome from "@/components/home/AboutSectionHome";

/**
 * HomePage: Landing page dengan arsitektur komponen.
 * Ini adalah Server Component.
 */

export const metadata: Metadata = {
  title: "Sawnedcom - Web Developer & Template Designer",
  description: "Personal website showcasing portfolio, free & premium templates, tutorials, and web development blog content.",
  openGraph: {
    images: "/og-image.jpg",
  },
};

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 font-sans antialiased">
      {/* Container untuk smooth scrolling antar section */}
      <div className="snap-y snap-mandatory scroll-smooth">
        {/* Hero Section */}
        <section className="snap-start">
          <HeroSection />
        </section>

        {/* About Section */}
        <section className="snap-start bg-[url('/grid-pattern.svg')] bg-[length:40px_40px] dark:bg-[url('/grid-pattern-dark.svg')]">
          <AboutSectionHome />
        </section>

        {/* Placeholder untuk section mendatang */}
        {/* another niggers */}
      </div>
    </main>
  );
}

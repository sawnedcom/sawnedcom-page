// src/components/portfolio/PortfolioGrid.tsx
import React from "react";

// Mendefinisikan props untuk komponen PortfolioGrid
interface PortfolioGridProps {
  children: React.ReactNode; // Akan menerima komponen PortfolioCard sebagai children
}

const PortfolioGrid: React.FC<PortfolioGridProps> = ({ children }) => {
  return (
    // Menggunakan kelas Tailwind CSS untuk membuat grid responsif
    // grid-cols-1: 1 kolom di mobile
    // md:grid-cols-2: 2 kolom di ukuran medium ke atas
    // lg:grid-cols-3: 3 kolom di ukuran large ke atas
    // gap-8: jarak antar item 2rem
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">{children}</div>
  );
};

export default PortfolioGrid;

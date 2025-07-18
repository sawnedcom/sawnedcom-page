// src/components/templates/TemplateGrid.tsx
import React from "react";

// Mendefinisikan props untuk komponen TemplateGrid
interface TemplateGridProps {
  children: React.ReactNode; // Akan menerima komponen TemplateCard sebagai children
}

const TemplateGrid: React.FC<TemplateGridProps> = ({ children }) => {
  return (
    // Menggunakan kelas Tailwind CSS untuk membuat grid responsif
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">{children}</div>
  );
};

export default TemplateGrid;

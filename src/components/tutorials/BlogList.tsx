// src/components/tutorials/BlogList.tsx
import React from "react";

// Mendefinisikan props untuk komponen BlogList
interface BlogListProps {
  children: React.ReactNode; // Akan menerima komponen BlogPostCard sebagai children
}

const BlogList: React.FC<BlogListProps> = ({ children }) => {
  return (
    // Menggunakan kelas Tailwind CSS untuk membuat grid responsif
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">{children}</div>
  );
};

export default BlogList;

/* eslint-disable @typescript-eslint/no-unused-vars */
// src/app/dashboard/page.tsx
// Premium Admin Dashboard with built-in hover effects

import { createServerComponentClient } from "@/lib/supabaseClient";
import { redirect } from "next/navigation";
import Link from "next/link";
import { cookies } from "next/headers";
import { LayoutDashboard, FileText, Image as ImageIcon, BookOpen } from "lucide-react";

export default async function DashboardPage() {
  const supabase = createServerComponentClient(cookies());

  // Authentication check
  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();
  if (!session || sessionError) {
    console.error("DashboardPage: No active session found or error:", sessionError);
    redirect("/login");
  }

  // Admin verification
  const { data: profile, error: profileError } = await supabase.from("profiles").select("is_admin").eq("id", session.user.id).single();

  if (profileError || !profile || !profile.is_admin) {
    console.error("DashboardPage: User is not admin or profile not found:", profileError);
    redirect("/");
  }

  const dashboardItems = [
    {
      title: "Manage Templates",
      description: "Add, edit, or delete your website templates",
      href: "/dashboard/templates",
      icon: <FileText className="w-10 h-10 text-white" />,
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
      borderColor: "border-blue-100 dark:border-blue-900/30",
    },
    {
      title: "Manage Portfolio",
      description: "Add, edit, or delete your portfolio items",
      href: "/dashboard/portfolio",
      icon: <ImageIcon className="w-10 h-10 text-white" />,
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-50 dark:bg-green-900/20",
      borderColor: "border-green-100 dark:border-green-900/30",
    },
    {
      title: "Manage Tutorials",
      description: "Add, edit, or delete your tutorial/blog posts",
      href: "/dashboard/tutorials",
      icon: <BookOpen className="w-10 h-10 text-white" />,
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50 dark:bg-purple-900/20",
      borderColor: "border-purple-100 dark:border-purple-900/30",
    },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 py-12 font-poppins">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 mb-4">Admin Dashboard</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">Manage your website content and assets with an intuitive interface</p>
        </div>

        {/* Dashboard Cards with Hover Effects */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {dashboardItems.map((item, index) => (
            <Link key={index} href={item.href} className="group relative overflow-hidden rounded-xl">
              {/* Hover effect background */}
              <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />

              {/* Card content */}
              <div className={`relative h-full ${item.bgColor} p-8 rounded-xl shadow-lg border ${item.borderColor} group-hover:shadow-xl transition-all duration-300`}>
                <div className="relative z-10">
                  <div className={`w-16 h-16 mb-6 mx-auto flex items-center justify-center rounded-full bg-gradient-to-br ${item.color} bg-opacity-10 shadow-lg`}>{item.icon}</div>
                  <h2 className="text-2xl font-semibold text-center mb-3">{item.title}</h2>
                  <p className="text-gray-600 dark:text-gray-400 text-center">{item.description}</p>
                  <div className="mt-6 flex justify-center">
                    <span className="text-sm font-medium text-blue-600 dark:text-blue-400 group-hover:underline">Access Panel →</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Stats Overview */}
        <div className="mt-16 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-semibold mb-6">Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {dashboardItems.map((item, index) => (
              <div key={index} className={`${item.bgColor} p-6 rounded-lg border ${item.borderColor}`}>
                <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-2">Total {item.title.split(" ")[1]}</h3>
                <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">0</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}

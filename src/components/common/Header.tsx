"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Home, CircleHelp, Briefcase, FileText, GraduationCap, Menu, X, LogOut, User as UserIcon, Settings, LayoutDashboard } from "lucide-react";
import { createClientComponentClient } from "@/lib/supabaseClient";
import type { User } from "@supabase/supabase-js";

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  const supabase = createClientComponentClient();

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      setUser(user);
      if (user) {
        const { data: profile } = await supabase.from("profiles").select("is_admin").eq("id", user.id).single();

        setIsAdmin(profile?.is_admin || false);
      }
      setLoading(false);
    };

    fetchUser();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
      if (session?.user) {
        supabase
          .from("profiles")
          .select("is_admin")
          .eq("id", session.user.id)
          .single()
          .then(({ data: profile }) => {
            setIsAdmin(profile?.is_admin || false);
          });
      } else {
        setIsAdmin(false);
      }
    });

    return () => authListener.subscription.unsubscribe();
  }, [supabase]);

  const handleLogout = async () => {
    setLoading(true);
    await supabase.auth.signOut();
    window.location.href = "/";
    setLoading(false);
  };

  const navLinks = [
    { name: "home", href: "/", icon: Home },
    { name: "about", href: "/about", icon: CircleHelp },
    { name: "portfolio", href: "/portfolio", icon: Briefcase },
    { name: "templates", href: "/templates", icon: FileText },
    { name: "tutorials", href: "/tutorials", icon: GraduationCap },
  ];

  return (
    <header className="bg-[#1F2545] text-white w-full">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 bg-[#4C5A89] px-2 py-1.5 sm:px-3 sm:py-2 rounded-lg sm:rounded-xl transition-all duration-300 flex-shrink-0">
            <div className="relative w-7 h-7 sm:w-8 sm:h-8">
              <Image src="/images/logo.jpg" alt="Sawnedcom Logo" fill className="object-cover rounded-full" sizes="32px" priority />
            </div>
            <span className="text-sm sm:text-base font-medium text-[#f34e3f] truncate">sawnedcom</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden xl:flex items-center space-x-4 flex-1 justify-center max-w-4xl">
            {navLinks.map((link) => (
              <Link key={link.name} href={link.href} className="flex items-center space-x-2 px-4 py-2 bg-[#4C5A89] rounded-xl font-medium capitalize hover:bg-[#3b3d58] transition-colors duration-300 text-base">
                <link.icon className="w-5 h-5" />
                <span>{link.name}</span>
              </Link>
            ))}

            {/* Admin Dropdown */}
            {isAdmin && (
              <div className="relative group">
                <button className="flex items-center space-x-2 px-4 py-2 bg-[#4C5A89] rounded-xl font-medium hover:bg-[#3b3d58] transition-colors duration-300 text-base">
                  <Settings className="w-5 h-5" />
                  <span>Admin</span>
                </button>
                <div className="absolute left-0 mt-2 w-56 bg-[#4C5A89] rounded-xl shadow-2xl py-2 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-1 group-hover:translate-y-0">
                  {[
                    { href: "/dashboard", label: "Main Dashboard", icon: LayoutDashboard },
                    { href: "/dashboard/templates", label: "Manage Templates", icon: FileText },
                    { href: "/dashboard/portfolio", label: "Manage Portfolio", icon: Briefcase },
                    { href: "/dashboard/tutorials", label: "Manage Tutorials", icon: GraduationCap },
                  ].map((item) => (
                    <Link key={item.href} href={item.href} className="flex items-center space-x-2 px-4 py-2 text-sm hover:bg-[#3b3d58] transition-colors duration-200">
                      <item.icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <div className="xl:hidden flex items-center">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-[#1a1b2a] hover:bg-[#3b3d58] transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500" aria-label="Toggle menu">
              {isMenuOpen ? <X size={20} className="sm:w-6 sm:h-6" /> : <Menu size={20} className="sm:w-6 sm:h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {isMenuOpen && (
          <div className="xl:hidden bg-[#4C5A89] rounded-lg sm:rounded-xl mx-2 sm:mx-4 mt-2 p-3 sm:p-4 shadow-2xl mb-2">
            <div className="flex flex-col space-y-2 sm:space-y-3">
              {navLinks.map((link) => (
                <Link key={link.name} href={link.href} onClick={() => setIsMenuOpen(false)} className="flex items-center space-x-3 px-3 sm:px-4 py-2.5 rounded-lg hover:bg-[#3b3d58] transition-colors duration-200 font-medium capitalize text-sm sm:text-base">
                  <link.icon className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>{link.name}</span>
                </Link>
              ))}

              {/* Admin Section */}
              {isAdmin && (
                <div className="pt-2 border-t border-gray-700">
                  <h4 className="px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold text-white">Admin Panel</h4>
                  <div className="space-y-1">
                    {[
                      { href: "/dashboard", label: "Main Dashboard", icon: LayoutDashboard },
                      { href: "/dashboard/templates", label: "Manage Templates", icon: FileText },
                      { href: "/dashboard/portfolio", label: "Manage Portfolio", icon: Briefcase },
                      { href: "/dashboard/tutorials", label: "Manage Tutorials", icon: GraduationCap },
                    ].map((item) => (
                      <Link key={item.href} href={item.href} onClick={() => setIsMenuOpen(false)} className="flex items-center space-x-3 px-3 sm:px-4 py-2 rounded-lg hover:bg-[#3b3d58] transition-colors duration-200 text-xs sm:text-sm">
                        <item.icon className="w-4 h-4" />
                        <span>{item.label}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Auth Section */}
              <div className="pt-2 border-t border-gray-700">
                {loading ? (
                  <div className="w-full h-10 sm:h-12 bg-gray-700 rounded-lg animate-pulse"></div>
                ) : user ? (
                  <button onClick={handleLogout} className="w-full flex justify-center items-center space-x-3 px-3 sm:px-4 py-2.5 bg-red-600 rounded-lg hover:bg-red-700 transition-colors duration-300 disabled:opacity-50 text-sm sm:text-base font-medium" disabled={loading}>
                    <LogOut className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span>Logout</span>
                  </button>
                ) : (
                  <Link href="/login" onClick={() => setIsMenuOpen(false)} className="w-full flex justify-center items-center space-x-3 px-3 sm:px-4 py-2.5 bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors duration-300 text-sm sm:text-base font-medium">
                    <UserIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span>Login</span>
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;

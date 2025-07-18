"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { createClientComponentClient } from "@/lib/supabaseClient";
import { User } from "@supabase/supabase-js";

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
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Portfolio", href: "/portfolio" },
    { name: "Templates", href: "/templates" },
    { name: "Tutorials", href: "/tutorials" },
  ];

  return (
    <header className="bg-gradient-to-r from-gray-800 to-gray-900 text-white shadow-xl sticky top-0 z-50 backdrop-blur-sm bg-opacity-90">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo + Brand Name */}
          <Link href="/" className="flex items-center space-x-3 group transition-all duration-500">
            <div className="relative w-8 h-8 sm:w-10 sm:h-10">
              <Image src="/images/logo.jpg" alt="Sawnedcom Logo" fill className="object-cover rounded-full border border-white/20" priority />
            </div>
            <span className="text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500 group-hover:from-blue-300 group-hover:to-purple-400">Sawnedcom</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link key={link.name} href={link.href} className="relative font-medium hover:text-blue-400 transition-colors duration-300 group">
                {link.name}
                <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-blue-400 transition-all duration-300 group-hover:w-full"></span>
              </Link>
            ))}

            {isAdmin && (
              <div className="relative group">
                <button className="flex items-center space-x-1 hover:text-blue-400 transition-colors duration-300">
                  <span>Admin</span>
                  <svg className="w-4 h-4 transition-transform group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div className="absolute left-0 mt-4 w-56 bg-gray-700 rounded-lg shadow-2xl py-2 z-10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-1 group-hover:translate-y-0">
                  {[
                    { href: "/dashboard", label: "Main Manage" },
                    { href: "/dashboard/templates", label: "Manage Templates" },
                    { href: "/dashboard/portfolio", label: "Manage Portfolio" },
                    { href: "/dashboard/tutorials", label: "Manage Tutorials" },
                  ].map((item) => (
                    <Link key={item.href} href={item.href} className="block px-4 py-3 text-sm text-gray-300 hover:bg-gray-600 hover:text-white transition-colors duration-200">
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {loading ? (
              <div className="w-24 h-10 bg-gray-700 rounded-lg animate-pulse"></div>
            ) : user ? (
              <button onClick={handleLogout} className="px-5 py-2.5 bg-gradient-to-r from-red-600 to-red-700 rounded-lg hover:from-red-500 hover:to-red-600 transition-all duration-300 shadow-lg hover:shadow-red-500/30 disabled:opacity-50 flex items-center space-x-2" disabled={loading}>
                <span>Logout</span>
                {loading && (
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                )}
              </button>
            ) : null}
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500" aria-label="Toggle menu">
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-gray-800/95 backdrop-blur-sm rounded-xl mt-2 p-4 shadow-2xl border border-gray-700">
            <div className="flex flex-col space-y-3">
              {navLinks.map((link) => (
                <Link key={link.name} href={link.href} onClick={() => setIsMenuOpen(false)} className="px-4 py-3 rounded-lg hover:bg-gray-700/50 transition-colors duration-200 font-medium">
                  {link.name}
                </Link>
              ))}

              {isAdmin && (
                <div className="pt-2 border-t border-gray-700">
                  <h4 className="px-4 py-2 text-sm font-semibold text-blue-400">Admin Panel</h4>
                  {[
                    { href: "/dashboard/templates", label: "Manage Templates" },
                    { href: "/dashboard/portfolio", label: "Manage Portfolio" },
                    { href: "/dashboard/tutorials", label: "Manage Tutorials" },
                  ].map((item) => (
                    <Link key={item.href} href={item.href} onClick={() => setIsMenuOpen(false)} className="block px-4 py-2.5 text-sm rounded-lg hover:bg-gray-700/50 transition-colors duration-200">
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}

              <div className="pt-2 border-t border-gray-700">
                {loading ? (
                  <div className="w-full h-12 bg-gray-700 rounded-lg animate-pulse"></div>
                ) : user ? (
                  <button onClick={handleLogout} className="w-full px-4 py-3 bg-gradient-to-r from-red-600 to-red-700 rounded-lg hover:from-red-500 hover:to-red-600 transition-all duration-300 disabled:opacity-50 flex justify-center items-center space-x-2" disabled={loading}>
                    <span>Logout</span>
                    {loading && (
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    )}
                  </button>
                ) : null}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;

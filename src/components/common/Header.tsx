"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, LogOut, User as UserIcon } from "lucide-react";
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
    { name: "home", href: "/" },
    { name: "about", href: "/about" },
    { name: "portfolio", href: "/portfolio" },
    { name: "templates", href: "/templates" },
    { name: "tutorials", href: "/tutorials" },
  ];

  const adminLinks = [
    { href: "/dashboard", label: "Main Dashboard" },
    { href: "/dashboard/templates", label: "Manage Templates" },
    { href: "/dashboard/portfolio", label: "Manage Portfolio" },
    { href: "/dashboard/tutorials", label: "Manage Tutorials" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-slate-700/80 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group transition-all duration-300 hover:scale-105">
            <div className="relative w-8 h-8 sm:w-10 sm:h-10 rounded-full overflow-hidden ring-2 ring-white/20 group-hover:ring-white/40 transition-all duration-300">
              <Image src="/images/logo.jpg" alt="Sawnedcom Logo" fill className="object-cover" sizes="40px" priority />
            </div>
            <span className="text-lg sm:text-xl font-semibold text-[#f34e3f] transition-colors duration-300 [text-shadow:1px_1px_0_#000,2px_2px_0_#000]">sawnedcom</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden xl:flex items-center space-x-1 flex-1 justify-center max-w-4xl">
            {navLinks.map((link) => (
              <Link key={link.name} href={link.href} className="hover:scale-105  relative px-6 py-3 text-white font-medium capitalize text-base group overflow-hidden transition-all duration-75">
                <span className="relative z-10 [text-shadow:2px_2px_0_#000,3px_3px_0_#000,4px_4px_0_#000]">{link.name}</span>
              </Link>
            ))}

            {/* Admin Dropdown */}
            {isAdmin && (
              <div className="relative group">
                <button className="relative px-6 py-3 text-white font-medium text-base overflow-hidden transition-all duration-300 hover:scale-105">
                  <span
                    className="relative z-10 [text-shadow:2px_2px_0_#000,3px_3px_0_#000,4px_4px_0_#000]">
                    Admin
                  </span>
                </button>

                <div className="absolute left-0 mt-2 w-64 bg-slate-700/95 backdrop-blur-md rounded-xl shadow-2xl border border-white/10 py-2 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                  {adminLinks.map((item, index) => (
                    <Link key={item.href} href={item.href} className="block px-6 py-3 text-sm text-white hover:bg-white/10 transition-all duration-200 relative group/item" style={{ animationDelay: `${index * 50}ms` }}>
                      <span className="relative z-10">{item.label}</span>
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-white scale-y-0 group-hover/item:scale-y-100 transition-transform duration-200 origin-top"></div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </nav>

          {/* Desktop Auth */}
          <div className="hidden xl:flex items-center">
            {loading ? (
              <div className="w-20 h-10 bg-white/10 rounded-lg animate-pulse"></div>
            ) : user ? (
              <button onClick={handleLogout} className="relative px-6 py-3 text-white font-medium text-base group overflow-hidden transition-all duration-300 hover:text-red-300 disabled:opacity-50" disabled={loading}>
                <span className="relative z-10 flex items-center space-x-2">
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </span>
                <div className="absolute inset-0 border-b-2 border-red-400 scale-x-0 group-hover:scale-x-100 transform origin-left transition-transform duration-300 ease-out"></div>
                <div className="absolute inset-0 bg-red-400/10 scale-x-0 group-hover:scale-x-100 transform origin-left transition-transform duration-300 ease-out"></div>
              </button>
            ) : null}
          </div>

          {/* Mobile Menu Button */}
          <div className="xl:hidden flex items-center">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/30 group" aria-label="Toggle menu">
              <div className="relative w-6 h-6">
                <Menu size={24} className={`absolute inset-0 text-white transition-all duration-300 ${isMenuOpen ? "opacity-0 rotate-45 scale-75" : "opacity-100 rotate-0 scale-100"}`} />
                <X size={24} className={`absolute inset-0 text-white transition-all duration-300 ${isMenuOpen ? "opacity-100 rotate-0 scale-100" : "opacity-0 -rotate-45 scale-75"}`} />
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`xl:hidden transition-all duration-300 ease-out ${
            isMenuOpen
              ? "opacity-100 max-h-[90vh] overflow-y-auto" // bisa discroll, maksimal 90% layar
              : "opacity-0 max-h-0 overflow-hidden"
          }`}>
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl m-4 p-6 border border-white/10">
            <div className="flex flex-col space-y-1">
              {navLinks.map((link, index) => (
                <Link key={link.name} href={link.href} onClick={() => setIsMenuOpen(false)} className="relative px-4 py-3 text-white font-medium capitalize text-base group overflow-hidden transition-all duration-300 hover:text-white/90 rounded-lg" style={{ animationDelay: `${index * 50}ms` }}>
                  <span className="relative z-10">{link.name}</span>
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-white scale-y-0 group-hover:scale-y-100 transition-transform duration-200 origin-top rounded-full"></div>
                  <div className="absolute inset-0 bg-white/5 scale-x-0 group-hover:scale-x-100 transform origin-left transition-transform duration-300 ease-out rounded-lg"></div>
                </Link>
              ))}

              {/* Mobile Admin Section */}
              {isAdmin && (
                <div className="pt-4 mt-4 border-t border-white/20">
                  <h4 className="px-4 py-2 text-sm font-semibold text-white/80 uppercase tracking-wider">Admin Panel</h4>
                  <div className="space-y-1">
                    {adminLinks.map((item, index) => (
                      <Link key={item.href} href={item.href} onClick={() => setIsMenuOpen(false)} className="relative block px-4 py-3 text-white/90 text-sm group overflow-hidden transition-all duration-300 hover:text-white rounded-lg" style={{ animationDelay: `${(navLinks.length + index) * 50}ms` }}>
                        <span className="relative z-10">{item.label}</span>
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-white scale-y-0 group-hover:scale-y-100 transition-transform duration-200 origin-top rounded-full"></div>
                        <div className="absolute inset-0 bg-white/5 scale-x-0 group-hover:scale-x-100 transform origin-left transition-transform duration-300 ease-out rounded-lg"></div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Mobile Auth Section */}
              <div className="pt-4 mt-4 border-t border-white/20">
                {loading ? (
                  <div className="w-full h-12 bg-white/10 rounded-lg animate-pulse"></div>
                ) : user ? (
                  <button onClick={handleLogout} className="w-full relative px-4 py-3 text-white font-medium text-base group overflow-hidden transition-all duration-300 hover:text-red-300 disabled:opacity-50 rounded-lg" disabled={loading}>
                    <span className="relative z-10 flex justify-center items-center space-x-2">
                      <LogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </span>
                    <div className="absolute inset-0 bg-red-400/10 scale-x-0 group-hover:scale-x-100 transform origin-left transition-transform duration-300 ease-out rounded-lg"></div>
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-400 scale-y-0 group-hover:scale-y-100 transition-transform duration-200 origin-top rounded-full"></div>
                  </button>
                ) : (
                  <Link href="/login" onClick={() => setIsMenuOpen(false)} className="w-full relative block px-4 py-3 text-white font-medium text-base group overflow-hidden transition-all duration-300 hover:text-blue-300 rounded-lg text-center">
                    <span className="relative z-10 flex justify-center items-center space-x-2">
                      <UserIcon className="w-4 h-4" />
                      <span>Login</span>
                    </span>
                    <div className="absolute inset-0 bg-blue-400/10 scale-x-0 group-hover:scale-x-100 transform origin-left transition-transform duration-300 ease-out rounded-lg"></div>
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-400 scale-y-0 group-hover:scale-y-100 transition-transform duration-200 origin-top rounded-full"></div>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

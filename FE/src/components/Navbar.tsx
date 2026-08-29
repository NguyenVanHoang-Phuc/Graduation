"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { GraduationCap, Menu, X, Sparkles, MapPin, Heart } from "lucide-react";
import { CeremonyInfo } from "@/types";

interface NavbarProps {
  ceremony: CeremonyInfo;
}

export default function Navbar({ ceremony }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Địa Điểm & Bản Đồ", href: "#venue", icon: MapPin },
    { name: "Xác Nhận Tham Dự", href: "#rsvp", icon: Sparkles },
    { name: "Gửi Lời Chúc", href: "#wishes", icon: Heart },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
        scrolled
          ? "bg-[#111417]/90 backdrop-blur-xl border-b border-[#e5d0ac]/15 py-3 shadow-2xl shadow-black/80"
          : "bg-transparent py-4 opacity-0 pointer-events-none md:opacity-100 md:pointer-events-auto"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand / Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-2xl bg-[#1a1f24] border border-[#dfb773]/30 flex items-center justify-center text-[#dfb773] shadow-md group-hover:scale-105 group-hover:border-[#dfb773] transition-all">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="font-serif-luxury font-bold text-sm sm:text-base text-white tracking-wide">
              {ceremony.graduateName}
            </span>
            <span className="text-[10px] text-[#c5a880] tracking-widest uppercase font-semibold">
              Graduation Ceremony
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 bg-[#161a1f]/80 backdrop-blur-md px-4 py-1.5 rounded-full border border-[#e5d0ac]/15 shadow-inner">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-medium text-[#eedec2] hover:text-white hover:bg-[#252b32] transition-all"
            >
              <link.icon className="w-3.5 h-3.5 text-[#dfb773]" />
              <span>{link.name}</span>
            </a>
          ))}
        </nav>

        {/* Right Action CTA (No public Thống Kê button) */}
        <div className="hidden sm:flex items-center gap-3">
          <a
            href="#rsvp"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#e5d0ac] via-[#dfb773] to-[#c4a675] text-[#111417] text-xs font-black shadow-lg shadow-[#dfb773]/20 hover:scale-105 transition-all duration-300"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Xác Nhận Tham Dự</span>
          </a>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex md:hidden items-center">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2.5 rounded-xl bg-[#181c21] border border-[#e5d0ac]/20 text-[#eedec2] hover:text-white"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#111417]/95 backdrop-blur-xl border-b border-[#e5d0ac]/20 px-4 pt-3 pb-6 space-y-3">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-[#eedec2] hover:bg-[#1f2429]"
            >
              <link.icon className="w-4 h-4 text-[#dfb773]" />
              <span>{link.name}</span>
            </a>
          ))}
          <a
            href="#rsvp"
            onClick={() => setMobileMenuOpen(false)}
            className="block w-full text-center py-3 rounded-xl bg-[#dfb773] text-[#111417] font-bold text-xs"
          >
            Xác Nhận Tham Dự Ngay
          </a>
        </div>
      )}
    </header>
  );
}

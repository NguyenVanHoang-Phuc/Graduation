"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import VenueLocation from "@/components/VenueLocation";
import RsvpSection from "@/components/RsvpSection";
import WishesGuestbook from "@/components/WishesGuestbook";
import MusicPlayer from "@/components/MusicPlayer";
import { CeremonyInfo, SummaryStats } from "@/types";
import { fetchCeremonyInfo, fetchSummaryStats } from "@/lib/api";
import { GraduationCap, Heart } from "lucide-react";

export default function Home() {
  const [ceremony, setCeremony] = useState<CeremonyInfo | null>(null);
  const [stats, setStats] = useState<SummaryStats>({
    totalRsvps: 2,
    totalConfirmedGuests: 3,
    totalWishes: 4,
    totalLikes: 90,
  });

  const loadData = async () => {
    try {
      const [ceremonyData, statsData] = await Promise.all([
        fetchCeremonyInfo(),
        fetchSummaryStats(),
      ]);
      setCeremony(ceremonyData);
      setStats(statsData);
    } catch {}
  };

  useEffect(() => {
    loadData();
  }, []);

  if (!ceremony) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#111417]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-4 border-[#dfb773]/20 border-t-[#dfb773] animate-spin" />
          <p className="text-sm text-[#eedec2] font-serif-luxury tracking-wider">
            Đang tải thư mời tốt nghiệp...
          </p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#111417] text-[#f5f2eb] selection:bg-[#dfb773]/30 selection:text-[#fef3c7] relative">
      {/* Top Navbar */}
      <Navbar ceremony={ceremony} />

      {/* Hero Section with Full-Screen Ambient Photo & Floating Interactive Pills */}
      <HeroSection ceremony={ceremony} stats={stats} />

      {/* Venue, Address & Interactive Navigation */}
      <VenueLocation ceremony={ceremony} />

      {/* RSVP Submission */}
      <RsvpSection ceremony={ceremony} onRsvpSuccess={loadData} />

      {/* Live Congratulatory Guestbook */}
      <WishesGuestbook />

      {/* Floating Background Ambient Music Controller */}
      <MusicPlayer />

      {/* Footer */}
      <footer className="py-12 border-t border-[#e5d0ac]/10 bg-[#0d0f12] text-center relative z-10">
        <div className="max-w-4xl mx-auto px-4">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[#dfb773]/10 border border-[#dfb773]/30 text-[#dfb773] mb-4">
            <GraduationCap className="w-6 h-6" />
          </div>

          <h3 className="text-xl font-serif-luxury font-bold champagne-gradient-text mb-2">
            {ceremony.graduateName}
          </h3>
          <p className="text-xs text-[#eedec2]/70 mb-6 max-w-md mx-auto">
            {ceremony.faculty} • {ceremony.universityName}
          </p>

          <p className="text-xs text-[#eedec2]/50 flex items-center justify-center gap-1">
            <span>Thư mời tốt nghiệp lưu niệm với</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" />
            <span>dành tặng ngày Lễ Tốt Nghiệp 2026.</span>
          </p>
        </div>
      </footer>
    </main>
  );
}

"use client";

import { useState, useEffect } from "react";
import {
  Calendar,
  MapPin,
  Clock,
  Sparkles,
  Download,
  Heart,
  Navigation,
  Send,
} from "lucide-react";
import { CeremonyInfo, SummaryStats } from "@/types";

interface HeroSectionProps {
  ceremony: CeremonyInfo;
  stats: SummaryStats;
}

export default function HeroSection({ ceremony }: HeroSectionProps) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  // Countdown timer calculations
  useEffect(() => {
    const calculateTime = () => {
      const target = new Date(ceremony.ceremonyDateTime).getTime();
      const now = new Date().getTime();
      const difference = target - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [ceremony.ceremonyDateTime]);

  // Download iCal (.ics) Calendar File
  const downloadIcsCalendar = () => {
    const ceremonyDate = new Date(ceremony.ceremonyDateTime);
    const startStr = ceremonyDate
      .toISOString()
      .replace(/-|:|\.\d+/g, "")
      .slice(0, 15) + "Z";
    const endDate = new Date(ceremonyDate.getTime() + 4 * 60 * 60 * 1000);
    const endStr = endDate
      .toISOString()
      .replace(/-|:|\.\d+/g, "")
      .slice(0, 15) + "Z";

    const icsData = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Graduation Invitation//VI",
      "CALSCALE:GREGORIAN",
      "METHOD:PUBLISH",
      "BEGIN:VEVENT",
      `SUMMARY:Lễ Tốt Nghiệp - ${ceremony.graduateName}`,
      `DESCRIPTION:Thư mời tham dự Lễ Tốt Nghiệp của ${ceremony.graduateName} tại ${ceremony.universityName}. ${ceremony.welcomeQuote || ""}`,
      `LOCATION:${ceremony.hall}, ${ceremony.venueName}, ${ceremony.address}`,
      `DTSTART:${startStr}`,
      `DTEND:${endStr}`,
      "STATUS:CONFIRMED",
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\r\n");

    const blob = new Blob([icsData], { type: "text/calendar;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `Le_Tot_Nghiep_${ceremony.graduateName.replace(/\s+/g, "_")}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const ceremonyDate = new Date(ceremony.ceremonyDateTime);
  const formattedDate = ceremonyDate.toLocaleDateString("vi-VN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const formattedTime = ceremonyDate.toLocaleTimeString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center pt-20 pb-16 px-4 sm:px-6 overflow-hidden">
      {/* 1. IMMERSIVE FULL-VIEWPORT AMBIENT PHOTO BACKGROUND */}
      <div className="absolute inset-0 pointer-events-none -z-20 overflow-hidden">
        <img
          src="/graduate.jpg"
          alt=""
          className="w-full h-full object-cover object-center scale-125 filter blur-[60px] opacity-25 brightness-75 contrast-125 transition-all duration-1000"
        />
        {/* Dark Vignette Overlay */}
        <div className="absolute inset-0 bg-[#111417]/80 backdrop-blur-[20px]" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#111417] via-transparent to-[#111417]/90" />
      </div>

      {/* Floating Ambient Light Orbs */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[#dfb773]/10 rounded-full blur-[180px] pointer-events-none -z-10" />

      {/* 2. MAIN CENTER CONTAINER WITH FLOATING BUTTONS */}
      <div className="w-full max-w-5xl mx-auto flex flex-col items-center relative">
        
        {/* WRAPPER FOR POSTER + FLOATING INTERACTIVE BUTTONS */}
        <div className="relative w-full flex items-center justify-center">
          
          {/* --- LEFT FLOATING BUTTONS (Desktop) --- */}
          <div className="hidden lg:flex flex-col gap-6 absolute -left-12 xl:-left-20 top-1/2 -translate-y-1/2 z-20">
            {/* Floating Pill 1: Venue */}
            <a
              href="#venue"
              style={{ animationDelay: "0s" }}
              className="animate-paper-1 group flex items-center gap-3 px-5 py-3.5 rounded-2xl bg-[#161a1f]/90 hover:bg-[#20262e] border border-[#e5d0ac]/25 hover:border-[#dfb773] backdrop-blur-xl text-xs font-bold text-[#eedec2] hover:text-white shadow-2xl shadow-black/80 hover:scale-110 active:scale-95 transition-all duration-300"
            >
              <div className="w-8 h-8 rounded-xl bg-[#dfb773]/15 border border-[#dfb773]/30 flex items-center justify-center text-[#dfb773] group-hover:bg-[#dfb773] group-hover:text-[#111417] transition-colors">
                <MapPin className="w-4 h-4" />
              </div>
              <div className="text-left">
                <span className="block text-[10px] text-[#c5a880] uppercase tracking-wider font-semibold">
                  Địa Điểm
                </span>
                <span className="font-bold text-white">Chỉ Đường Google Maps</span>
              </div>
            </a>

            {/* Floating Pill 2: Save Date Calendar */}
            <button
              onClick={downloadIcsCalendar}
              style={{ animationDelay: "1.5s" }}
              className="animate-paper-2 group flex items-center gap-3 px-5 py-3.5 rounded-2xl bg-[#161a1f]/90 hover:bg-[#20262e] border border-[#e5d0ac]/25 hover:border-[#dfb773] backdrop-blur-xl text-xs font-bold text-[#eedec2] hover:text-white shadow-2xl shadow-black/80 hover:scale-110 active:scale-95 transition-all duration-300"
            >
              <div className="w-8 h-8 rounded-xl bg-[#dfb773]/15 border border-[#dfb773]/30 flex items-center justify-center text-[#dfb773] group-hover:bg-[#dfb773] group-hover:text-[#111417] transition-colors">
                <Download className="w-4 h-4" />
              </div>
              <div className="text-left">
                <span className="block text-[10px] text-[#c5a880] uppercase tracking-wider font-semibold">
                  Nhắc Hẹn
                </span>
                <span className="font-bold text-white">Lưu Lịch Vào Điện Thoại</span>
              </div>
            </button>
          </div>

          {/* --- CENTRAL EDITORIAL POSTER --- */}
          <div className="relative w-full max-w-[370px] sm:max-w-md rounded-[34px] overflow-hidden shadow-[0_25px_70px_rgba(0,0,0,0.85)] border border-[#e5d0ac]/30 bg-[#14181c] group transition-all duration-500 hover:border-[#dfb773]/60">
            
            {/* Graduate Portrait Image */}
            <div className="relative w-full aspect-[9/15] overflow-hidden">
              <img
                src="/graduate.jpg"
                alt={ceremony.graduateName}
                className="w-full h-full object-cover object-center scale-[1.01] filter brightness-[0.92] contrast-[1.06] transition-transform duration-700 group-hover:scale-105"
              />

              {/* Cinematic Vignette Overlays */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#101316] via-transparent to-[#101316]/65 pointer-events-none" />
              <div className="absolute inset-0 bg-gradient-to-b from-[#101316]/75 via-transparent to-[#101316]/85 pointer-events-none" />

              {/* Floating Graduation Papers Animation */}
              <div className="absolute top-16 left-5 w-12 h-16 bg-[#f5e6ca]/15 backdrop-blur-sm rounded border border-[#f5e6ca]/25 transform -rotate-12 shadow-lg animate-paper-1 pointer-events-none" />
              <div className="absolute top-1/3 right-4 w-14 h-18 bg-[#f5e6ca]/20 backdrop-blur-sm rounded border border-[#f5e6ca]/30 transform rotate-15 shadow-xl animate-paper-2 pointer-events-none" />
              <div className="absolute bottom-28 right-6 w-16 h-20 bg-[#f5e6ca]/25 backdrop-blur-sm rounded-md border border-[#f5e6ca]/35 transform -rotate-6 shadow-2xl animate-paper-1 pointer-events-none" />
              
              {/* Golden Sparkles & Dust */}
              <div className="absolute top-1/2 left-8 w-2 h-2 rounded-full bg-[#fde68a] shadow-[0_0_12px_#fde68a] animate-dust pointer-events-none" />
              <div className="absolute bottom-36 left-1/4 w-1.5 h-1.5 rounded-full bg-[#f5e6ca] shadow-[0_0_10px_#f5e6ca] animate-dust pointer-events-none delay-300" />
              <div className="absolute top-24 right-1/4 w-2.5 h-2.5 rounded-full bg-[#d4af37] shadow-[0_0_15px_#d4af37] animate-dust pointer-events-none delay-700" />

              {/* --- TOP CONTENT OVERLAY --- */}
              <div className="absolute top-4 sm:top-6 inset-x-0 flex flex-col items-center text-center px-3 z-10">
                {/* Cursive Calligraphy Header */}
                <h2 className="font-script text-[42px] sm:text-6xl text-[#fbf5e8] drop-shadow-[0_4px_16px_rgba(0,0,0,0.95)] tracking-wide leading-none mb-1.5">
                  Happy Graduation
                </h2>

                {/* Faculty & University Pill */}
                <div className="px-3 py-0.5 rounded-full bg-[#121517]/85 backdrop-blur-md border border-[#e5d0ac]/35 text-[9.5px] sm:text-xs text-[#eedec2] font-semibold tracking-wide shadow-xl max-w-[95%] mb-1.5">
                  {ceremony.faculty}
                </div>

                {/* Date & University Pill */}
                <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#121517]/90 backdrop-blur-md border border-[#e5d0ac]/45 text-[9px] sm:text-[11px] text-[#f7eedc] font-bold tracking-wider shadow-xl">
                  <Calendar className="w-3 h-3 text-[#dfb773]" />
                  <span className="capitalize">{formattedDate}</span>
                  <span className="text-[#dfb773]">•</span>
                  <span>{ceremony.universityName}</span>
                </div>
              </div>

              {/* --- GRADUATE NAME (Editorial Serif) --- */}
              <div className="absolute right-4 bottom-20 sm:bottom-24 text-right z-10 max-w-[68%] bg-[#121517]/80 backdrop-blur-md p-2.5 sm:p-3.5 rounded-2xl border border-[#e5d0ac]/25 shadow-2xl">
                <h1 className="font-serif-luxury text-lg sm:text-2xl font-bold text-[#fcf8f0] leading-tight drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]">
                  {ceremony.graduateName}
                </h1>
                <p className="font-serif-luxury italic text-[11px] sm:text-xs text-[#dfb773] mt-0.5 font-semibold">
                  {ceremony.degree || ceremony.major}
                </p>
              </div>

              {/* --- BOTTOM LEFT: SCRIPT CALLIGRAPHY FLOURISH --- */}
              <div className="absolute bottom-5 left-4 z-10">
                <span className="font-script text-2xl sm:text-4xl text-[#f3e5ab] drop-shadow-[0_4px_12px_rgba(0,0,0,0.95)] leading-none block transform -rotate-6">
                  Graduate The <br /> Golden Chapter
                </span>
              </div>
            </div>
          </div>

          {/* --- RIGHT FLOATING BUTTONS (Desktop) --- */}
          <div className="hidden lg:flex flex-col gap-6 absolute -right-12 xl:-right-20 top-1/2 -translate-y-1/2 z-20">
            {/* Floating Pill 3: RSVP */}
            <a
              href="#rsvp"
              style={{ animationDelay: "0.8s" }}
              className="animate-paper-2 group flex items-center gap-3 px-5 py-3.5 rounded-2xl bg-gradient-to-r from-[#e5d0ac] via-[#dfb773] to-[#c4a675] text-[#111417] font-black text-xs shadow-2xl shadow-[#dfb773]/30 hover:scale-110 active:scale-95 transition-all duration-300"
            >
              <div className="w-8 h-8 rounded-xl bg-[#111417] flex items-center justify-center text-[#dfb773]">
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="text-left">
                <span className="block text-[10px] text-[#111417]/80 uppercase tracking-wider font-bold">
                  Tham Dự
                </span>
                <span className="font-black text-[#111417]">Xác Nhận Tham Dự Ngay</span>
              </div>
            </a>

            {/* Floating Pill 4: Wishes */}
            <a
              href="#wishes"
              style={{ animationDelay: "2.2s" }}
              className="animate-paper-1 group flex items-center gap-3 px-5 py-3.5 rounded-2xl bg-[#161a1f]/90 hover:bg-[#20262e] border border-[#e5d0ac]/25 hover:border-[#dfb773] backdrop-blur-xl text-xs font-bold text-[#eedec2] hover:text-white shadow-2xl shadow-black/80 hover:scale-110 active:scale-95 transition-all duration-300"
            >
              <div className="w-8 h-8 rounded-xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400 group-hover:bg-rose-500 group-hover:text-white transition-colors">
                <Heart className="w-4 h-4" />
              </div>
              <div className="text-left">
                <span className="block text-[10px] text-[#c5a880] uppercase tracking-wider font-semibold">
                  Lưu Bút
                </span>
                <span className="font-bold text-white">Gửi Lời Chúc Mừng</span>
              </div>
            </a>
          </div>
        </div>

        {/* --- MOBILE / TABLET FLOATING ACTION BUTTONS GRID --- */}
        <div className="grid grid-cols-2 gap-3 w-full max-w-md mt-6 lg:hidden z-10">
          <a
            href="#rsvp"
            className="flex items-center justify-center gap-2 p-3.5 rounded-2xl bg-gradient-to-r from-[#e5d0ac] to-[#dfb773] text-[#111417] font-black text-xs shadow-lg shadow-[#dfb773]/20 active:scale-95 transition-all"
          >
            <Sparkles className="w-4 h-4" />
            <span>Xác Nhận RSVP</span>
          </a>

          <a
            href="#venue"
            className="flex items-center justify-center gap-2 p-3.5 rounded-2xl bg-[#161a1f] border border-[#e5d0ac]/25 text-[#eedec2] font-bold text-xs active:scale-95 transition-all"
          >
            <MapPin className="w-4 h-4 text-[#dfb773]" />
            <span>Địa Điểm & Bản Đồ</span>
          </a>

          <a
            href="#wishes"
            className="flex items-center justify-center gap-2 p-3.5 rounded-2xl bg-[#161a1f] border border-[#e5d0ac]/25 text-[#eedec2] font-bold text-xs active:scale-95 transition-all"
          >
            <Heart className="w-4 h-4 text-rose-400" />
            <span>Gửi Lời Chúc</span>
          </a>

          <button
            onClick={downloadIcsCalendar}
            className="flex items-center justify-center gap-2 p-3.5 rounded-2xl bg-[#161a1f] border border-[#e5d0ac]/25 text-[#eedec2] font-bold text-xs active:scale-95 transition-all"
          >
            <Download className="w-4 h-4 text-[#dfb773]" />
            <span>Lưu Vào Lịch</span>
          </button>
        </div>

        {/* --- COUNTDOWN TIMER CARD --- */}
        <div className="w-full max-w-2xl mt-8 space-y-6 text-center z-10">
          <div className="glass-card-gold rounded-3xl p-6 sm:p-8 border border-[#e5d0ac]/25 shadow-2xl">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#121517]/90 border border-[#dfb773]/40 text-xs font-bold text-[#dfb773] uppercase tracking-wider mb-5 shadow-md">
              <Clock className="w-3.5 h-3.5" />
              <span>Đồng Hồ Đếm Ngược Đến Ngày Lễ</span>
            </div>

            <div className="grid grid-cols-4 gap-3 sm:gap-4 max-w-lg mx-auto">
              <div className="bg-[#101316]/90 rounded-2xl p-3.5 sm:p-4 border border-[#e5d0ac]/15 shadow-inner">
                <span className="font-serif-luxury text-2xl sm:text-4xl font-bold champagne-gradient-text block">
                  {String(timeLeft.days).padStart(2, "0")}
                </span>
                <span className="text-[10px] sm:text-xs text-[#c5a880] font-semibold uppercase tracking-wider mt-1 block">
                  Ngày
                </span>
              </div>

              <div className="bg-[#101316]/90 rounded-2xl p-3.5 sm:p-4 border border-[#e5d0ac]/15 shadow-inner">
                <span className="font-serif-luxury text-2xl sm:text-4xl font-bold champagne-gradient-text block">
                  {String(timeLeft.hours).padStart(2, "0")}
                </span>
                <span className="text-[10px] sm:text-xs text-[#c5a880] font-semibold uppercase tracking-wider mt-1 block">
                  Giờ
                </span>
              </div>

              <div className="bg-[#101316]/90 rounded-2xl p-3.5 sm:p-4 border border-[#e5d0ac]/15 shadow-inner">
                <span className="font-serif-luxury text-2xl sm:text-4xl font-bold champagne-gradient-text block">
                  {String(timeLeft.minutes).padStart(2, "0")}
                </span>
                <span className="text-[10px] sm:text-xs text-[#c5a880] font-semibold uppercase tracking-wider mt-1 block">
                  Phút
                </span>
              </div>

              <div className="bg-[#101316]/90 rounded-2xl p-3.5 sm:p-4 border border-[#e5d0ac]/15 shadow-inner">
                <span className="font-serif-luxury text-2xl sm:text-4xl font-bold champagne-gradient-text block">
                  {String(timeLeft.seconds).padStart(2, "0")}
                </span>
                <span className="text-[10px] sm:text-xs text-[#c5a880] font-semibold uppercase tracking-wider mt-1 block">
                  Giây
                </span>
              </div>
            </div>

            {/* Location & Time Info */}
            <div className="mt-6 pt-6 border-t border-[#e5d0ac]/15 flex flex-wrap items-center justify-center gap-6 text-xs sm:text-sm text-[#eedec2]">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#dfb773]" />
                <span className="font-bold text-white">{formattedTime}</span>
                <span>- {formattedDate}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#dfb773]" />
                <span>{ceremony.hall} - {ceremony.venueName}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

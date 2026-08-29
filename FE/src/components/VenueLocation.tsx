"use client";

import {
  MapPin,
  Navigation,
  Sparkles,
  Phone,
  Mail,
  Shirt,
  Calendar,
  ExternalLink,
} from "lucide-react";
import { CeremonyInfo } from "@/types";

interface VenueLocationProps {
  ceremony: CeremonyInfo;
}

export default function VenueLocation({ ceremony }: VenueLocationProps) {
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
    <section id="venue" className="py-20 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#181c21] border border-[#dfb773]/30 text-[#dfb773] text-xs font-bold uppercase tracking-wider mb-3 shadow-md">
            <MapPin className="w-3.5 h-3.5" />
            <span>Địa Điểm & Chỉ Đường</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif-luxury font-bold text-white mb-3">
            Thời Gian & Nơi Diễn Ra
          </h2>
          <p className="text-xs sm:text-sm text-[#eedec2]/80 max-w-lg mx-auto">
            Hân hoan chào đón quý thầy cô, gia đình và bạn bè thân yêu đến chung vui trong ngày trọng đại!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Information Cards (5 cols) */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
            {/* Location Card */}
            <div className="glass-card rounded-3xl p-6 border border-[#e5d0ac]/20 shadow-xl">
              <div className="w-10 h-10 rounded-2xl bg-[#dfb773]/10 border border-[#dfb773]/30 flex items-center justify-center text-[#dfb773] mb-4">
                <MapPin className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-serif-luxury font-bold text-white mb-1">
                {ceremony.hall}
              </h3>
              <p className="text-sm font-semibold text-[#dfb773] mb-2">
                {ceremony.venueName}
              </p>
              <p className="text-xs text-[#eedec2]/70 leading-relaxed mb-4">
                {ceremony.address}
              </p>
              <a
                href={ceremony.googleMapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs font-bold text-[#dfb773] hover:text-[#fef3c7] transition-colors"
              >
                <span>Mở Google Maps chỉ đường</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Time Card */}
            <div className="glass-card rounded-3xl p-6 border border-[#e5d0ac]/20 shadow-xl">
              <div className="w-10 h-10 rounded-2xl bg-[#dfb773]/10 border border-[#dfb773]/30 flex items-center justify-center text-[#dfb773] mb-4">
                <Calendar className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-serif-luxury font-bold text-white mb-1">
                Thời Gian Tổ Chức
              </h3>
              <p className="text-sm font-semibold text-[#dfb773] mb-1">
                {formattedTime} • {formattedDate}
              </p>
              <p className="text-xs text-[#eedec2]/70">
                Kính mong mọi người có mặt sớm 15-30 phút để chụp ảnh lưu niệm cùng Tân Kỹ Sư!
              </p>
            </div>

            {/* Contact & Dress Code */}
            <div className="glass-card rounded-3xl p-6 border border-[#e5d0ac]/20 shadow-xl grid grid-cols-2 gap-4">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#c5a880] block mb-1">
                  Trang phục (Dress code)
                </span>
                <p className="text-xs font-semibold text-white">
                  {ceremony.dressCode || "Lịch sự"}
                </p>
              </div>

              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#c5a880] block mb-1">
                  Hotline hỗ trợ
                </span>
                <a
                  href={`tel:${ceremony.contactPhone}`}
                  className="text-xs font-semibold text-[#dfb773] hover:underline"
                >
                  {ceremony.contactPhone}
                </a>
              </div>
            </div>
          </div>

          {/* Interactive Map & Direct Directions (7 cols) */}
          <div className="lg:col-span-7 glass-card-gold rounded-3xl p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden shadow-2xl">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-xs font-bold text-[#dfb773] uppercase tracking-wider">
                  <Navigation className="w-4 h-4" />
                  <span>Bản Đồ Google Maps</span>
                </div>
                <span className="text-xs text-[#eedec2]/60 font-mono">FPT University Da Nang</span>
              </div>

              {/* Embedded Google Maps iFrame */}
              <div className="w-full h-80 rounded-2xl overflow-hidden border border-[#e5d0ac]/25 shadow-inner bg-[#101316] relative">
                <iframe
                  title="Google Map Venue"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3835.7387123984186!2d108.25831101530932!3d15.968885888942152!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3142116949840599%3A0x365b35580f52e8d5!2zxJDhuqFpIGjhu41jIEZQVCDEkMOgIE7hurVuZw!5e0!3m2!1svi!2s!4v1700000000000!5m2!1svi!2s"
                  width="100%"
                  height="100%"
                  style={{ border: 0, filter: "contrast(1.05) brightness(0.95)" }}
                  allowFullScreen={false}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>

            <div className="mt-6 pt-5 border-t border-[#e5d0ac]/15 flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-xs text-[#eedec2]/70 text-center sm:text-left">
                Nhấp vào nút để mở ứng dụng Google Maps dẫn đường trực tiếp đến hội trường.
              </p>
              <a
                href={ceremony.googleMapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#e5d0ac] via-[#dfb773] to-[#c4a675] text-[#111417] text-xs font-bold shadow-lg shadow-[#dfb773]/20 hover:scale-105 transition-all whitespace-nowrap flex items-center gap-2"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>Chỉ Đường Trên Google Maps</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

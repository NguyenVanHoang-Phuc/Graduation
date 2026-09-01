"use client";

import { CheckCircle2, Calendar, MapPin, Sparkles, Heart } from "lucide-react";
import { GuestRsvp, CeremonyInfo } from "@/types";

interface ConfirmationCardProps {
  rsvp: GuestRsvp;
  ceremony: CeremonyInfo;
  onReset: () => void;
}

export default function ConfirmationCard({
  rsvp,
  ceremony,
  onReset,
}: ConfirmationCardProps) {
  const getAttendanceLabel = (status: string) => {
    switch (status) {
      case "Attending":
        return "Tham Dự Toàn Bộ (Lễ & Tiệc Mừng)";
      case "AttendingCeremonyOnly":
        return "Tham Dự Lễ Trao Bằng";
      case "AttendingPartyOnly":
        return "Tham Dự Tiệc Mừng Thân Mật";
      default:
        return "Gửi Lời Chúc Mừng Từ Xa";
    }
  };

  return (
    <div className="max-w-lg mx-auto animate-in zoom-in-95 duration-500">
      <div className="relative rounded-3xl p-1 bg-gradient-to-br from-[#e5d0ac] via-[#dfb773] to-[#c4a675] shadow-2xl shadow-black/80">
        <div className="rounded-[22px] bg-[#14181c] p-6 sm:p-8 text-center relative overflow-hidden">
          {/* Success Check Icon */}
          <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto mb-4 text-emerald-400">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <h3 className="text-2xl font-serif-luxury font-bold champagne-gradient-text mb-1">
            Cảm Ơn Bạn Rất Nhiều!
          </h3>
          <p className="text-xs sm:text-sm text-[#eedec2]/80 mb-6">
            Thông tin xác nhận của <strong className="text-white font-bold">{rsvp.fullName}</strong> đã được ghi nhận.
          </p>

          {/* Details Summary */}
          <div className="glass-card rounded-2xl p-5 border-[#e5d0ac]/15 text-left space-y-3 mb-6 text-xs sm:text-sm">
            <div className="flex justify-between items-center border-b border-[#e5d0ac]/15 pb-2.5">
              <span className="text-[#eedec2]/70">Hình thức tham dự:</span>
              <span className="text-[#dfb773] font-bold">
                {getAttendanceLabel(rsvp.attendanceStatus)}
              </span>
            </div>

            {rsvp.attendanceStatus !== "NotAttending" && (
              <div className="flex justify-between items-center border-b border-[#e5d0ac]/15 pb-2.5">
                <span className="text-[#eedec2]/70">Số lượng người:</span>
                <span className="text-white font-bold">
                  {rsvp.numberOfGuests} người
                </span>
              </div>
            )}

            <div className="flex items-start gap-2.5 text-xs text-[#eedec2]/80 pt-1">
              <Calendar className="w-4 h-4 text-[#dfb773] shrink-0 mt-0.5" />
              <span>
                {new Date(ceremony.ceremonyDateTime).toLocaleDateString("vi-VN", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                  timeZone: "Asia/Ho_Chi_Minh",
                })}
              </span>
            </div>

            <div className="flex items-start gap-2.5 text-xs text-[#eedec2]/80">
              <MapPin className="w-4 h-4 text-[#dfb773] shrink-0 mt-0.5" />
              <span>{ceremony.hall} - {ceremony.venueName}</span>
            </div>
          </div>

          <button
            onClick={onReset}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#e5d0ac] via-[#dfb773] to-[#c4a675] text-[#111417] font-bold text-xs sm:text-sm shadow-lg shadow-[#dfb773]/20 hover:scale-105 transition-all"
          >
            Đăng Ký Thêm Người Khác
          </button>
        </div>
      </div>
    </div>
  );
}

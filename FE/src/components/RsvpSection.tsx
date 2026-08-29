"use client";

import { useState } from "react";
import {
  Sparkles,
  Send,
  User,
  Phone,
  Mail,
  Users,
  MessageSquare,
  CheckCircle2,
  Calendar,
  Heart,
} from "lucide-react";
import { CeremonyInfo, CreateRsvpRequest, AttendanceStatus, GuestRsvp } from "@/types";
import { submitRsvp } from "@/lib/api";
import ConfirmationCard from "./DigitalInvitationCard";
import { triggerGraduationConfetti } from "./ConfettiEffect";

interface RsvpSectionProps {
  ceremony: CeremonyInfo;
  onRsvpSuccess?: () => void;
}

export default function RsvpSection({
  ceremony,
  onRsvpSuccess,
}: RsvpSectionProps) {
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [attendanceStatus, setAttendanceStatus] =
    useState<AttendanceStatus>("Attending");
  const [numberOfGuests, setNumberOfGuests] = useState(1);
  const [notes, setNotes] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submittedRsvp, setSubmittedRsvp] = useState<GuestRsvp | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!fullName.trim()) {
      setError("Vui lòng nhập họ và tên của bạn.");
      return;
    }

    setLoading(true);
    try {
      const payload: CreateRsvpRequest = {
        fullName: fullName.trim(),
        phoneNumber: phoneNumber.trim() || undefined,
        email: email.trim() || undefined,
        attendanceStatus,
        numberOfGuests:
          attendanceStatus === "NotAttending" ? 0 : numberOfGuests,
        notes: notes.trim() || undefined,
      };

      const res = await submitRsvp(payload);
      if (res.success && res.data) {
        setSubmittedRsvp(res.data);
        triggerGraduationConfetti();
        if (onRsvpSuccess) onRsvpSuccess();
      } else {
        setError(res.message || "Gửi phản hồi thất bại. Vui lòng thử lại!");
      }
    } catch {
      setError("Không thể kết nối đến máy chủ. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSubmittedRsvp(null);
    setFullName("");
    setPhoneNumber("");
    setEmail("");
    setNotes("");
    setNumberOfGuests(1);
    setAttendanceStatus("Attending");
  };

  return (
    <section id="rsvp" className="py-24 relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#181c21] border border-[#dfb773]/30 text-[#dfb773] text-xs font-bold uppercase tracking-wider mb-3 shadow-md">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Phản Hồi Tham Dự</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif-luxury font-bold text-white mb-3">
            Xác Nhận Tham Dự
          </h2>
          <p className="text-xs sm:text-sm text-[#eedec2]/80 max-w-lg mx-auto">
            Sự có mặt của bạn là niềm vinh hạnh to lớn đối với Phúc và gia đình. Xin vui lòng gửi phản hồi trước ngày tổ chức để ban tổ chức chuẩn bị chu đáo nhất!
          </p>
        </div>

        {/* Dynamic Display: Form or Confirmation Card */}
        {submittedRsvp ? (
          <ConfirmationCard
            rsvp={submittedRsvp}
            ceremony={ceremony}
            onReset={handleReset}
          />
        ) : (
          <div className="glass-card-gold rounded-3xl p-6 sm:p-10 border border-[#e5d0ac]/25 shadow-2xl">
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs sm:text-sm animate-shake">
                  {error}
                </div>
              )}

              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold text-[#eedec2] uppercase tracking-wider mb-2">
                  Họ và tên của bạn <span className="text-[#dfb773]">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-[#c5a880] absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Nhập họ và tên khách mời..."
                    className="w-full bg-[#101316] border border-[#e5d0ac]/25 rounded-2xl pl-11 pr-4 py-3.5 text-xs sm:text-sm text-slate-100 placeholder-[#eedec2]/40 focus:outline-none focus:border-[#dfb773] transition-all shadow-inner"
                  />
                </div>
              </div>

              {/* Contact Info (Grid 2 cols) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#eedec2] uppercase tracking-wider mb-2">
                    Số điện thoại
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-[#c5a880] absolute left-4 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="0912 345 678"
                      className="w-full bg-[#101316] border border-[#e5d0ac]/25 rounded-2xl pl-11 pr-4 py-3.5 text-xs sm:text-sm text-slate-100 placeholder-[#eedec2]/40 focus:outline-none focus:border-[#dfb773] transition-all shadow-inner"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#eedec2] uppercase tracking-wider mb-2">
                    Địa chỉ Email
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-[#c5a880] absolute left-4 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="ban@example.com"
                      className="w-full bg-[#101316] border border-[#e5d0ac]/25 rounded-2xl pl-11 pr-4 py-3.5 text-xs sm:text-sm text-slate-100 placeholder-[#eedec2]/40 focus:outline-none focus:border-[#dfb773] transition-all shadow-inner"
                    />
                  </div>
                </div>
              </div>

              {/* Attendance Options */}
              <div>
                <label className="block text-xs font-bold text-[#eedec2] uppercase tracking-wider mb-3">
                  Bạn có thể tham dự cùng mình không? <span className="text-[#dfb773]">*</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    {
                      id: "Attending",
                      title: "Tham Dự Toàn Bộ",
                      desc: "Lễ Trao Bằng & Tiệc Mừng Thân Mật",
                    },
                    {
                      id: "AttendingCeremonyOnly",
                      title: "Chỉ Dự Buổi Lễ",
                      desc: "Tại Hội Trường Lễ Tốt Nghiệp",
                    },
                    {
                      id: "AttendingPartyOnly",
                      title: "Chỉ Dự Tiệc Mừng",
                      desc: "Giao lưu, chụp ảnh và chung vui",
                    },
                    {
                      id: "NotAttending",
                      title: "Không Thể Đến",
                      desc: "Rất tiếc mình bận và xin gửi lời chúc từ xa",
                    },
                  ].map((opt) => (
                    <button
                      type="button"
                      key={opt.id}
                      onClick={() =>
                        setAttendanceStatus(opt.id as AttendanceStatus)
                      }
                      className={`p-4 rounded-2xl text-left border transition-all ${
                        attendanceStatus === opt.id
                          ? "bg-[#dfb773]/15 border-[#dfb773] shadow-lg shadow-[#dfb773]/10"
                          : "bg-[#101316]/70 border-[#e5d0ac]/15 hover:border-[#e5d0ac]/35 text-[#eedec2]/70"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className={`text-xs sm:text-sm font-bold ${
                          attendanceStatus === opt.id ? "text-[#fef3c7]" : "text-white"
                        }`}>
                          {opt.title}
                        </span>
                        <div
                          className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                            attendanceStatus === opt.id
                              ? "border-[#dfb773] bg-[#dfb773]"
                              : "border-slate-600"
                          }`}
                        >
                          {attendanceStatus === opt.id && (
                            <div className="w-1.5 h-1.5 rounded-full bg-[#111417]" />
                          )}
                        </div>
                      </div>
                      <p className="text-[11px] text-[#eedec2]/60 mt-1">
                        {opt.desc}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Number of Guests (+1) */}
              {attendanceStatus !== "NotAttending" && (
                <div>
                  <label className="block text-xs font-bold text-[#eedec2] uppercase tracking-wider mb-2">
                    Tổng số người tham dự (Bao gồm bạn & người đi cùng)
                  </label>
                  <div className="flex items-center gap-3">
                    {[1, 2, 3, 4, 5].map((num) => (
                      <button
                        type="button"
                        key={num}
                        onClick={() => setNumberOfGuests(num)}
                        className={`w-12 h-12 rounded-2xl font-bold text-sm transition-all ${
                          numberOfGuests === num
                            ? "bg-gradient-to-r from-[#e5d0ac] to-[#dfb773] text-[#111417] shadow-lg shadow-[#dfb773]/20 scale-105"
                            : "bg-[#101316] text-[#eedec2] border border-[#e5d0ac]/20 hover:border-[#e5d0ac]/40"
                        }`}
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Notes */}
              <div>
                <label className="block text-xs font-bold text-[#eedec2] uppercase tracking-wider mb-2">
                  Lời nhắn gửi / Ghi chú đặc biệt
                </label>
                <div className="relative">
                  <MessageSquare className="w-4 h-4 text-[#c5a880] absolute left-4 top-3.5" />
                  <textarea
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Ví dụ: Sẽ đến sớm chụp hình cùng Phúc nhé..."
                    className="w-full bg-[#101316] border border-[#e5d0ac]/25 rounded-2xl pl-11 pr-4 py-3 text-xs sm:text-sm text-slate-100 placeholder-[#eedec2]/40 focus:outline-none focus:border-[#dfb773] transition-all shadow-inner"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#e5d0ac] via-[#dfb773] to-[#c4a675] text-[#111417] font-bold text-sm sm:text-base shadow-xl shadow-[#dfb773]/20 hover:shadow-[#dfb773]/35 hover:scale-[1.01] active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-[#111417] border-t-transparent rounded-full animate-spin" />
                    <span>Đang Gửi Xác Nhận...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Gửi Xác Nhận Tham Dự</span>
                  </>
                )}
              </button>
            </form>
          </div>
        )}
      </div>
    </section>
  );
}

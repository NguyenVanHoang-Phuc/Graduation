"use client";

import { useState } from "react";
import {
  Heart,
  Send,
  Sparkles,
  User,
  CheckCircle2,
} from "lucide-react";
import { submitWish } from "@/lib/api";
import { triggerGraduationConfetti } from "./ConfettiEffect";

export default function WishesGuestbook() {
  const [senderName, setSenderName] = useState("");
  const [relationship, setRelationship] = useState("Bạn Bè");
  const [message, setMessage] = useState("");
  const [selectedEmoji, setSelectedEmoji] = useState("🎓");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const emojis = ["🎓", "🎉", "💐", "🌟", "🥂", "💖", "✨", "🔥"];
  const relationshipTags = [
    "Bạn Bè",
    "Gia Đình",
    "Bạn Cùng Lớp",
    "Đồng Nghiệp",
    "Thầy Cô",
    "Người Yêu",
    "Khác",
  ];

  const handleSendWish = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!senderName.trim()) {
      setError("Vui lòng nhập tên của bạn.");
      return;
    }
    if (!message.trim()) {
      setError("Vui lòng nhập nội dung lời chúc.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await submitWish({
        senderName: senderName.trim(),
        relationship,
        message: message.trim(),
        emoji: selectedEmoji,
      });

      if (res.success && res.data) {
        setSuccess("Đã gửi lời chúc thành công! Cảm ơn bạn rất nhiều.");
        setSenderName("");
        setMessage("");
        triggerGraduationConfetti();
        setTimeout(() => setSuccess(null), 5000);
      } else {
        setError(res.message || "Gửi lời chúc thất bại.");
      }
    } catch {
      setError("Không thể kết nối đến máy chủ.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="wishes" className="py-24 relative">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#181c21] border border-[#dfb773]/30 text-[#dfb773] text-xs font-bold uppercase tracking-wider mb-3 shadow-md">
            <Heart className="w-3.5 h-3.5 text-rose-400" />
            <span>Gửi Lời Chúc Mừng</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif-luxury font-bold text-white mb-3">
            Sổ Lưu Bút Kỷ Niệm
          </h2>
          <p className="text-xs sm:text-sm text-[#eedec2]/80 max-w-lg mx-auto">
            Hãy để lại vài dòng tâm sự, lời chúc ý nghĩa hoặc những lời nhắn nhủ thân thương gửi đến Tân Kỹ Sư!
          </p>
        </div>

        {/* Submit Wish Form Card */}
        <div className="glass-card-gold rounded-3xl p-6 sm:p-10 border border-[#e5d0ac]/25 shadow-2xl">
          <form onSubmit={handleSendWish} className="space-y-5">
            {error && (
              <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs sm:text-sm">
                {error}
              </div>
            )}
            {success && (
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs sm:text-sm flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{success}</span>
              </div>
            )}

            {/* Sender Name */}
            <div>
              <label className="block text-xs font-bold text-[#eedec2] uppercase tracking-wider mb-2">
                Tên của bạn <span className="text-[#dfb773]">*</span>
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-[#c5a880] absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                  placeholder="Nhập tên của bạn..."
                  className="w-full bg-[#101316] border border-[#e5d0ac]/25 rounded-2xl pl-11 pr-4 py-3.5 text-xs sm:text-sm text-slate-100 placeholder-[#eedec2]/40 focus:outline-none focus:border-[#dfb773] transition-all shadow-inner"
                />
              </div>
            </div>

            {/* Relationship Tag */}
            <div>
              <label className="block text-xs font-bold text-[#eedec2] uppercase tracking-wider mb-2">
                Mối quan hệ
              </label>
              <div className="flex flex-wrap gap-2">
                {relationshipTags.map((tag) => (
                  <button
                    type="button"
                    key={tag}
                    onClick={() => setRelationship(tag)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all ${
                      relationship === tag
                        ? "bg-gradient-to-r from-[#e5d0ac] to-[#dfb773] text-[#111417] font-bold shadow-md shadow-[#dfb773]/20"
                        : "bg-[#101316] text-[#eedec2]/70 hover:text-white border border-[#e5d0ac]/15"
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Emoji Picker */}
            <div>
              <label className="block text-xs font-bold text-[#eedec2] uppercase tracking-wider mb-2">
                Biểu tượng cảm xúc
              </label>
              <div className="flex items-center gap-2">
                {emojis.map((emoji) => (
                  <button
                    type="button"
                    key={emoji}
                    onClick={() => setSelectedEmoji(emoji)}
                    className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg transition-transform ${
                      selectedEmoji === emoji
                        ? "bg-[#dfb773]/25 border border-[#dfb773] scale-110 shadow-lg shadow-[#dfb773]/20"
                        : "bg-[#101316] hover:bg-[#1f2429] text-slate-300 border border-[#e5d0ac]/15"
                    }`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>

            {/* Message */}
            <div>
              <label className="block text-xs font-bold text-[#eedec2] uppercase tracking-wider mb-2">
                Nội dung lời chúc <span className="text-[#dfb773]">*</span>
              </label>
              <textarea
                rows={3}
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Gửi lời chúc mừng hoặc đôi lời nhắn nhủ thân thương..."
                className="w-full bg-[#101316] border border-[#e5d0ac]/25 rounded-2xl p-4 text-xs sm:text-sm text-slate-100 placeholder-[#eedec2]/40 focus:outline-none focus:border-[#dfb773] transition-all shadow-inner"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#e5d0ac] via-[#dfb773] to-[#c4a675] text-[#111417] font-bold text-sm shadow-xl shadow-[#dfb773]/20 hover:scale-[1.01] active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-[#111417] border-t-transparent rounded-full animate-spin" />
                  <span>Đang Gửi Lời Chúc...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Gửi Lời Chúc Mừng</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

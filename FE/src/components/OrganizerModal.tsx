"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  X,
  Users,
  CheckCircle2,
  ExternalLink,
  Phone,
  Mail,
} from "lucide-react";
import { GuestRsvp, SummaryStats } from "@/types";
import { fetchAllRsvps } from "@/lib/api";

interface OrganizerModalProps {
  isOpen: boolean;
  onClose: () => void;
  stats: SummaryStats;
  onRefreshStats: () => void;
}

export default function OrganizerModal({
  isOpen,
  onClose,
  stats,
}: OrganizerModalProps) {
  const [rsvps, setRsvps] = useState<GuestRsvp[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadRsvps();
    }
  }, [isOpen]);

  const loadRsvps = async () => {
    setLoading(true);
    try {
      const data = await fetchAllRsvps(1, 100);
      setRsvps(data.items);
    } catch {}
    setLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="glass-card rounded-3xl p-6 sm:p-8 max-w-2xl w-full border border-slate-700 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-800">
          <div>
            <h3 className="text-xl font-cinzel font-bold text-white">
              Thống Kê Khách Mời
            </h3>
            <p className="text-xs text-slate-400">
              Tổng cộng {stats.totalRsvps} lượt đăng ký • {stats.totalConfirmedGuests} khách tham dự
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex items-center justify-between mb-6">
          <Link
            href="/summarize"
            onClick={onClose}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 text-xs font-bold shadow-lg shadow-amber-500/20 hover:scale-105 transition-all"
          >
            <span>Mở Bảng Thống Kê Đầy Đủ</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="space-y-3">
          {loading ? (
            <p className="text-xs text-slate-400 text-center py-6">Đang tải...</p>
          ) : rsvps.length === 0 ? (
            <p className="text-xs text-slate-400 text-center py-6">Chưa có khách mời nào.</p>
          ) : (
            rsvps.slice(0, 8).map((rsvp) => (
              <div
                key={rsvp.id}
                className="flex items-center justify-between p-3.5 rounded-xl bg-slate-900/80 border border-slate-800"
              >
                <div>
                  <h4 className="text-sm font-bold text-white">{rsvp.fullName}</h4>
                  <span className="text-xs text-slate-400">
                    {rsvp.attendanceStatus !== "NotAttending" ? `${rsvp.numberOfGuests} người` : "Không đến"}
                  </span>
                </div>
                {rsvp.phoneNumber && (
                  <span className="text-xs text-emerald-400">{rsvp.phoneNumber}</span>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

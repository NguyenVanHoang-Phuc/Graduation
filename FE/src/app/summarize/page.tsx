"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Users,
  Heart,
  Calendar,
  Sparkles,
  ArrowLeft,
  Search,
  Download,
  Filter,
  CheckCircle2,
  Phone,
  Mail,
  RefreshCw,
  Clock,
  PartyPopper,
  UserX,
  Share2,
  TrendingUp,
  Award,
} from "lucide-react";
import {
  CeremonyInfo,
  GraduationWish,
  GuestRsvp,
  SummaryStats,
} from "@/types";
import {
  fetchCeremonyInfo,
  fetchSummaryStats,
  fetchAllRsvps,
  fetchWishes,
  likeWish,
} from "@/lib/api";

export default function SummarizePage() {
  const [ceremony, setCeremony] = useState<CeremonyInfo>({
    id: "00000000-0000-0000-0000-000000000001",
    graduateName: "Nguyễn Văn Hoàng Phúc",
    graduateTitle: "Tân Kỹ Sư Công Nghệ Thông Tin",
    degree: "Cử Nhân Kỹ Thuật Phần Mềm",
    major: "Kỹ Thuật Phần Mềm (Software Engineering)",
    universityName: "Trường Đại học FPT Đà Nẵng",
    faculty: "Khoa Công nghệ thông tin và Kỹ thuật phần mềm",
    ceremonyDateTime: "2026-09-12T08:00:00+07:00",
    venueName: "Đại học FPT Đà Nẵng",
    hall: "Khuôn viên Đại học FPT Đà Nẵng",
    address: "Đại học FPT Đà Nẵng",
    dressCode: "Lịch sự",
    contactPhone: "0926 615 662",
    contactEmail: "hoangphucnguyenvan1@gmail.com",
    welcomeQuote: "Sau 4 năm học tập và nỗ lực không ngừng, ngày vui tốt nghiệp đã đến!",
  });

  const [stats, setStats] = useState<SummaryStats>({
    totalRsvps: 0,
    totalConfirmedGuests: 0,
    totalWishes: 0,
    totalLikes: 0,
  });

  const [rsvps, setRsvps] = useState<GuestRsvp[]>([]);
  const [wishes, setWishes] = useState<GraduationWish[]>([]);

  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"guests" | "wishes">("guests");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [copied, setCopied] = useState(false);

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [ceremonyData, statsData, rsvpsData, wishesData] =
        await Promise.all([
          fetchCeremonyInfo(),
          fetchSummaryStats(),
          fetchAllRsvps(1, 200),
          fetchWishes(1, 100),
        ]);

      if (ceremonyData) setCeremony(ceremonyData);
      if (statsData) setStats(statsData);
      if (rsvpsData?.items && rsvpsData.items.length > 0) {
        setRsvps(rsvpsData.items);
      }
      if (wishesData?.items && wishesData.items.length > 0) {
        setWishes(wishesData.items);
      }
    } catch {}
    setLoading(false);
  };

  useEffect(() => {
    loadAllData();
  }, []);

  const handleLike = async (wishId: string) => {
    setWishes((prev) =>
      prev.map((w) => (w.id === wishId ? { ...w, likesCount: w.likesCount + 1 } : w))
    );
    try {
      await likeWish(wishId);
    } catch {}
  };

  // Calculation breakdowns
  const totalAttendingBoth = rsvps.filter((r) => r.attendanceStatus === "Attending").reduce((acc, r) => acc + r.numberOfGuests, 0);
  const totalAttendingCeremony = rsvps.filter((r) => r.attendanceStatus === "AttendingCeremonyOnly").reduce((acc, r) => acc + r.numberOfGuests, 0);
  const totalAttendingParty = rsvps.filter((r) => r.attendanceStatus === "AttendingPartyOnly").reduce((acc, r) => acc + r.numberOfGuests, 0);
  const totalNotAttending = rsvps.filter((r) => r.attendanceStatus === "NotAttending").length;

  const filteredRsvps = rsvps.filter((r) => {
    const matchesSearch =
      r.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (r.phoneNumber && r.phoneNumber.includes(searchQuery)) ||
      (r.email && r.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (r.notes && r.notes.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus =
      statusFilter === "ALL" || r.attendanceStatus === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const exportToCSV = () => {
    if (rsvps.length === 0) return;

    const headers = [
      "Họ và Tên",
      "Trạng Thái",
      "Số Người",
      "Số Điện Thoại",
      "Email",
      "Ghi Chú",
      "Ngày Đăng Ký",
    ];

    const rows = rsvps.map((r) => [
      `"${r.fullName.replace(/"/g, '""')}"`,
      `"${r.attendanceStatus}"`,
      r.numberOfGuests,
      `"${r.phoneNumber || ""}"`,
      `"${r.email || ""}"`,
      `"${(r.notes || "").replace(/"/g, '""')}"`,
      `"${new Date(r.createdAt).toLocaleString("vi-VN")}"`,
    ]);

    const csvContent =
      "\uFEFF" +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Danh_Sach_Khach_Moi_Tot_Nghiep_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const copyShareLink = () => {
    const homeUrl = window.location.origin;
    navigator.clipboard.writeText(homeUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const getAttendanceBadge = (status: string) => {
    switch (status) {
      case "Attending":
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
            <CheckCircle2 className="w-3 h-3" />
            <span>Toàn Bộ (Lễ & Tiệc)</span>
          </span>
        );
      case "AttendingCeremonyOnly":
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-[#dfb773]/20 text-[#fef3c7] border border-[#dfb773]/40">
            <Award className="w-3 h-3 text-[#dfb773]" />
            <span>Chỉ Dự Lễ Trao Bằng</span>
          </span>
        );
      case "AttendingPartyOnly":
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-[#c5a880]/20 text-[#eedec2] border border-[#c5a880]/40">
            <PartyPopper className="w-3 h-3 text-[#c5a880]" />
            <span>Chỉ Dự Tiệc Mừng</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-[#1a1f24] text-[#eedec2]/60 border border-[#e5d0ac]/10">
            <UserX className="w-3 h-3" />
            <span>Không Thể Đến</span>
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#111417] text-[#f5f2eb] py-8 px-4 sm:px-6 lg:px-8 relative overflow-hidden font-sans">
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#dfb773]/8 rounded-full blur-[160px]" />
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-[#c5a880]/6 rounded-full blur-[180px]" />
      </div>

      <div className="max-w-7xl mx-auto space-y-8">
        {/* Top Navbar Card */}
        <div className="glass-card-gold rounded-3xl p-6 sm:p-8 border border-[#e5d0ac]/25 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-xs font-bold text-[#dfb773] hover:text-[#fef3c7] transition-colors uppercase tracking-wider mb-1"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Quay Lại Trang Chủ Thư Mời</span>
            </Link>
            <h1 className="text-2xl sm:text-4xl font-serif-luxury font-bold tracking-tight champagne-gradient-text">
              Bảng Thống Kê Lễ Tốt Nghiệp
            </h1>
            <p className="text-xs sm:text-sm text-[#eedec2]/80 flex items-center gap-2">
              <strong className="text-white font-bold">{ceremony.graduateName}</strong>
              <span className="text-[#c5a880]">•</span>
              <span>{ceremony.major}</span>
              <span className="text-[#c5a880]">•</span>
              <span className="text-[#dfb773]">{ceremony.universityName}</span>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={copyShareLink}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#181c21] border border-[#e5d0ac]/20 hover:border-[#dfb773]/60 text-[#eedec2] text-xs font-bold transition-all shadow-md"
            >
              <Share2 className="w-3.5 h-3.5 text-[#dfb773]" />
              <span>{copied ? "Đã Copy Link!" : "Copy Link Trang Chủ"}</span>
            </button>

            <button
              onClick={loadAllData}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#181c21] border border-[#e5d0ac]/20 hover:border-[#dfb773]/60 text-[#eedec2] text-xs font-bold transition-all shadow-md"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-[#dfb773] ${loading ? "animate-spin" : ""}`} />
              <span>Làm Mới</span>
            </button>

            <button
              onClick={exportToCSV}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#e5d0ac] via-[#dfb773] to-[#c4a675] text-[#111417] text-xs font-black shadow-lg shadow-[#dfb773]/20 hover:scale-105 transition-all"
            >
              <Download className="w-4 h-4" />
              <span>Xuất Excel (CSV)</span>
            </button>
          </div>
        </div>

        {/* 4 Big KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Card 1 */}
          <div className="glass-card rounded-3xl p-6 border border-[#e5d0ac]/20 hover:border-[#dfb773]/50 transition-all shadow-xl">
            <div className="flex items-center justify-between text-[#eedec2]/70 mb-3">
              <span className="text-xs font-bold uppercase tracking-wider">
                Tổng Lượt Đăng Ký
              </span>
              <div className="w-9 h-9 rounded-xl bg-[#dfb773]/10 border border-[#dfb773]/30 flex items-center justify-center text-[#dfb773]">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl sm:text-4xl font-serif-luxury font-bold champagne-gradient-text mb-1">
              {stats.totalRsvps || rsvps.length}
            </div>
            <p className="text-xs text-[#eedec2]/60">Phiếu phản hồi từ bạn bè, người thân</p>
          </div>

          {/* Card 2 */}
          <div className="glass-card rounded-3xl p-6 border border-emerald-500/20 hover:border-emerald-400/40 transition-all shadow-xl">
            <div className="flex items-center justify-between text-[#eedec2]/70 mb-3">
              <span className="text-xs font-bold uppercase tracking-wider">
                Khách Xác Nhận Đến
              </span>
              <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl sm:text-4xl font-serif-luxury font-bold text-emerald-400 mb-1">
              {stats.totalConfirmedGuests || (totalAttendingBoth + totalAttendingCeremony + totalAttendingParty)}
            </div>
            <p className="text-xs text-[#eedec2]/60">Tổng số người (bao gồm đi cùng +1)</p>
          </div>

          {/* Card 3 */}
          <div className="glass-card rounded-3xl p-6 border border-rose-500/20 hover:border-rose-400/40 transition-all shadow-xl">
            <div className="flex items-center justify-between text-[#eedec2]/70 mb-3">
              <span className="text-xs font-bold uppercase tracking-wider">
                Tổng Lời Chúc Mừng
              </span>
              <div className="w-9 h-9 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
                <Heart className="w-4 h-4 fill-rose-500/20" />
              </div>
            </div>
            <div className="text-3xl sm:text-4xl font-serif-luxury font-bold text-rose-400 mb-1">
              {stats.totalWishes || wishes.length}
            </div>
            <p className="text-xs text-[#eedec2]/60">Tâm sự & lời chúc trong sổ lưu bút</p>
          </div>

          {/* Card 4 */}
          <div className="glass-card rounded-3xl p-6 border border-[#dfb773]/20 hover:border-[#dfb773]/50 transition-all shadow-xl">
            <div className="flex items-center justify-between text-[#eedec2]/70 mb-3">
              <span className="text-xs font-bold uppercase tracking-wider">
                Lượt Yêu Thích
              </span>
              <div className="w-9 h-9 rounded-xl bg-[#dfb773]/10 border border-[#dfb773]/30 flex items-center justify-center text-[#dfb773]">
                <Sparkles className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl sm:text-4xl font-serif-luxury font-bold text-[#fef3c7] mb-1">
              {stats.totalLikes || wishes.reduce((sum, w) => sum + w.likesCount, 0)}
            </div>
            <p className="text-xs text-[#eedec2]/60">Tổng lượt thả tim tương tác</p>
          </div>
        </div>

        {/* Detailed Breakdown Bar */}
        <div className="glass-card-gold rounded-3xl p-6 sm:p-8 border border-[#e5d0ac]/20 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#dfb773]" />
              <span>Phân Tích Chi Tiết Số Lượng Tham Dự</span>
            </h3>
            <span className="text-xs font-semibold text-[#eedec2]/70">
              Tổng {rsvps.length} lượt phản hồi
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
            <div className="bg-[#101316]/90 rounded-2xl p-4 border border-emerald-500/20 shadow-inner">
              <span className="text-xs text-[#eedec2]/70 font-medium">Toàn bộ (Lễ & Tiệc)</span>
              <p className="text-xl font-bold text-emerald-400 mt-1">{totalAttendingBoth} người</p>
            </div>
            <div className="bg-[#101316]/90 rounded-2xl p-4 border border-[#dfb773]/25 shadow-inner">
              <span className="text-xs text-[#eedec2]/70 font-medium">Chỉ dự buổi lễ</span>
              <p className="text-xl font-bold text-[#fef3c7] mt-1">{totalAttendingCeremony} người</p>
            </div>
            <div className="bg-[#101316]/90 rounded-2xl p-4 border border-[#c5a880]/25 shadow-inner">
              <span className="text-xs text-[#eedec2]/70 font-medium">Chỉ dự tiệc mừng</span>
              <p className="text-xl font-bold text-[#eedec2] mt-1">{totalAttendingParty} người</p>
            </div>
            <div className="bg-[#101316]/90 rounded-2xl p-4 border border-[#e5d0ac]/10 shadow-inner">
              <span className="text-xs text-[#eedec2]/70 font-medium">Không thể đến</span>
              <p className="text-xl font-bold text-[#eedec2]/50 mt-1">{totalNotAttending} người</p>
            </div>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="flex items-center gap-3 border-b border-[#e5d0ac]/15 pb-3">
          <button
            onClick={() => setActiveTab("guests")}
            className={`flex items-center gap-2.5 px-6 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all shadow-md ${
              activeTab === "guests"
                ? "bg-gradient-to-r from-[#e5d0ac] via-[#dfb773] to-[#c4a675] text-[#111417] shadow-[#dfb773]/20"
                : "glass-card text-[#eedec2]/80 hover:text-white border-[#e5d0ac]/15"
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Danh Sách Khách Mời ({rsvps.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("wishes")}
            className={`flex items-center gap-2.5 px-6 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all shadow-md ${
              activeTab === "wishes"
                ? "bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-rose-500/20"
                : "glass-card text-[#eedec2]/80 hover:text-white border-[#e5d0ac]/15"
            }`}
          >
            <Heart className="w-4 h-4" />
            <span>Sổ Lưu Bút & Lời Chúc ({wishes.length})</span>
          </button>
        </div>

        {/* TAB 1: GUEST LIST */}
        {activeTab === "guests" && (
          <div className="glass-card-gold rounded-3xl p-6 sm:p-8 border border-[#e5d0ac]/20 shadow-2xl space-y-6">
            {/* Search & Filter Controls */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="relative flex-1 w-full">
                <Search className="w-4 h-4 text-[#c5a880] absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tìm kiếm theo tên khách mời, số điện thoại, email, lời nhắn..."
                  className="w-full bg-[#101316] border border-[#e5d0ac]/25 rounded-2xl pl-11 pr-4 py-3 text-xs sm:text-sm text-white placeholder-[#eedec2]/40 focus:outline-none focus:border-[#dfb773] transition-all shadow-inner"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Filter className="w-4 h-4 text-[#dfb773] shrink-0" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-[#101316] border border-[#e5d0ac]/25 rounded-2xl px-4 py-3 text-xs sm:text-sm text-[#eedec2] focus:outline-none focus:border-[#dfb773] shadow-inner"
                >
                  <option value="ALL">Tất cả hình thức</option>
                  <option value="Attending">Tham dự toàn bộ (Lễ & Tiệc)</option>
                  <option value="AttendingCeremonyOnly">Chỉ dự buổi lễ</option>
                  <option value="AttendingPartyOnly">Chỉ dự tiệc mừng</option>
                  <option value="NotAttending">Không thể đến</option>
                </select>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto rounded-2xl border border-[#e5d0ac]/15">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-[#101316]/95 text-[#c5a880] font-semibold border-b border-[#e5d0ac]/15">
                  <tr>
                    <th className="p-4">STT</th>
                    <th className="p-4">Họ và Tên Khách Mời</th>
                    <th className="p-4">Hình Thức Tham Dự</th>
                    <th className="p-4 text-center">Số Người</th>
                    <th className="p-4">Thông Tin Liên Hệ</th>
                    <th className="p-4">Ghi Chú / Lời Nhắn</th>
                    <th className="p-4">Thời Gian Đăng Ký</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e5d0ac]/10 text-[#eedec2]">
                  {filteredRsvps.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="p-12 text-center text-[#eedec2]/50">
                        Không tìm thấy khách mời nào phù hợp với bộ lọc tìm kiếm.
                      </td>
                    </tr>
                  ) : (
                    filteredRsvps.map((rsvp, idx) => (
                      <tr key={rsvp.id} className="hover:bg-[#181c21]/80 transition-colors">
                        <td className="p-4 font-mono font-bold text-[#c5a880]">
                          #{idx + 1}
                        </td>
                        <td className="p-4">
                          <span className="font-bold text-white text-sm sm:text-base">
                            {rsvp.fullName}
                          </span>
                        </td>
                        <td className="p-4">
                          {getAttendanceBadge(rsvp.attendanceStatus)}
                        </td>
                        <td className="p-4 font-bold text-center text-slate-100">
                          {rsvp.attendanceStatus !== "NotAttending" ? (
                            <span className="px-2.5 py-1 rounded-lg bg-[#101316] text-[#dfb773] border border-[#e5d0ac]/20 font-mono">
                              {rsvp.numberOfGuests} người
                            </span>
                          ) : (
                            <span className="text-[#eedec2]/30">-</span>
                          )}
                        </td>
                        <td className="p-4 text-xs">
                          {rsvp.phoneNumber && (
                            <div className="flex items-center gap-1.5 text-[#eedec2]">
                              <Phone className="w-3.5 h-3.5 text-emerald-400" />
                              <a href={`tel:${rsvp.phoneNumber}`} className="hover:underline">
                                {rsvp.phoneNumber}
                              </a>
                            </div>
                          )}
                          {rsvp.email && (
                            <div className="flex items-center gap-1.5 text-[#eedec2]/70 mt-1">
                              <Mail className="w-3.5 h-3.5 text-[#dfb773]" />
                              <span>{rsvp.email}</span>
                            </div>
                          )}
                          {!rsvp.phoneNumber && !rsvp.email && (
                            <span className="text-[#eedec2]/30">-</span>
                          )}
                        </td>
                        <td className="p-4 text-xs text-[#eedec2]/80 max-w-xs">
                          {rsvp.notes ? (
                            <span className="italic text-[#eedec2] bg-[#101316] px-2.5 py-1 rounded-lg border border-[#e5d0ac]/15 block">
                              &ldquo;{rsvp.notes}&rdquo;
                            </span>
                          ) : (
                            <span className="text-[#eedec2]/30">-</span>
                          )}
                        </td>
                        <td className="p-4 text-xs text-[#eedec2]/60">
                          {new Date(rsvp.createdAt).toLocaleString("vi-VN", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: WISHES WALL */}
        {activeTab === "wishes" && (
          <div className="glass-card-gold rounded-3xl p-6 sm:p-8 border border-[#e5d0ac]/20 shadow-2xl space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-[#e5d0ac]/15">
              <div>
                <h3 className="text-lg font-bold text-white">
                  Sổ Lưu Bút Kỷ Niệm ({wishes.length} Lời Chúc Mừng)
                </h3>
                <p className="text-xs text-[#eedec2]/70 mt-0.5">
                  Tổng hợp tất cả lời chúc của bạn bè, thầy cô và người thân
                </p>
              </div>
              <button
                onClick={loadAllData}
                className="flex items-center gap-1 text-xs text-[#dfb773] hover:text-[#fef3c7] font-semibold"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Cập nhật</span>
              </button>
            </div>

            {wishes.length === 0 ? (
              <div className="py-16 text-center text-[#eedec2]/50 text-sm">
                Chưa có lời chúc nào được gửi.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {wishes.map((wish) => (
                  <div
                    key={wish.id}
                    className="glass-card rounded-3xl p-6 border border-[#e5d0ac]/20 hover:border-[#dfb773]/50 transition-all flex flex-col justify-between group shadow-xl"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-4">
                        <div className="flex items-center gap-3">
                          <div
                            style={{
                              backgroundColor: wish.avatarBgColor || "#dfb773",
                            }}
                            className="w-10 h-10 rounded-2xl flex items-center justify-center text-[#111417] text-sm font-black shadow-md shrink-0"
                          >
                            {wish.senderName.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <h4 className="text-sm sm:text-base font-bold text-white line-clamp-1">
                              {wish.senderName}
                            </h4>
                            {wish.relationship && (
                              <span className="text-[10px] font-semibold text-[#dfb773] bg-[#dfb773]/15 px-2 py-0.5 rounded-md border border-[#dfb773]/30">
                                {wish.relationship}
                              </span>
                            )}
                          </div>
                        </div>

                        <span className="text-2xl">{wish.emoji || "🎓"}</span>
                      </div>

                      <p className="text-xs sm:text-sm text-[#eedec2] leading-relaxed italic mb-5">
                        &ldquo;{wish.message}&rdquo;
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-[#e5d0ac]/15 text-xs text-[#eedec2]/60">
                      <span>
                        {new Date(wish.createdAt).toLocaleString("vi-VN", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>

                      <button
                        onClick={() => handleLike(wish.id)}
                        className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#101316] border border-[#e5d0ac]/20 text-[#eedec2] hover:text-rose-400 hover:border-rose-500/40 transition-all"
                      >
                        <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500/30" />
                        <span className="font-bold">{wish.likesCount}</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

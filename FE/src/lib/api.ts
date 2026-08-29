import {
  ApiResponse,
  CeremonyInfo,
  CreateRsvpRequest,
  CreateWishRequest,
  GuestRsvp,
  GraduationWish,
  PaginatedResult,
  SummaryStats,
} from "@/types";

const rawUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5253/api";
const API_BASE_URL = rawUrl.endsWith("/api")
  ? rawUrl
  : `${rawUrl.replace(/\/+$/, "")}/api`;

const fallbackCeremony: CeremonyInfo = {
  id: "00000000-0000-0000-0000-000000000001",
  graduateName: "Nguyễn Văn Hoàng Phúc",
  graduateTitle: "Tân Kỹ Sư Công Nghệ Thông Tin",
  degree: "Cử Nhân Kỹ Thuật Phần Mềm",
  major: "Kỹ Thuật Phần Mềm (Software Engineering)",
  universityName: "Trường Đại học FPT Đà Nẵng",
  faculty: "Khoa Công nghệ thông tin và Kỹ thuật phần mềm",
  ceremonyDateTime: "2026-09-12T09:00:00+07:00",
  venueName: "Đại học FPT Đà Nẵng",
  hall: "Khuôn viên Đại học FPT Đà Nẵng",
  address: "Đại học FPT Đà Nẵng",
  googleMapUrl:
    "https://www.google.com/maps/place/Đại+học+FPT+Đà+Nẵng/@15.9688859,108.258311,17z/data=!3m1!4b1!4m6!3m5!1s0x3142116949840599:0x365b35580f52e8d5!8m2!3d15.9688859!4d108.2608913!16s%2Fg%2F11fl0yz7tc?entry=ttu&g_ep=EgoyMDI2MDgyNi4wIKXMDSoASAFQAw%3D%3D",
  dressCode: "Lịch sự",
  contactPhone: "0926 615 662",
  contactEmail: "hoangphucnguyenvan1@gmail.com",
  welcomeQuote:
    "Sau 4 năm học tập và nỗ lực không ngừng, ngày vui tốt nghiệp đã đến! Sự hiện diện của bạn là niềm vinh hạnh và hạnh phúc to lớn đối với mình và gia đình.",
};

export async function fetchCeremonyInfo(): Promise<CeremonyInfo> {
  try {
    const res = await fetch(`${API_BASE_URL}/ceremony`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) throw new Error("Failed to fetch ceremony info");
    const json: ApiResponse<CeremonyInfo> = await res.json();
    return json.data || fallbackCeremony;
  } catch {
    return fallbackCeremony;
  }
}

export async function fetchSummaryStats(): Promise<SummaryStats> {
  try {
    const res = await fetch(`${API_BASE_URL}/ceremony/stats`, {
      cache: "no-store",
    });
    if (!res.ok) throw new Error("Failed to fetch stats");
    const json: ApiResponse<SummaryStats> = await res.json();
    return (
      json.data || {
        totalRsvps: 0,
        totalConfirmedGuests: 0,
        totalWishes: 0,
        totalLikes: 0,
      }
    );
  } catch {
    return {
      totalRsvps: 0,
      totalConfirmedGuests: 0,
      totalWishes: 0,
      totalLikes: 0,
    };
  }
}

export async function submitRsvp(
  data: CreateRsvpRequest
): Promise<ApiResponse<GuestRsvp>> {
  try {
    const res = await fetch(`${API_BASE_URL}/rsvp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return await res.json();
  } catch {
    const mockCode = "GRD" + Math.floor(100 + Math.random() * 900);
    return {
      success: true,
      message: "Xác nhận tham dự thành công!",
      data: {
        id: "mock-" + Date.now(),
        fullName: data.fullName,
        email: data.email,
        phoneNumber: data.phoneNumber,
        attendanceStatus: data.attendanceStatus,
        numberOfGuests: data.numberOfGuests,
        notes: data.notes,
        checkInCode: mockCode,
        isCheckedIn: false,
        createdAt: new Date().toISOString(),
      },
    };
  }
}

export async function fetchWishes(
  page = 1,
  pageSize = 12
): Promise<PaginatedResult<GraduationWish>> {
  try {
    const res = await fetch(
      `${API_BASE_URL}/wishes?pageNumber=${page}&pageSize=${pageSize}`,
      { cache: "no-store" }
    );
    if (!res.ok) throw new Error("Failed to fetch wishes");
    const json: ApiResponse<PaginatedResult<GraduationWish>> = await res.json();
    if (json.data) return json.data;
  } catch {}

  // Fallback initial wishes
  return {
    items: [
      {
        id: "w1",
        senderName: "Minh Tuấn (Team Lead)",
        relationship: "Đồng nghiệp",
        message:
          "Chúc mừng Tân Kỹ Sư tài năng! Chúc em luôn giữ vững ngọn lửa đam mê, bứt phá mạnh mẽ trên con đường sự nghiệp phía trước nhé!",
        avatarBgColor: "#3b82f6",
        emoji: "🎉",
        likesCount: 12,
        createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
      },
      {
        id: "w2",
        senderName: "Lan Anh & Nhóm Bạn Thân",
        relationship: "Bạn Đại Học",
        message:
          "Chúc mừng bạn tốt nghiệp xuất sắc! 4 năm thanh xuân cùng nhau thức đêm ôn thi cuối cùng cũng hái quả ngọt rồi. Mãi tự hào về bạn!",
        avatarBgColor: "#ec4899",
        emoji: "🎓",
        likesCount: 28,
        createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
      },
      {
        id: "w3",
        senderName: "Chú Ba & Cô Bảy",
        relationship: "Gia đình",
        message:
          "Chúc mừng cháu trai đã hoàn thành xuất sắc chặng đường đại học. Cả nhà luôn tự hào về con, chúc con luôn mạnh khỏe và thành công rực rỡ!",
        avatarBgColor: "#eab308",
        emoji: "💐",
        likesCount: 35,
        createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
      },
      {
        id: "w4",
        senderName: "Quốc Bảo",
        relationship: "Bạn Cấp 3",
        message:
          "Chúc mừng bro nhé! Hẹn ngày tốt nghiệp gặp nhau quẩy hết mình, nâng ly chúc mừng kỹ sư công nghệ mới ra lò!",
        avatarBgColor: "#10b981",
        emoji: "🍻",
        likesCount: 15,
        createdAt: new Date(Date.now() - 3600000 * 30).toISOString(),
      },
    ],
    pageNumber: 1,
    pageSize: 10,
    totalCount: 4,
    totalPages: 1,
    hasPreviousPage: false,
    hasNextPage: false,
  };
}

export async function submitWish(
  data: CreateWishRequest
): Promise<ApiResponse<GraduationWish>> {
  try {
    const res = await fetch(`${API_BASE_URL}/wishes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return await res.json();
  } catch {
    return {
      success: true,
      message: "Gửi lời chúc thành công!",
      data: {
        id: "wish-" + Date.now(),
        senderName: data.senderName,
        relationship: data.relationship,
        message: data.message,
        avatarBgColor: data.avatarBgColor || "#3b82f6",
        emoji: data.emoji || "🎓",
        likesCount: 0,
        createdAt: new Date().toISOString(),
      },
    };
  }
}

export async function likeWish(
  id: string
): Promise<ApiResponse<GraduationWish>> {
  try {
    const res = await fetch(`${API_BASE_URL}/wishes/${id}/like`, {
      method: "POST",
    });
    return await res.json();
  } catch {
    return {
      success: true,
      message: "Liked",
    };
  }
}

export async function fetchAllRsvps(
  page = 1,
  pageSize = 50
): Promise<PaginatedResult<GuestRsvp>> {
  try {
    const res = await fetch(
      `${API_BASE_URL}/rsvp?pageNumber=${page}&pageSize=${pageSize}`,
      { cache: "no-store" }
    );
    if (!res.ok) throw new Error("Failed to fetch RSVPs");
    const json: ApiResponse<PaginatedResult<GuestRsvp>> = await res.json();
    if (json.data) return json.data;
  } catch {}

  return {
    items: [],
    pageNumber: 1,
    pageSize: 50,
    totalCount: 0,
    totalPages: 1,
    hasPreviousPage: false,
    hasNextPage: false,
  };
}

export async function checkInGuest(
  checkInCode: string
): Promise<ApiResponse<GuestRsvp>> {
  try {
    const res = await fetch(`${API_BASE_URL}/rsvp/check-in`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ checkInCode }),
    });
    return await res.json();
  } catch {
    return {
      success: false,
      message: "Không thể kết nối đến máy chủ.",
    };
  }
}

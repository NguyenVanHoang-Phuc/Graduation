export type AttendanceStatus =
  | "Attending"
  | "NotAttending"
  | "AttendingCeremonyOnly"
  | "AttendingPartyOnly";

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  errors?: string[];
}

export interface PaginatedResult<T> {
  items: T[];
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface CeremonyInfo {
  id: string;
  graduateName: string;
  graduateTitle: string;
  degree: string;
  major: string;
  universityName: string;
  faculty: string;
  ceremonyDateTime: string;
  venueName: string;
  hall: string;
  address: string;
  googleMapUrl?: string;
  dressCode?: string;
  contactPhone?: string;
  contactEmail?: string;
  welcomeQuote?: string;
  agendaJson?: string;
  memoriesJson?: string;
}

export interface AgendaItem {
  time: string;
  title: string;
  description: string;
}

export interface MemoryItem {
  year: string;
  title: string;
  description: string;
  image?: string;
}

export interface GuestRsvp {
  id: string;
  fullName: string;
  email?: string;
  phoneNumber?: string;
  attendanceStatus: AttendanceStatus;
  numberOfGuests: number;
  notes?: string;
  checkInCode: string;
  isCheckedIn: boolean;
  checkedInAt?: string;
  createdAt: string;
}

export interface CreateRsvpRequest {
  fullName: string;
  email?: string;
  phoneNumber?: string;
  attendanceStatus: AttendanceStatus;
  numberOfGuests: number;
  notes?: string;
}

export interface GraduationWish {
  id: string;
  senderName: string;
  relationship?: string;
  message: string;
  avatarBgColor?: string;
  emoji?: string;
  likesCount: number;
  createdAt: string;
}

export interface CreateWishRequest {
  senderName: string;
  relationship?: string;
  message: string;
  avatarBgColor?: string;
  emoji?: string;
}

export interface SummaryStats {
  totalRsvps: number;
  totalConfirmedGuests: number;
  totalWishes: number;
  totalLikes: number;
}

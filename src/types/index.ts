export type UserRole = "ADMIN" | "USER" | "PARTNER" | "STAFF";

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  status: "VERIFIED" | "PENDING_VERIFICATION" | "BANNED";
  createdAt: string;
}

export type UserRole = "ADMIN" | "USER" | "PARTNER" | "STAFF";

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  status: "VERIFIED" | "PENDING_VERIFICATION" | "BANNED";
  createdAt: string;
}

export interface Product {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand: string;
  sku: string;
}

export interface ProductCategory {
  id: string;
  name: string;
}

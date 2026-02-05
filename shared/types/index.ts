import { CabinetStatus } from "../enums/cabinet-status.enum";
import { ProductStatus } from "../enums/product-status.enum";
import { StoreStatus } from "../enums/store-status.enum";
import { UserStatus } from "../enums/user-status.enum";

export type UserRole = "ADMIN" | "USER" | "PARTNER" | "STAFF";

export interface User {
  id: string;
  email: string;
  fullName: string;
  avatarUrl: string;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
  isActive: boolean;
}

export interface Partner {
  id: string;
  email: string;
  companyName: string;
  fullName: string;
  tier: string;
  revenueSharePercent: number;
  isActive: boolean;
  createdAt: string;
}

export interface Store {
  id: string;
  storeAddress: string;
  name: string;
  latitude: number;
  longitude: number;
  rating: number;
  images: string[];
  openTime: string;
  closeTime: string;
  openDay: string;
  status: StoreStatus;
  isActive: boolean;
  partnerId: string;
  phoneNumber: string;
}

export interface Cabinet {
  id: string;
  storeID: string;
  code?: string;
  name: string;
  numberOfSlot: number;
  locationDescription: string;
  layoutName: string;
  qrCodeUrl: string;
  images: string[];
  isOnline: boolean;
  isActive: boolean;
}

export interface Product {
  id: string;
  title?: string;
  description?: string;
  category?: string;
  price?: number;
  discountPercentage?: number;
  rating?: number;
  stock?: number;
  brand?: string;
  sku?: string;
  images?: string[];
  status?: ProductStatus;
  name?: string;
  material?: string;
  originCountry: string;
  ageRange: string;
  isActive: boolean;
}

export interface Order {
  id: string;
  storeId: string;
  totalAmount: number;
  status: "COMPLETE" | "FAILED" | "REFUND";
}

export interface Warehouse {
  id: string;
  address: string;
  name: string;
  code: string;
  isActive: boolean;
}

export interface ProductCategory {
  id: string;
  name: string;
  description: string;
  code: string;
  isActive: boolean;
}

export interface ProductColor {
  id: string;
  name: string;
}

export interface Report {
  id: string;
  store: string;
  staff: string;
  createdAt: string;
}

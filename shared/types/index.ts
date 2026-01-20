import { CabinetStatus } from "../enums/cabinet-status.enum";
import { ProductStatus } from "../enums/product-status.enum";
import { StoreStatus } from "../enums/store-status.enum";
import { UserStatus } from "../enums/user-status.enum";

export type UserRole = "ADMIN" | "USER" | "PARTNER" | "STAFF";

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
  isActive: boolean;
}

export interface Partner {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
}

export interface Store {
  id: string;
  address: string;
  name: string;
  latitude: number;
  longitude: number;
  rating: number;
  images: string[];
  openTime: string;
  closeTime: string;
  openDay: string;
  status: StoreStatus;
}

export interface Cabinet {
  id: string;
  storeID: string;
  name: string;
  numberOfSlot: number;
  layoutName: string;
  qrCodeUrl: string;
  images: string[];
  status: CabinetStatus;
}

export interface Product {
  id?: number;
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
}

export interface Order {
  id: string;
  storeId: string;
  totalAmount: number;
  status: "COMPLETE" | "FAILED" | "REFUND";
}

export interface ProductCategory {
  id: string;
  name: string;
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

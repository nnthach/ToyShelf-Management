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
  roles: string[];
}

export interface Partner {
  id: string;
  partnerId: string;
  email: string;
  companyName: string;
  fullName: string;
  partnerTierId: string;
  partnerTierName: string;
  isActive: boolean;
  createdAt: string;
  partnerIsActive: boolean;
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

export interface Color {
  id: string;
  name: string;
  hexCode: string;
  skuCode: string;
}

export interface ProductColorItem {
  id: string;
  productId: string;
  sku: string;
  priceSegmentId: string;
  colorId: string;
  price: number;
  qrCode: string;
  model3DUrl: string;
  imageUrl: string;
  isActive: boolean;
}

export interface Product {
  id: string;
  productCategoryId: string;
  sku: string;
  name: string;
  description: string;
  price: number;
  brand: string;
  material: string;
  originCountry: string;
  ageRange: string;
  isActive: boolean;
  isConsignment: boolean;
  createdAt: string;
  updatedAt: string | null;
  colors: ProductColorItem[];
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
  latitude: number;
  longitude: number;
  name: string;
  code: string;
  cityId: string;
  cityName: string;
  cityCode: string;
  isActive: boolean;
}

export interface ProductCategory {
  id: string;
  name: string;
  description: string;
  code: string;
  isActive: boolean;
}

export interface ProductPriceSegment {
  id: string;
  code: string;
  name: string;
  minPrice: number;
  maxPrice: number;
}

export interface PartnerTier {
  id: string;
  name: string;
  priority: number;
}

export interface Role {
  id: string;
  name: string;
  description: string;
}

export interface PriceTableItem {
  id: string;
  priceSegmentId: string;
  priceSegmentName: string;
  commissionRate: number;
}

export interface PriceTable {
  id: string;
  name: string;
  type: string;
  partnerTierId: string;
  partnerTierName: string;
  isActive: boolean;
  items: PriceTableItem[];
}

export interface CommissionPolicy {
  id: string;
  partnerTierId: string;
  partnerTierName: string;
  priceSegmentId: string;
  priceSegmentName: string;
  commissionRate: number;
  effectiveDate: string;
}

export interface Report {
  id: string;
  store: string;
  staff: string;
  createdAt: string;
}

export interface City {
  id: string;
  code: string;
  name: string;
}

export interface StoreInvite {
  id: string;
  storeId: string;
  userId: string;
  email: string;
  storeRole: "Manager" | "Staff";
  status: "Pending" | "Accepted" | "Rejected" | "Expired";
}

export interface Inventory {
  id: string;
  inventoryLocationId: string;
  productColorId: string;
  dispositionId: string;
  quantity: 0;
}

export interface InventoryLocation {
  id: string;
  type: string;
  warehouseId: string;
  storeId: string;
  name: string;
  isActive: boolean;
}

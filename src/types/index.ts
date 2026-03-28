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

export interface StoreStaff {
  userId: string;
  fullName: string;
  avatarUrl: string;
  storeRole: string;
  email: string;
}

export interface WarehouseStaff {
  userId: string;
  fullName: string;
  warehouseRole: string;
  warehouseName: string;
  warehouseId: string;
  warehouseLocationIds: string[];
  email: string;
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
  ownerName: string;
  inventoryLocationId: string;
  latitude: number;
  longitude: number;
  isActive: boolean;
  partnerId: string;
  phoneNumber: string;
  cityName: string;
  requestedByUserId: string;
  reviewedByUserId: string;
  rejectReason: string;
  reviewedByUserName: string;
  reviewedByUserEmail: string;
  partnerName: string;
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
  productColorSku: string;
  priceSegmentId: string;
  colorId: string;
  price: number;
  productColorPrice: number;
  qrCode: string;
  model3DUrl: string;
  imageUrl: string;
  hexcode: string;
  hexCode: string;
  isActive: boolean;
  colorName?: string;
  quantity: number;
  available: number;
  inTransit: number;
  damaged: number;
  sold: number;
}

export interface Product {
  id: string;
  productId?: string;
  productCategoryId: string;
  productCategoryName: string;
  sku: string;
  name: string;
  productName: string;
  description: string;
  basePrice: number;
  brand: string;
  material: string;
  originCountry: string;
  ageRange: string;
  length: number;
  width: number;
  height: number;
  weight: number;
  isActive: boolean;
  isConsignment: boolean;
  createdAt: string;
  updatedAt: string | null;
  colors: ProductColorItem[];
}

export interface Order {
  id: string;
  storeName: string;
  totalAmount: number;
  orderCode: number;
  status: string;
  paymentMethod: string;
  customerName: string;
  createdAt: string;
  customerPhone: string;

  items: RefillRequestProductColor[];
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

export interface CommissionTableItem {
  id: string;
  appliedCategories: ProductCategory[];
  productCategoryIds: ProductCategory[];
  commissionRate: number;
}

export interface CommissionTable {
  id: string;
  name: string;
  type: string;
  partnerTierId: string;
  partnerTierName: string;
  isActive: boolean;
  items: CommissionTableItem[];
}

export interface CommissionTableApply {
  id: string;
  partnerId: string;
  partnerName: string;
  priceTableId: string;
  priceTableName: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  name: string;
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

export interface MyStore {
  storeId: string;
  storeRole: string;
  storeName: string;
  storeCode: string;
}

export interface Inventory {
  id: string;
  inventoryLocationId: string;
  productColorId: string;
  dispositionId: string;
  quantity: 0;
}

export interface InventoryDisposition {
  id: string;
  code: string;
  description: string;
}

export interface InventoryLocation {
  id: string;
  type: string;
  warehouseId: string;
  storeId: string;
  name: string;
  isActive: boolean;
}

export interface RefillRequestProductColor {
  productColorId?: string;
  productName?: string;
  sku?: string;
  imageUrl?: string;
  price?: number;
  quantity: number;
  subTotal?: number;
  color?: string;
  fulfilledQuantity?: number;
  expectedQuantity?: number;
  receivedQuantity?: number;
  displayExpected?: number;
  displayReceived?: number;
  availableQuantity?: number;
}

export interface RefillRequest {
  id: string;
  code: string;
  storeLocationId: string;
  requestedByUserId: string;
  approvedByUserId: string;
  rejectedByUserId: string;
  storeName: string;
  requestName: string;
  storeAddress: string;
  status: string;
  createdAt: string;
  approvedAt: string;
  rejectedAt: string;
  items: RefillRequestProductColor[];
}

export interface Payment {
  id: string;
  orderCode: number;
  totalAmount: number;
  paymentMethod: string;
  status: string;
  createdAt: string;
  storeName: string;
  items: RefillRequestProductColor[];
}

export interface MonthlySettlement {
  id: string;
  partnerId: string;
  partnerName: string;
  month: number;
  year: number;
  totalItems: number;
  totalCommissionAmount: number;
  status: string;
  createdAt: string;
  histories: MonthlySettlementHistory[];
}

export interface MonthlySettlementHistory {
  id: string;
  orderItemId: string;
  appliedRate: number;
  commissionAmount: number;
  createdAt: string;
}

export interface ShipmentAssign {
  id: string;
  storeOrderId: string;
  storeOrderCode: string;
  warehouseLocationId: string;
  warehouseLocationName: string;
  storeLocationId: string;
  storeLocationName: string;
  shipperName: string;
  createdByName: string;
  assignedByName: string;
  status: string;
  createdAt: string;
  respondedAt: string;
  items: RefillRequestProductColor[];
}

export interface Shipment {
  id: string;
  code: string;
  storeOrderId: string;
  toLocationId: string;
  toLocationName: string;
  fromLocationId: string;
  fromLocationName: string;
  shipperName: string;
  status: string;
  createdAt?: string;
  pickedUpAt?: string;
  deliveredAt?: string;
  receivedAt?: string;
  items: RefillRequestProductColor[];
}

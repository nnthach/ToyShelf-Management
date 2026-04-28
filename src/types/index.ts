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
  businessRole: string;
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
  code: string;
  fullName: string;
  partnerTierId: string;
  partnerTierName: string;
  isActive: boolean;
  createdAt: string;
  partnerIsActive: boolean;
  partnerTierPriority: number;
  partnerAccount: User;
  currentCommission: CommissionTable;
  commissionHistories: CommissionTable[];
  address: string;
  latitude: number;
  longitude: number;
  maxShelvesPerStore: number;
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
  productColorId: string;
  sku: string;
  productColorSku: string;
  productName: string;
  productSku: string;
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
  name: string;
  variantSku: string;
}

export interface Product {
  id: string;
  productId?: string;
  productCategoryId: string;
  productCategoryName: string;
  productSKU: string;
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
  bankReference: string;
  customerEmail: string;
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
  warehouseLocationId: string;
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
  isActive: boolean;
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
  startDate: string;
  endDate: string;
  commissionTableId: string;
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

export interface DailySummary {
  date: string;
  totalOrders: number;
  totalSalesAmount: number;
  totalCommissionAmount: number;
  totalProductsSold: number;
  transactions: CommissionHistory[];
}
export interface CommissionHistory {
  id: string;
  orderItemId: string;
  appliedRate: number;
  commissionAmount: number;
  createdAt: string;
  quantity: number;
  orderCode: number;
  paymentMethod: string;
  orderDate: string;
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
  storeName: string;
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
  storeLocationId: string;
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

export interface ShelfLevelItem {
  level: number;
  name: string;
  clearanceHeight: number;
  recommendedCapacity: number;
  suitableProductCategoryTypes: string[];
  displayGuideline: string;
}

export interface ShelfShelf {
  id: string;
  inventoryLocationId: string;
  shelfTypeId: string;
  code: string;
  status: string;
  assignedAt: string;
  unassignedAt: string;
  shelfType: Shelf;
}

export interface InventoryShelf {
  locationId: string;
  locationName: string;
  type: string;
  shelves: Shelf[];
}

export interface Shelf {
  id: string;
  shelfTypeId: string;
  shelfTypeName: string;
  quantity: number;
  name: string;
  imageUrl: string;
  width: number;
  height: number;
  depth: number;
  totalLevels: number;
  suitableProductCategoryTypes: string[];
  available: number;
  reserved: number;
  inTransit: number;
  inUse: number;
  recalled: number;
  displayGuideline: string;
  isActive: boolean;
  levels: ShelfLevelItem[];
}

export interface RefillRequestProductColor {
  shipmentItemId?: string;
  storeOrderItemId?: string;
  productColorId?: string;
  productName?: string;
  itemId?: string;
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
  remainingQuantity?: number;
  originalQuantity?: number;
  storeOrderId?: string;
  commissionRate?: number;
  commissionAmount?: number;
}

export interface RefillShelfItem {
  shelfTypeName?: string;
  shelfTypeId?: string;
  imageUrl?: string;
  width: number;
  height: number;
  depth: number;
  totalLevels: number;
  quantity: number;
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
  approveName: string;
  rejectName: string;
  storeAddress: string;
  status: string;
  adminNote: string;
  createdAt: string;
  approvedAt: string;
  rejectedAt: string;
  partnerAdminName?: string;
  partnerAdminApprovedAt?: string;
  note: string;
  items: RefillRequestProductColor[] | RefillShelfRequestItem[];
}

export interface DamageReportProductItem {
  productColorId: string;
  productName: string;
  sku: string;
  colorName: string;
  imageUrl: string;
}

export interface DamageReportShelfItem {
  shelfId: string;
  shelfCode: string;
  shelfName: string;
  imageUrl: string;
}

export interface DamageReportItem {
  id: string;
  type: string;
  quantity: number;
  product: DamageReportProductItem;
  shelf: DamageReportShelfItem;
  mediaUrls: string[];
}

export interface DamageReport {
  id: string;
  code: string;
  type: string;
  source: string;
  status: string;
  storeName: string;
  storeAddress: string;
  description: string;
  adminNote: string;
  isWarrantyClaim: boolean;
  reportedByUserId: string;
  reportedByName: string;
  reviewedByUserId: string;
  reviewedByName: string;
  createdAt: string;
  reviewedAt: string;
  items: DamageReportItem[];
  partnerAdminName?: string;
  partnerAdminApprovedAt?: string;
}

export interface RefillShelfRequestItem {
  shelfTypeId?: string;
  shelfOrderId?: string;
  shelfOrderItemId?: string;
  shelfTypeName?: string;
  imageUrl?: string;
  width: number;
  height: number;
  depth: number;
  totalLevels: number;
  quantity: number;
  fulfilledQuantity?: number;
  expectedQuantity?: number;
  receivedQuantity?: number;
  displayExpected?: number;
  displayReceived?: number;
  originalQuantity?: number;
  remainingQuantity?: number;
  availableQuantity?: number;
}

export interface RefillShelfRequest {
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
  adminNote: string;
  approvedAt: string;
  rejectedAt: string;
  partnerAdminName?: string;
  partnerAdminApprovedAt?: string;
  items: RefillShelfRequestItem[];
}

export interface ShipmentReceiveResponse {
  data: ShipmentReceiveData;
}

export interface ShipmentReceiveData {
  shipmentId: string;
  shipmentCode: string;
  fromLocationName: string;
  toLocationName: string;
  productItems?: ShipmentProductItem[];
  shelfItems?: ShipmentShelfItem[];
}

export interface ShipmentProductItem {
  shipmentItemId: string;
  productColorId: string;
  productName: string;
  colorName: string;
  imageUrl: string;
  expectedQuantity: number;
}

export interface ShipmentShelfItem {
  shelfShipmentItemId: string;
  shelfId: string;
  shelfCode: string;
  shelfTypeName: string;
  imageUrl: string;
  width: string;
  height: string;
  depth: string;
  totalLevels: string;
}

export interface CheckReceiveShelfItem {
  shelfId: string;
  code: string;
  shelfTypeName: string;
  status: string;
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
  shelfOrderId: string;
  shelfOrderCode: string;
  orderType: string;
  warehouseLocationId: string;
  warehouseLocationName: string;
  storeLocationId: string;
  storeLocationName: string;
  shipperName: string;
  createdByName: string;
  assignedByName: string;
  shipmentStatus: string;
  status: string;
  adminNote: string;
  createdAt: string;
  respondedAt: string;
  productItems: RefillRequestProductColor[];
  shelfItems: RefillShelfItem[];
  damageReturnItems: ShipmentDamageItem[];
}

export interface ShipmentDamageItem {
  damageReportId: string;
  damageCode: string;
  damageType: string;
  source: string;
  quantity: number;
  targetName: string;
  description: string;
  imageUrl: string;
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
  storeReceivedAt?: string;
  arrivedWarehouseAt?: string;
  returnPickedUpAt?: string;
  warehouseReceivedAt?: string;
  productItems: RefillRequestProductColor[];
  shelfItems: RefillShelfItem[];
}

export interface ChartItem {
  dateLabel: string;
  totalOrders: number;
  totalRevenue: number;
}

export interface Notification {
  id: string;
  title: string;
  content: string;
  isRead: boolean;
  createdAt: string;
}

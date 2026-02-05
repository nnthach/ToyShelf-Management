// constants/menuData.ts
import {
  Bell,
  Calendar,
  LayoutDashboard,
  Search,
  Settings,
  Package,
  Store,
  User,
  UserStar,
  Users,
  Server,
  CircleStar,
  Palette,
  Funnel,
  Receipt,
  ClipboardList,
  Award,
  Warehouse,
} from "lucide-react";

// Admin
export const AdminSidebarGroups = [
  {
    label: "application",
    items: [
      { title: "dashboard", url: "/admin/dashboard", icon: LayoutDashboard },
      { title: "notifications", url: "#", icon: Bell, badge: true },
      { title: "settings", url: "#", icon: Settings },
    ],
  },
  {
    label: "products",
    items: [{ title: "products", url: "/admin/products", icon: Package }],
  },

  {
    label: "orders",
    items: [{ title: "orders", url: "/admin/orders", icon: ClipboardList }],
  },
];

export const AdminSidebarNested = [
  {
    label: "accountManagement",
    sub: [
      { title: "userAccounts", url: "/admin/users", icon: User },
      { title: "staffAccounts", url: "/admin/staffs", icon: UserStar },
      { title: "partnerAccounts", url: "/admin/partners", icon: Users },
    ],
  },
  {
    label: "warehouseManagement",
    sub: [{ title: "warehouse", url: "/admin/warehouse", icon: Warehouse }],
  },
  {
    label: "storeManagement",
    sub: [
      { title: "stores", url: "/admin/stores", icon: Store },
      { title: "cabinets", url: "/admin/cabinets", icon: Server },
    ],
  },

  {
    label: "requestManagement",
    sub: [
      { title: "refillStock", url: "/admin/request/refill-stock", icon: Store },
    ],
  },

  {
    label: "otherManagement",
    sub: [
      { title: "partnerLevel", url: "/admin/partner-level", icon: CircleStar },
      { title: "productColor", url: "/admin/product-color", icon: Palette },
      { title: "productType", url: "/admin/product-type", icon: Funnel },
      {
        title: "productPriceLevel",
        url: "/admin/product-price-level",
        icon: Award,
      },
    ],
  },
];

// Partner admin
export const PartnerAdminSidebarGroups = [
  {
    label: "application",
    items: [
      { title: "dashboard", url: "/partner/dashboard", icon: LayoutDashboard },
      { title: "notifications", url: "#", icon: Bell, badge: true },
      { title: "settings", url: "#", icon: Settings },
    ],
  },
  {
    label: "staffManagement",
    items: [{ title: "staffAccounts", url: "/partner/staffs", icon: UserStar }],
  },
  {
    label: "products",
    items: [{ title: "products", url: "/partner/products", icon: Package }],
  },

  {
    label: "orders",
    items: [{ title: "orders", url: "/partner/orders", icon: ClipboardList }],
  },
];

export const PartnerAdminSidebarNested = [
  {
    label: "storeManagement",
    sub: [
      { title: "stores", url: "/partner/stores", icon: Store },
      { title: "cabinets", url: "/partner/cabinets", icon: Server },
    ],
  },
  {
    label: "requestManagement",
    sub: [
      { title: "stores", url: "/partner/stores", icon: Store },
      { title: "cabinets", url: "/partner/cabinets", icon: Server },
    ],
  },
];

// Warehouse manager
export const WarehouseManagerSidebarGroups = [
  {
    label: "application",
    items: [
      {
        title: "dashboard",
        url: "/warehouse/dashboard",
        icon: LayoutDashboard,
      },
      { title: "notifications", url: "#", icon: Bell, badge: true },
      { title: "settings", url: "#", icon: Settings },
    ],
  },
];

export const WarehouseManagerSidebarNested = [
  {
    label: "accountManagement",
    sub: [{ title: "staffAccounts", url: "/warehouse/staffs", icon: UserStar }],
  },
  {
    label: "storeManagement",
    sub: [
      { title: "stores", url: "/warehouse/stores", icon: Store },
      { title: "cabinets", url: "/warehouse/cabinets", icon: Server },
    ],
  },
];

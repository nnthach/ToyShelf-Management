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
    ],
  },
];

// Partner admin
export const PartnerAdminSidebarGroups = [
  {
    label: "application",
    items: [
      { title: "dashboard", url: "/admin/dashboard", icon: LayoutDashboard },
      { title: "notifications", url: "#", icon: Bell, badge: true },
      { title: "settings", url: "#", icon: Settings },
    ],
  },
];

export const PartnerAdminSidebarNested = [
  {
    label: "accountManagement",
    sub: [{ title: "staffAccounts", url: "/partner/staffs", icon: UserStar }],
  },
  {
    label: "storeManagement",
    sub: [
      { title: "stores", url: "/partner/stores", icon: Store },
      { title: "cabinets", url: "/partner/cabinets", icon: Server },
    ],
  },
];

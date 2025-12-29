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
} from "lucide-react";

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
];

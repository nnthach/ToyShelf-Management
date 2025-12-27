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
    label: "Application",
    items: [
      { title: "Dashboard", url: "/admin/dashboard", icon: LayoutDashboard },
      { title: "Notifications", url: "#", icon: Bell, badge: true },
      { title: "Calendar", url: "#", icon: Calendar },
      { title: "Search", url: "#", icon: Search },
      { title: "Settings", url: "#", icon: Settings },
    ],
  },
  {
    label: "Products",
    items: [{ title: "Products", url: "/admin/products", icon: Package }],
  },
];

export const AdminSidebarNested = [
  {
    label: "Account Management",
    sub: [
      { title: "User Accounts", url: "/admin/users", icon: User },
      { title: "Staff Accounts", url: "/admin/staffs", icon: UserStar },
      { title: "Partner Accounts", url: "/admin/partners", icon: Users },
    ],
  },
  {
    label: "Store Management",
    sub: [
      { title: "Store", url: "/admin/stores", icon: Store },
      { title: "Cabinet", url: "/admin/staffs", icon: Server },
    ],
  },

  {
    label: "Store Management",
    sub: [
      { title: "Store", url: "/admin/stores", icon: Store },
      { title: "Cabinet", url: "/admin/staffs", icon: Server },
    ],
  },
];

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
    label: "Ứng dụng",
    items: [
      { title: "Tổng quan", url: "/admin/dashboard", icon: LayoutDashboard },
      { title: "Thông báo", url: "#", icon: Bell, badge: true },
      { title: "Cài đặt", url: "#", icon: Settings },
    ],
  },
  {
    label: "Quản lý đơn hàng",
    items: [{ title: "Đơn hàng", url: "/admin/orders", icon: ClipboardList }],
  },
];

export const AdminSidebarNested = [
  {
    label: "Quản lý tài khoản",
    sub: [
      { title: "Người dùng tài khoản", url: "/admin/users", icon: User },
      { title: "Nhân viên tài khoản", url: "/admin/staffs", icon: UserStar },
      { title: "Đối tác tài khoản", url: "/admin/partners", icon: Users },
    ],
  },

  {
    label: "Quản lý sản phẩm",
    sub: [
      { title: "Sản phẩm", url: "/admin/products", icon: User },
      { title: "Màu sắc", url: "/admin/product-color", icon: Palette },
      { title: "Danh mục", url: "/admin/product-type", icon: Funnel },
      {
        title: "Cấp bậc giá sản phẩm",
        url: "/admin/product-price-segment",
        icon: Award,
      },
    ],
  },
  {
    label: "Quản lý kho",
    sub: [{ title: "Kho", url: "/admin/warehouse", icon: Warehouse }],
  },
  {
    label: "Giám sát cửa hàng",
    sub: [
      { title: "Cửa hàng", url: "/admin/stores", icon: Store },
      { title: "Kệ", url: "/admin/shelf", icon: Server },
    ],
  },

  {
    label: "Yêu cầu",
    sub: [
      {
        title: "Thêm sản phẩm",
        url: "/admin/request/refill-stock",
        icon: Store,
      },
    ],
  },

  {
    label: "Khác",
    sub: [
      {
        title: "Cấp bậc đối tác",
        url: "/admin/partner-level",
        icon: CircleStar,
      },
      {
        title: "Bảng giá hoa hồng đối tác",
        url: "/admin/price-table",
        icon: CircleStar,
      },
      {
        title: "Chính sách hoa hồng",
        url: "/admin/commission-policy",
        icon: CircleStar,
      },
            {
        title: "Danh sách thành phố",
        url: "/admin/city",
        icon: CircleStar,
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

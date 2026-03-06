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
    label: "Giám sát đơn hàng",
    items: [{ title: "Đơn hàng", url: "/admin/orders", icon: ClipboardList }],
  },

  {
    label: "Tài khoản nhân viên",
    items: [
      { title: "Tài khoản nhân viên", url: "/admin/staffs", icon: UserStar },
    ],
  },
];

export const AdminSidebarNested = [
  {
    label: "Quản lý đối tác",
    sub: [
      { title: "Đối tác", url: "/admin/partners", icon: Users },
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
    ],
  },

  {
    label: "Quản lý sản phẩm",
    sub: [
      { title: "Sản phẩm", url: "/admin/products", icon: User },
      { title: "Màu sắc sản phẩm", url: "/admin/product-color", icon: Palette },
      { title: "Danh mục sản phẩm", url: "/admin/product-type", icon: Funnel },
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
        title: "Bổ sung hàng hóa",
        url: "/admin/request/refill-stock",
        icon: Store,
      },

      {
        title: "Thanh toán hoa hồng",
        url: "/admin/request/refill-stock",
        icon: Store,
      },

      {
        title: "Bổ sung kệ",
        url: "/admin/request/refill-shelf",
        icon: Store,
      },

      {
        title: "Trả hàng",
        url: "/admin/request/return-request",
        icon: Store,
      },

      {
        title: "Thu hồi tủ",
        url: "/admin/request/return-shelf",
        icon: Store,
      },
    ],
  },

  {
    label: "Khác",
    sub: [
      {
        title: "Danh sách thành phố",
        url: "/admin/city",
        icon: CircleStar,
      },
      {
        title: "Chức vụ",
        url: "/admin/roles",
        icon: CircleStar,
      },
    ],
  },
];

// Partner admin
export const PartnerAdminSidebarGroups = [
  {
    label: "Ứng dụng",
    items: [
      { title: "Tổng quan", url: "/partner/dashboard", icon: LayoutDashboard },
      { title: "Thông báo", url: "#", icon: Bell, badge: true },
      { title: "Cài đặt", url: "#", icon: Settings },
    ],
  },
  {
    label: "Quản lý cửa hàng",
    items: [
      { title: "Cửa hàng", url: "/partner/stores", icon: Store },
      {
        title: "Lời mời tham gia cửa hàng",
        url: "/partner/store-invitation",
        icon: Store,
      },
    ],
  },
  {
    label: "Quản lý nhân sự",
    items: [
      { title: "Tài khoản nhân viên", url: "/partner/staffs", icon: UserStar },
    ],
  },
  {
    label: "Đơn hàng",
    items: [{ title: "Đơn hàng", url: "/partner/orders", icon: ClipboardList }],
  },
];

export const PartnerAdminSidebarNested = [
  {
    label: "Quản lý yêu cầu",
    sub: [
      {
        title: "Bổ sung kệ",
        url: "/partner/refill-shelf",
        icon: Store,
      },
      {
        title: "Báo cáo hằng ngày",
        url: "/partner/daily-reports",
        icon: Store,
      },
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
      { title: "Kệ", url: "/warehouse/cabinets", icon: Server },
    ],
  },
];

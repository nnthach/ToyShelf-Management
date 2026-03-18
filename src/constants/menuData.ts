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
  Medal,
  Table,
  FileText,
  FilePlus,
  PackagePlus,
  Wallet,
  LayoutGrid,
  RotateCcw,
  ArchiveRestore,
  MapPin,
  ShieldCheck,
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

  {
    label: "Hàng tồn kho",
    items: [
      {
        title: "Quản lý bổ sung hàng",
        url: "/admin/inventory",
        icon: UserStar,
      },
      {
        title: "Trạng thái hàng tồn kho",
        url: "/admin/inventory-disposition",
        icon: ShieldCheck,
      },
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
        icon: Medal,
      },
      {
        title: "Bảng giá hoa hồng đối tác",
        url: "/admin/price-table",
        icon: Table,
      },
      {
        title: "Chính sách hoa hồng",
        url: "/admin/commission-policy",
        icon: FileText,
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
      {
        title: "Yêu cầu tạo cửa hàng",
        url: "/admin/store-creation-request",
        icon: FilePlus,
      },
      { title: "Kệ", url: "/admin/shelf", icon: Server },
    ],
  },

  {
    label: "Yêu cầu",
    sub: [
      {
        title: "Thanh toán hoa hồng",
        url: "/admin/refill-stock",
        icon: Wallet,
      },
      {
        title: "Bổ sung hàng hóa",
        url: "/admin/refill-stock",
        icon: PackagePlus,
      },

      {
        title: "Bổ sung kệ",
        url: "/admin/refill-shelf",
        icon: LayoutGrid,
      },

      {
        title: "Trả hàng",
        url: "/admin/return-request",
        icon: RotateCcw,
      },

      {
        title: "Thu hồi tủ",
        url: "/admin/return-shelf",
        icon: ArchiveRestore,
      },
    ],
  },

  {
    label: "Khác",
    sub: [
      {
        title: "Danh sách thành phố",
        url: "/admin/city",
        icon: MapPin,
      },
      {
        title: "Chức vụ",
        url: "/admin/roles",
        icon: ShieldCheck,
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
        title: "Yêu cầu tạo cửa hàng",
        url: "/partner/store-creation-request",
        icon: Store,
      },
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
    ],
  },
];

// Warehouse manager
export const WarehouseManagerSidebarGroups = [
  {
    label: "Ứng dụng",
    items: [
      {
        title: "Tổng quan",
        url: "/warehouse/dashboard",
        icon: LayoutDashboard,
      },
      { title: "Thông báo", url: "#", icon: Bell, badge: true },
    ],
  },

  {
    label: "Nhân viên giao hàng",
    items: [
      {
        title: "Tài khoản nhân viên giao hàng",
        url: "/warehouse/shipper",
        icon: UserStar,
      },
    ],
  },

  {
    label: "Hàng tồn kho",
    items: [
      {
        title: "Quản lý hàng tồn kho",
        url: "/warehouse/inventory",
        icon: UserStar,
      },
    ],
  },

  {
    label: "Yêu cầu",
    items: [
      {
        title: "Bổ sung hàng hóa",
        url: "/warehouse/refill-stock",
        icon: PackagePlus,
      },

      {
        title: "Bổ sung kệ",
        url: "/warehouse/refill-shelf",
        icon: LayoutGrid,
      },

      {
        title: "Trả hàng",
        url: "/warehouse/return-request",
        icon: RotateCcw,
      },

      {
        title: "Thu hồi tủ",
        url: "/warehouse/return-shelf",
        icon: ArchiveRestore,
      },
    ],
  },
];

export const WarehouseManagerSidebarNested = [
  {
    label: "Yêu cầu",
    sub: [
      {
        title: "Trả hàng",
        url: "/admin/return-request",
        icon: RotateCcw,
      },
    ],
  },
];

// Store manager
export const StoreManagerSidebarGroups = [
  {
    label: "Ứng dụng",
    items: [
      {
        title: "Tổng quan",
        url: "/manager/dashboard",
        icon: LayoutDashboard,
      },
      { title: "Thông báo", url: "#", icon: Bell, badge: true },
    ],
  },

  {
    label: "Hàng tồn kho",
    items: [
      {
        title: "Quản lý hàng tồn kho",
        url: "/manager/inventory",
        icon: UserStar,
      },
    ],
  },
  {
    label: "Nhân viên cửa hàng",
    items: [
      { title: "Tài khoản nhân viên", url: "/manager/staffs", icon: UserStar },
    ],
  },

  {
    label: "Yêu cầu",
    items: [
      {
        title: "Bổ sung hàng hóa",
        url: "/manager/refill-stock",
        icon: PackagePlus,
      },

      {
        title: "Bổ sung kệ",
        url: "/manager/refill-shelf",
        icon: LayoutGrid,
      },

      {
        title: "Trả hàng",
        url: "/manager/return-request",
        icon: RotateCcw,
      },

      {
        title: "Thu hồi tủ",
        url: "/manager/return-shelf",
        icon: ArchiveRestore,
      },
    ],
  },
];

export const StoreManagerSidebarNested = [
  {
    label: "Yêu cầu",
    sub: [
      {
        title: "Trả hàng",
        url: "/manager/return-request",
        icon: RotateCcw,
      },
    ],
  },
];

export const StoreStaffSidebarGroups = [
  {
    label: "Ứng dụng",
    items: [
      {
        title: "Tổng quan",
        url: "/manager/dashboard",
        icon: LayoutDashboard,
      },
      { title: "Thông báo", url: "#", icon: Bell, badge: true },
    ],
  },

  {
    label: "Hàng tồn kho",
    items: [
      {
        title: "Quản lý hàng tồn kho",
        url: "/staff/inventory",
        icon: UserStar,
      },
    ],
  },

  {
    label: "Đơn hàng",
    items: [
      {
        title: "Danh sách đơn hàng",
        url: "/staff/order",
        icon: UserStar,
      },
    ],
  },
];

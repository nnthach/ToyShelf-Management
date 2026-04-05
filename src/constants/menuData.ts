import {
  Bell,
  LayoutDashboard,
  Settings,
  Store,
  User,
  UserStar,
  Users,
  Server,
  Palette,
  Funnel,
  ClipboardList,
  Warehouse,
  Medal,
  Table,
  FilePlus,
  PackagePlus,
  Wallet,
  LayoutGrid,
  RotateCcw,
  ArchiveRestore,
  MapPin,
  ShieldCheck,
  PlusCircle,
  Ticket,
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
    label: "Đổi soát hoa hồng",
    items: [
      {
        title: "Danh sách đổi soát",
        url: "/admin/monthly-settlement",
        icon: ClipboardList,
      },
    ],
  },

  {
    label: "Quản lý nhân viên",
    items: [
      { title: "Tài khoản nhân viên", url: "/admin/staffs", icon: UserStar },
    ],
  },
];

export const AdminSidebarNested = [
  {
    label: "Quản lý loại kệ",
    sub: [
      { title: "Kệ", url: "/admin/shelf", icon: Server },
      { title: "Danh sách loại kệ", url: "/admin/shelf-type", icon: Server },
    ],
  },
  {
    label: "Quản lý đối tác",
    sub: [
      { title: "Đối tác", url: "/admin/partners", icon: Users },
      {
        title: "Cấp bậc đối tác",
        url: "/admin/partner-tier",
        icon: Medal,
      },
      {
        title: "Bảng hoa hồng",
        url: "/admin/commission-table",
        icon: Table,
      },
      {
        title: "Áp dụng bảng hoa hồng",
        url: "/admin/commission-table-apply",
        icon: Table,
      },
    ],
  },

  {
    label: "Quản lý sản phẩm",
    sub: [
      { title: "Sản phẩm", url: "/admin/products", icon: User },
      { title: "Màu sắc sản phẩm", url: "/admin/product-color", icon: Palette },
      {
        title: "Danh mục sản phẩm",
        url: "/admin/product-category",
        icon: Funnel,
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
    ],
  },
  {
    label: "Quản lý hàng tồn kho",
    sub: [
      {
        title: "Quản lý bổ sung hàng",
        url: "/admin/inventory",
        icon: UserStar,
      },

      {
        title: "Giám sát hàng tồn kho",
        url: "/admin/all-inventory",
        icon: UserStar,
      },
    ],
  },

  {
    label: "Yêu cầu",
    sub: [
      {
        title: "Thanh toán hoa hồng",
        url: "/admin/monthly-settlement",
        icon: Wallet,
      },
      {
        title: "Đặt hàng",
        url: "/admin/refill-stock",
        icon: PackagePlus,
      },

      {
        title: "Đặt kệ",
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
    ],
  },
  {
    label: "Đơn hàng",
    items: [{ title: "Đơn hàng", url: "/partner/orders", icon: ClipboardList }],
  },

  {
    label: "Quản lý nhân sự",
    items: [
      { title: "Tài khoản nhân viên", url: "/partner/staffs", icon: UserStar },
    ],
  },
  {
    label: "Hàng tồn kho",
    items: [
      {
        title: "Danh sách hàng tồn kho",
        url: "/partner/inventories",
        icon: ClipboardList,
      },
    ],
  },
];

export const PartnerAdminSidebarNested = [
  {
    label: "Quản lý cửa hàng",
    sub: [
      { title: "Cửa hàng", url: "/partner/stores", icon: Store },
      {
        title: "Yêu cầu tạo cửa hàng",
        url: "/partner/store-creation-request",
        icon: FilePlus,
      },
      {
        title: "Lời mời tham gia cửa hàng",
        url: "/partner/store-invitation",
        icon: Ticket,
      },
    ],
  },
  {
    label: "Quản lý yêu cầu",
    sub: [
      {
        title: "Đặt hàng",
        url: "/partner/refill-stock",
        icon: Store,
      },
      {
        title: "Đặt kệ",
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
        title: "Tài khoản nhân viên",
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
        title: "Đặt hàng",
        url: "/warehouse/refill-stock",
        icon: PackagePlus,
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
    label: "Đơn hàng",
    items: [
      { title: "Danh sách đơn hàng", url: "/manager/orders", icon: UserStar },
    ],
  },

  {
    label: "Yêu cầu",
    items: [
      {
        title: "Đặt hàng",
        url: "/manager/refill-stock",
        icon: PackagePlus,
      },

      {
        title: "Đặt kệ",
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

import {
  Bell,
  LayoutDashboard,
  Store,
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
  LayoutGrid,
  RotateCcw,
  MapPin,
  ShieldCheck,
  Ticket,
  Box,
  ShoppingCart,
  History,
  Layers,
} from "lucide-react";

// Admin
export const AdminSidebarGroups = [
  {
    label: "Ứng dụng",
    items: [
      { title: "Tổng quan", url: "/admin/dashboard", icon: LayoutDashboard },
    ],
  },
  {
    label: "Giám sát đơn bán hàng",
    items: [
      { title: "Đơn bán hàng", url: "/admin/orders", icon: ShoppingCart },
    ],
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
    items: [{ title: "Tài khoản", url: "/admin/accounts", icon: UserStar }],
  },

  {
    label: "Quản lý loại kệ",
    items: [
      { title: "Danh sách loại kệ", url: "/admin/shelf-type", icon: Server },
    ],
  },
];

export const AdminSidebarNested = [
  {
    label: "Quản lý sản phẩm",
    sub: [
      { title: "Sản phẩm", url: "/admin/products", icon: Box },
      { title: "Màu sắc sản phẩm", url: "/admin/product-color", icon: Palette },
      {
        title: "Danh mục sản phẩm",
        url: "/admin/product-category",
        icon: Funnel,
      },
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
      {
        title: "Lịch sử hoa hồng",
        url: "/admin/commission-history",
        icon: History,
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
    label: "Giám sát hàng và kệ trong kho",
    sub: [
      {
        title: "Giám sát hàng tồn kho",
        url: "/admin/all-inventory",
        icon: Box,
      },
      {
        title: "Giám sát kệ trưng bày",
        url: "/admin/shelf-inventory",
        icon: Server,
      },
      {
        title: "Danh sách mã kệ trưng bày",
        url: "/admin/shelf",
        icon: Layers,
      },
    ],
  },

  {
    label: "Yêu cầu",
    sub: [
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
    ],
  },
  {
    label: "Đơn bán hàng",
    items: [
      { title: "Đơn bán hàng", url: "/partner/orders", icon: ShoppingCart },
    ],
  },

  {
    label: "Đổi soát hoa hồng",
    items: [
      {
        title: "Danh sách đổi soát",
        url: "/partner/monthly-settlement",
        icon: ClipboardList,
      },
      {
        title: "Lịch sử hoa hồng",
        url: "/partner/commission-history",
        icon: History,
      },
    ],
  },

  {
    label: "Quản lý nhân sự",
    items: [
      { title: "Tài khoản nhân viên", url: "/partner/staffs", icon: UserStar },
    ],
  },
];

export const PartnerAdminSidebarNested = [
  {
    label: "Giám sát tồn kho",
    sub: [
      {
        title: "Giám sát hàng tồn kho",
        url: "/partner/inventories",
        icon: Box,
      },
      {
        title: "Giám sát kệ trưng bày",
        url: "/partner/shelf-inventories",
        icon: Server,
      },
      {
        title: "Danh sách mã kệ trưng bày",
        url: "/partner/shelf",
        icon: Layers,
      },
    ],
  },
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
        icon: PackagePlus,
      },
      {
        title: "Đặt kệ",
        url: "/partner/refill-shelf",
        icon: LayoutGrid,
      },
      {
        title: "Trả hàng",
        url: "/partner/return-request",
        icon: RotateCcw,
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
    label: "Giám sát hàng và kệ",
    items: [
      {
        title: "Giám sát hàng trong kho",
        url: "/warehouse/inventory",
        icon: Box,
      },
      {
        title: "Giám sát loại kệ trong kho",
        url: "/warehouse/shelf-inventory",
        icon: Server,
      },
      {
        title: "Danh sách kệ trưng bày",
        url: "/warehouse/shelf",
        icon: Layers,
      },
    ],
  },

  {
    label: "Yêu cầu",
    items: [
      {
        title: "Giao và trả hàng",
        url: "/warehouse/assigned-shipment",
        icon: PackagePlus,
      },
    ],
  },
];

export const WarehouseManagerSidebarNested = [
  // {
  //   label: "Yêu cầu",
  //   sub: [
  //     {
  //       title: "Trả hàng",
  //       url: "/admin/return-request",
  //       icon: RotateCcw,
  //     },
  //   ],
  // },
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
      // { title: "Thông báo", url: "#", icon: Bell, badge: true },
    ],
  },

  {
    label: "Hàng tồn kho",
    items: [
      {
        title: "Giám sát hàng tại của hàng",
        url: "/manager/inventory",
        icon: Box,
      },
      {
        title: "Giám sát kệ trưng bày",
        url: "/manager/shelf-inventory",
        icon: Server,
      },
      {
        title: "Danh sách mã kệ trưng bày",
        url: "/manager/shelf",
        icon: Layers,
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
    label: "Đơn bán hàng",
    items: [
      {
        title: "Danh sách đơn bán hàng",
        url: "/manager/orders",
        icon: ShoppingCart,
      },
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
    ],
  },
];

export const StoreManagerSidebarNested = [
  // {
  //   label: "Yêu cầu",
  //   sub: [
  //     {
  //       title: "Trả hàng",
  //       url: "/manager/return-request",
  //       icon: RotateCcw,
  //     },
  //   ],
  // },
];

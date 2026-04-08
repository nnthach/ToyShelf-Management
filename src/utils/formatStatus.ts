export const formatBooleanIsActiveStatusText = (isActive: boolean) => {
  switch (isActive) {
    case false:
      return "Chưa kích hoạt";
    case true:
      return "Đã kích hoạt";
    default:
      return "N/A";
  }
};

export const formatBooleanIsActiveStatusColor = (isActive: boolean) => {
  switch (isActive) {
    case false:
      return "bg-yellow-100 text-yellow-800 px-3 py-1 rounded-2xl";
    case true:
      return "bg-green-100 text-green-800 px-3 py-1 rounded-2xl";
  }
};

export const formatPartnerTierTextColor = (text: string) => {
  switch (text) {
    case "Kim Cương":
      return "bg-cyan-100 text-cyan-800 px-3 py-1 rounded-2xl border border-cyan-300 shadow-sm";
    case "Vàng":
      return "bg-yellow-100 text-yellow-800 px-3 py-1 rounded-2xl border border-yellow-300 shadow-sm ";
    case "Đồng":
      return "bg-orange-100 text-orange-800 px-3 py-1 rounded-2xl border border-orange-300 shadow-sm";
    case "Bạc":
      return "bg-slate-100 text-slate-800 px-3 py-1 rounded-2xl border border-slate-300 shadow-sm";
    default:
      return "bg-gray-100 text-gray-800 px-3 py-1 rounded-2xl border border-gray-300 shadow-sm";
  }
};

export const formatUserStatusText = (status: boolean) => {
  switch (status) {
    case false:
      return "Chưa kích hoạt";
    case true:
      return "Đã kích hoạt";
    default:
      return "N/A";
  }
};

export const formatUserStatusColor = (status: boolean) => {
  switch (status) {
    case false:
      return "bg-yellow-100 text-yellow-800 px-3 py-1 rounded-2xl";
    case true:
      return "bg-green-100 text-green-800 px-3 py-1 rounded-2xl";
  }
};

export const formatStoreStatusText = (isActive: boolean) => {
  switch (isActive) {
    case false:
      return "Chưa kích hoạt";
    case true:
      return "Đã kích hoạt";
    default:
      return "N/A";
  }
};

export const formatStoreStatusColor = (isActive: boolean) => {
  switch (isActive) {
    case false:
      return "bg-yellow-100 text-yellow-800 px-3 py-1 rounded-2xl";
    case true:
      return "bg-green-100 text-green-800 px-3 py-1 rounded-2xl";
  }
};

export const formatStoreInviteStatusText = (status: string) => {
  switch (status) {
    case "Pending":
      return "Đang chờ";
    case "Accepted":
      return "Đã chấp nhận";
    case "Rejected":
      return "Đã từ chối";
    default:
      return "N/A";
  }
};

export const formatStoreInviteStatusColor = (status: string) => {
  switch (status) {
    case "Pending":
      return "bg-yellow-100 text-yellow-800 px-3 py-1 rounded-2xl";
    case "Accepted":
      return "bg-green-100 text-green-800 px-3 py-1 rounded-2xl";
    case "Rejected":
      return "bg-red-100 text-red-800 px-3 py-1 rounded-2xl";
  }
};

export const formatStoreCreateRequestStatusText = (status: string) => {
  switch (status) {
    case "Pending":
      return "Đang chờ";
    case "Approved":
      return "Đã chấp nhận";
    case "Rejected":
      return "Đã từ chối";
    default:
      return "N/A";
  }
};

export const formatStoreCreateRequestStatusColor = (status: string) => {
  switch (status) {
    case "Pending":
      return "bg-yellow-100 text-yellow-800 px-3 py-1 rounded-2xl";
    case "Approved":
      return "bg-green-100 text-green-800 px-3 py-1 rounded-2xl";
    case "Rejected":
      return "bg-red-100 text-red-800 px-3 py-1 rounded-2xl";
  }
};

export const formatShipmentAssignStatusText = (status: string) => {
  switch (status) {
    case "Pending":
      return "Đang chờ";
    case "Assigned":
      return "Đã điều phối giao hàng";
    case "Accepted":
      return "Nhân viên giao hàng chấp nhận";
    case "Rejected":
      return "Đã từ chối";
    default:
      return "N/A";
  }
};

export const formatShipmentAssignStatusColor = (status: string) => {
  switch (status) {
    case "Pending":
      return "bg-yellow-100 text-yellow-800 px-3 py-1 rounded-2xl";
    case "Assigned":
      return "bg-orange-100 text-orange-800 px-3 py-1 rounded-2xl";
    case "Accepted":
      return "bg-green-100 text-green-800 px-3 py-1 rounded-2xl";
    case "Rejected":
      return "bg-red-100 text-red-800 px-3 py-1 rounded-2xl";
  }
};

export const formatShipmentStatusText = (status: string) => {
  switch (status) {
    case "Draft":
      return "Chưa giao hàng";
    case "Approved":
      return "Xác nhận từ nhân viên giao hàng";
    case "Rejected":
      return "Nhân viên đã từ chối";
    case "Shipping":
      return "Đang giao hàng";
    case "Received":
      return "Hoàn thành đơn";
    case "Cancelled":
      return "Đã hủy";
    case "Delivered":
      return "Đã giao hàng";
    default:
      return "N/A";
  }
};

export const formatShipmentStatusColor = (status: string) => {
  switch (status) {
    case "Draft":
      return "bg-slate-100 text-slate-600 px-3 py-1 rounded-2xl";
    case "Accepted":
      return "bg-blue-100 text-blue-700 px-3 py-1 rounded-2xl";
    case "Rejected":
      return "bg-orange-100 text-orange-700 px-3 py-1 rounded-2xl";
    case "Shipping":
      return "bg-pink-100 text-pink-700 px-3 py-1 rounded-2xl";
    case "Delivered":
      return "bg-indigo-100 text-indigo-700 px-3 py-1 rounded-2xl";
    case "Received":
      return "bg-emerald-100 text-emerald-700 px-3 py-1 rounded-2xl";
    case "Cancelled":
      return "bg-red-100 text-red-700 px-3 py-1 rounded-2xl";
    default:
      return "bg-gray-100 text-gray-400 px-3 py-1 rounded-2xl";
  }
};

export const formatStoreOrderRefillRequestStatusText = (status: string) => {
  switch (status) {
    case "Pending":
      return "Đang chờ duyệt";
    case "Approved":
      return "Đã chấp nhận";
    case "Rejected":
      return "Đã từ chối";
    case "PartiallyFulfilled":
      return "Đã giao một phần";
    case "Fulfilled":
      return "Đã giao đủ";
    case "Processing":
      return "Đang giao hàng";
    default:
      return "N/A";
  }
};

export const formatStoreOrderRefillRequestStatusColor = (status: string) => {
  switch (status) {
    case "Pending":
      return "bg-yellow-100 text-yellow-800 px-3 py-1 rounded-2xl";
    case "Approved":
      return "bg-blue-100 text-blue-800 px-3 py-1 rounded-2xl";
    case "Rejected":
      return "bg-red-100 text-red-800 px-3 py-1 rounded-2xl";
    case "PartiallyFulfilled":
      return "bg-orange-100 text-orange-800 px-3 py-1 rounded-2xl";
    case "Fulfilled":
      return "bg-green-100 text-green-800 px-3 py-1 rounded-2xl";
    case "Processing":
      return "bg-purple-100 text-purple-800 px-3 py-1 rounded-2xl";
  }
};

export const formatSystemRoleText = (status: string) => {
  switch (status) {
    case "Shipper":
      return "Nhân viên giao hàng";
    case "Warehouse":
      return "Nhân viên kho";
    case "Partner":
      return "Nhân viên đối tác";
    case "PartnerAdmin":
      return "Đối tác";
    case "Admin":
      return "Quản trị viên";
  }
};

export const formatSystemRoleColor = (role: string) => {
  switch (role) {
    case "Shipper":
      return "bg-blue-100 text-blue-800 px-3 py-1 rounded-2xl";
    case "Warehouse":
      return "bg-purple-100 text-purple-800 px-3 py-1 rounded-2xl";
    case "Partner":
      return "bg-teal-100 text-teal-800 px-3 py-1 rounded-2xl";
    case "PartnerAdmin":
      return "bg-indigo-100 text-indigo-800 px-3 py-1 rounded-2xl";
    case "Admin":
      return "bg-red-100 text-red-800 px-3 py-1 rounded-2xl";
    default:
      return "bg-gray-100 text-gray-800 px-3 py-1 rounded-2xl";
  }
};

export const formatOrderStatusText = (status: string) => {
  switch (status) {
    case "PAID":
      return "Đã thanh toán";
    case "CANCELED":
      return "Đã hủy";
    case "Partner":
      return "Nhân viên đối tác";
    case "PartnerAdmin":
      return "Đối tác";
    case "Admin":
      return "Quản trị viên";
  }
};

export const formatOrderStatusColor = (status: string) => {
  switch (status) {
    case "PAID":
      return "bg-green-100 text-green-800 px-3 py-1 rounded-2xl";
    case "Warehouse":
      return "bg-purple-100 text-purple-800 px-3 py-1 rounded-2xl";
    case "Partner":
      return "bg-teal-100 text-teal-800 px-3 py-1 rounded-2xl";
    case "PartnerAdmin":
      return "bg-indigo-100 text-indigo-800 px-3 py-1 rounded-2xl";
    case "CANCELED":
      return "bg-red-100 text-red-800 px-3 py-1 rounded-2xl";
    default:
      return "bg-gray-100 text-gray-800 px-3 py-1 rounded-2xl";
  }
};

export const formatShipmentAssignTypeText = (status: string) => {
  switch (status) {
    case "STORE":
      return "Giao sản phẩm";
    case "SHELF":
      return "Giao kệ";
    default:
      return "N/A";
  }
};

export const formatShipmentAssignTypeColor = (status: string) => {
  switch (status) {
    case "STORE":
      return "bg-indigo-100 text-indigo-700 font-bold border border-indigo-200 px-3 py-1 rounded-2xl shadow-sm";
    case "SHELF":
      return "bg-orange-100 text-orange-700 font-bold border border-orange-200 px-3 py-1 rounded-2xl shadow-sm";
    default:
      return "bg-slate-100 text-slate-600 px-3 py-1 rounded-2xl";
  }
};

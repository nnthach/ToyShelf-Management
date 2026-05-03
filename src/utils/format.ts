export const formatDateTime = (data: string) => {
  if (!data) {
    return {
      date: "",
      time: "",
      full: "",
    };
  }
  const date = new Date(data);

  const formattedDate = date.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  const formattedTime = date.toLocaleTimeString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  return {
    date: formattedDate,
    time: formattedTime,
    full: `${formattedTime}, ${formattedDate}`,
  };
};

export const formatToSlug = (data: string) => {
  const timestamp = Date.now();
  return (
    data
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/Đ/g, "D")
      .trim()
      .replace(/\s+/g, "-")
      .toUpperCase() + `-${timestamp}`
  );
};

export const formatToInitials = (data: string) => {
  const removeWords = ["thanh", "pho", "tinh", "quan", "huyen"];

  return data
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase()
    .trim()
    .split(/\s+/)
    .filter((word) => !removeWords.includes(word))
    .map((word) => word[0])
    .join("")
    .toUpperCase();
};

export const formatColorNameToVN = (data: string) => {
  if (!data) return "N/A";
  const color = data?.toLowerCase();

  switch (color) {
    case "orange":
      return "Cam";
    case "red":
      return "Đỏ";
    case "blue":
      return "Xanh dương";
    case "green":
      return "Xanh lá";
    case "purple":
      return "Tím";
    case "yellow":
      return "Vàng";
    case "black":
      return "Đen";
    case "white":
      return "Trắng";
    case "grey":
      return "Xám";
    case "gray":
      return "Xám";
    case "brown":
      return "Nâu";
    case "pink":
      return "Hồng";
    default:
      return "N/A";
  }
};

export const formatCommissionTableTypeToVN = (text: string) => {
  switch (text) {
    case "TIER":
      return "Thường";
    case "CAMPAIGN":
      return "Chiến Dịch";
    case "SPECIAL":
      return "Đặc Biệt";
    default:
      return "N/A";
  }
};

export const formatStoreRoleToVN = (text: string) => {
  const role = text?.toLowerCase();

  switch (role) {
    case "manager":
      return "Quản lý cửa hàng";
    case "staff":
      return "Nhân viên cửa hàng";
    default:
      return "Đối tác";
  }
};

export const formatWarehouseRoleToVN = (text: string) => {
  const role = text?.toLowerCase();

  switch (role) {
    case "manager":
      return "Quản lý kho";
    case "shipper":
      return "Nhân viên giao hàng";
    default:
      return "N/A";
  }
};

export const formatSourceDamageReport = (text: string): string => {
  switch (text) {
    case "Manufacturer":
      return "Lỗi NSX";
    case "StoreHandling":
      return "Cửa hàng làm hỏng";
    case "CustomerUsage":
      return "Khách hàng làm hỏng";
    case "Transportation":
      return "Lỗi vận chuyển";
    case "IoTSystemError":
      return "Lỗi hệ thống IoT";
    default:
      return text || "Không xác định";
  }
};

export const StoreOrderStatusOptions = [
  {
    value: "Pending",
    label: "Đang chờ duyệt",
  },
  {
    value: "PartnerApproved",
    label: "Đối tác chấp nhận",
  },
  {
    value: "Approved",
    label: "Quản trị viên chấp nhận",
  },
  {
    value: "Processing",
    label: "Đang giao hàng",
  },
  {
    value: "PartiallyFulfilled",
    label: "Đã giao một phần",
  },
  {
    value: "Fulfilled",
    label: "Đã giao đủ",
  },
  {
    value: "Rejected",
    label: "Đã từ chối",
  },
];

export const DamageReportStatusOptions = [
  { value: "Pending", label: "Đang chờ duyệt" },
  { value: "PartnerApproved", label: "Đối tác chấp nhận" },
  { value: "Approved", label: "Quản trị viên chấp nhận" },
  { value: "Rejected", label: "Đã từ chối" },
  { value: "InTransit", label: "Đang vận chuyển" },
  { value: "Returned", label: "Đã trả hàng" },
  { value: "Scheduled", label: "Đã lên lịch" },
];

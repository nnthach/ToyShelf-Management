export const formatDateTime = (data: string) => {
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
  const color = data.toLowerCase();

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
    default:
      return "";
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
      return "N/A";
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

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

export const formatColorName = (data: string) => {
  switch (data) {
    case "Orange":
      return "Cam";
    case "Red":
      return "Đỏ";
    case "Blue":
      return "Xanh dương";
    case "Green":
      return "Xanh lá";
    case "Purple":
      return "Tím";
    case "Yellow":
      return "Vàng";
    case "Black":
      return "Đen";
    case "White":
      return "Trắng";
    case "Grey":
      return "Xám";
    default:
      return "";
  }
};

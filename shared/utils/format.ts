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
  return data
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .trim()
    .replace(/\s+/g, "-")
    .toUpperCase();
};

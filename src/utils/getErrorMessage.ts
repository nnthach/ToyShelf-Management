export function getErrorMessage(error: unknown, fallback = "Đã có lỗi xảy ra") {
  return error instanceof Error ? error.message : fallback;
}
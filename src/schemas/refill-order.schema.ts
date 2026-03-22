import { z } from "zod";

export const refillItemSchema = z.object({
  productColorId: z.string().min(1, "Vui lòng chọn sản phẩm"),
  quantity: z.number().min(1, "Số lượng phải lớn hơn 0"),
  // Thêm các field phụ để hiển thị UI (không gửi lên server)
  name: z.string().optional(),
  colorName: z.string().optional(),
});

export const refillOrderSchema = z.object({
  items: z.array(refillItemSchema).min(1, "Phải có ít nhất 1 sản phẩm"),
});

export type RefillOrderFormValues = z.infer<typeof refillOrderSchema>;

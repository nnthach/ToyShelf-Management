import { z } from "zod";

export const warehouseSchema = z.object({
  name: z.string().min(1, "Tên kho hàng không được để trống"),
  address: z.string().min(1, "Địa chỉ không được để trống"),
  latitude: z.number().min(1, "Vĩ độ không được để trống"),
  longitude: z.number().min(1, "Kinh độ không được để trống"),
  code: z.string().optional(),
  cityId: z.string().min(1, "Thành phố không được để trống"),
});

export type WarehouseFormValues = z.input<typeof warehouseSchema>;

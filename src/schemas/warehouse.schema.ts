import { z } from "zod";

export const warehouseSchema = z.object({
  name: z.string().min(1, "Tên kho hàng không được để trống"),
  address: z.string().min(1, "Địa chỉ không được để trống"),
  code: z.string().optional(),
  cityId: z.string().min(1, "Thành phố không được để trống"),
});

export type WarehouseFormValues = z.input<typeof warehouseSchema>;

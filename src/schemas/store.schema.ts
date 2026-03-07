import { z } from "zod";

export const storeSchema = z.object({
  name: z.string().min(1, "Tên cửa hàng không được để trống"),
  partnerId: z.string().optional(),
  code: z.string().optional(),
  storeAddress: z.string().min(1, "Địa chỉ cửa hàng không được để trống"),
  phoneNumber: z.string().min(10, "Số điện thoại không hợp lệ"),
  latitude: z.number(),
  longitude: z.number(),
});

export type StoreFormValues = z.infer<typeof storeSchema>;

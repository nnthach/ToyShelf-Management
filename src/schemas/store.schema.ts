import { z } from "zod";

export const storeSchema = z.object({
  name: z.string().min(1, "Tên cửa hàng không được để trống"),
  partnerId: z.string().optional(),
  code: z.string().optional(),
  // code: z.string().min(1),
  storeAddress: z.string().min(1, "Địa chỉ cửa hàng không được để trống"),
  phoneNumber: z.string().min(10, "Số điện thoại không hợp lệ"),
  // openDay: z.string().min(1),
  // openTime: z.string().min(1),
  // closeTime: z.string().min(1),
  // latitude: z.number(),
  // longitude: z.number(),
});

export type StoreFormValues = z.infer<typeof storeSchema>;

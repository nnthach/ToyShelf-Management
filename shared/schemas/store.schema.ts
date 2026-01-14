import { z } from "zod";

export const storeSchema = z.object({
  name: z.string().min(1),
  partnerID: z.string().min(1),
  code: z.string().min(1),
  storeAddress: z.string().min(10),
  phoneNumber: z.string().min(10),
  openDay: z.string().min(1),
  openTime: z.string().min(1),
  closeTime: z.string().min(1),
  latitude: z.number(),
  longitude: z.number(),
});

export type StoreFormValues = z.infer<typeof storeSchema>;

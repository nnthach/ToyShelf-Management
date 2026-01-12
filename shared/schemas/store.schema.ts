import { z } from "zod";

export const storeSchema = z.object({
  name: z.string().min(1),
  owner: z.string().min(1),
  address: z.string().min(1),
  openDay: z.string().min(1),
  openTime: z.string().min(1),
  closeTime: z.string().min(1),
  latitude: z.number(),
  longitude: z.number(),
});

export type StoreFormValues = z.infer<typeof storeSchema>;

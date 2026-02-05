import { z } from "zod";

export const warehouseSchema = z.object({
  name: z.string().min(1, "admin.warehouses.fields.name.required"),
  address: z.string().min(1, "admin.warehouses.fields.address.required"),
  code: z.string(),
});

export type WarehouseFormValues = z.input<typeof warehouseSchema>;

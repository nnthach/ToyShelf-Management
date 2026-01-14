import { z } from "zod";

export const productSchema = z.object({
  name: z.string("").min(1),
  description: z.string("").min(1),
  productCategoryId: z.string("").min(1),
  weight: z.number().optional(),
  unit: z.string().optional(),
  color: z.array(z.string()).min(1),
});

export type ProductFormValues = z.infer<typeof productSchema>;

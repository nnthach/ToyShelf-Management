import { z } from "zod";

export const productSchema = z.object({
  name: z.string("").min(1),
  description: z.string("").min(1),
  productCategoryId: z.string("").min(1),
  size: z.string("").min(1),
  price: z.string("").min(4),
  length: z.number().min(1),
  width: z.number().min(1),
  height: z.number().min(1),
  weight: z.coerce.number().optional(),
  unit: z.string().optional(),
  color: z.array(z.string()).optional(),
});

export type ProductFormValues = z.input<typeof productSchema>;

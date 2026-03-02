import { z } from "zod";

export const productSchema = z.object({
  name: z.string("").min(1),
  description: z.string("").min(1),
  productCategoryId: z.string("").min(1),
  price: z.coerce.number().min(4),
  brand: z.string().min(1),
  material: z.string().min(1),
  originCountry: z.string().min(1),
  ageRange: z.string().min(1),
  size: z.string("").optional(),
  length: z.number().min(1).optional(),
  width: z.number().min(1).optional(),
  height: z.number().min(1).optional(),
  weight: z.coerce.number().optional(),
  unit: z.string().optional(),
  colors: z.array(
    z.object({
      name: z.string(),
      colorId: z.string().min(1),
      priceSegmentId: z.string().min(1),
      price: z.coerce.number().min(1),
      model3DUrl: z.string(),
      imageUrl: z.string(),
    }),
  ),
});

export type ProductFormValues = z.input<typeof productSchema>;

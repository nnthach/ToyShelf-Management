import { z } from "zod";

export const productPriceSegmentSchema = z.object({
  name: z.string("").min(1),
  minPrice: z.coerce.number().min(1),
  maxPrice: z.coerce.number().min(1),
  code: z.string().optional(),
});

export type ProductPriceSegmentFormValues = z.input<
  typeof productPriceSegmentSchema
>;

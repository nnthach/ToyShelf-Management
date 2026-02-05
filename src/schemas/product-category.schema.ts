import { z } from "zod";

export const productCateSchema = z.object({
  name: z.string().min(1, "admin.productCategory.fields.name.required"),
  description: z
    .string()
    .min(1, "admin.productCategory.fields.description.required"),
  code: z.string(),
});

export type ProductCategoryFormValues = z.input<typeof productCateSchema>;

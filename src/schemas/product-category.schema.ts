import { z } from "zod";

export const productCateSchema = z.object({
  name: z.string().min(1, "Tên danh mục là bắt buộc"),
  description: z.string().min(1, "Mô tả danh mục là bắt buộc"),
});

export type ProductCategoryFormValues = z.input<typeof productCateSchema>;

import { z } from "zod";

export const shelfSchema = z.object({
  imageFile: z
    .instanceof(File, { message: "Vui lòng chọn hình ảnh" })
    .refine((file) => file.type.startsWith("image/"), "File phải là hình ảnh")
    .refine((file) => file.size <= 5 * 1024 * 1024, "Ảnh tối đa 5MB")
    .optional(),
  imageUrl: z.string(),
  name: z.string().min(1, "Tên loại kệ là bắt buộc"),
  width: z.coerce.number().min(1, "Chiều rộng > 0"),
  height: z.coerce.number().min(1, "Chiều cao > 0"),
  depth: z.coerce.number().min(1, "Chiều sâu > 0"),
  totalLevels: z.coerce
    .number()
    .min(1, "Tối thiểu 1 tầng")
    .max(20, "Tối đa 20 tầng"),
  suitableProductCategoryTypes: z
    .array(z.string())
    .min(1, "Chọn ít nhất 1 loại danh mục chung"),
  displayGuideline: z.string().optional(),
  levels: z.array(
    z.object({
      level: z.number(),
      name: z.string().min(1, "Tên tầng là bắt buộc"),
      clearanceHeight: z.coerce.number().min(1, "Chiều cao tầng > 0"),
      recommendedCapacity: z.coerce.number().min(1, "Sức chứa là bắt buộc"),
      suitableProductCategoryTypes: z
        .array(z.string())
        .min(1, "Chọn ít nhất 1 loại danh mục"),
      displayGuideline: z.string().optional(),
    }),
  ),
});

export type ShelfFormValues = z.input<typeof shelfSchema>;

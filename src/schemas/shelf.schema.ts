import z from "zod";

export const createShelfSchema = z.object({
  imageFile: z
    .instanceof(File, { message: "Vui lòng chọn hình ảnh" })
    .refine((file) => file.type.startsWith("image/"), "File phải là hình ảnh")
    .refine((file) => file.size <= 5 * 1024 * 1024, "Ảnh tối đa 5MB"),

  imageUrl: z.string().optional(),
  name: z.string().min(1, "Tên loại kệ là bắt buộc"),
  width: z.coerce.number().min(1, "Chiều rộng > 0"),
  height: z.coerce.number().min(1, "Chiều cao > 0"),
  depth: z.coerce.number().min(1, "Chiều sâu > 0"),
  totalLevels: z.coerce.number().min(1).max(20),
  suitableProductCategoryTypes: z
    .array(z.string())
    .min(1, "Chọn ít nhất 1 loại danh mục chung"),
  displayGuideline: z.string().optional(),
  levels: z.array(
    z.object({
      level: z.number(),
      name: z.string().min(1, "Tên tầng là bắt buộc"),
      clearanceHeight: z.coerce.number().min(1),
      recommendedCapacity: z.coerce.number().min(1),
      suitableProductCategoryTypes: z.array(z.string()).min(1),
      displayGuideline: z.string().optional(),
    }),
  ),
});

export const updateShelfSchema = z
  .object({
    imageFile: z
      .instanceof(File)
      .refine((file) => file.type.startsWith("image/"), "File phải là hình ảnh")
      .refine((file) => file.size <= 5 * 1024 * 1024, "Ảnh tối đa 5MB")
      .optional(),
    imageUrl: z.string().optional(),
    name: z.string().min(1, "Tên loại kệ là bắt buộc"),
    width: z.coerce.number().min(1),
    height: z.coerce.number().min(1),
    depth: z.coerce.number().min(1),
    totalLevels: z.coerce.number().min(1).max(20),
    suitableProductCategoryTypes: z.array(z.string()).min(1),
    displayGuideline: z.string().optional(),
    levels: z.array(
      z.object({
        level: z.number(),
        name: z.string().min(1),
        clearanceHeight: z.coerce.number().min(1),
        recommendedCapacity: z.coerce.number().min(1),
        suitableProductCategoryTypes: z.array(z.string()).min(1),
        displayGuideline: z.string().optional(),
      }),
    ),
  })
  .refine(
    (data) => {
      return !!data.imageFile || !!data.imageUrl;
    },
    {
      message: "Vui lòng chọn hình ảnh",
      path: ["imageFile"],
    },
  );

export type CreateShelfFormValues = z.input<typeof createShelfSchema>;
export type UpdateShelfFormValues = z.input<typeof updateShelfSchema>;

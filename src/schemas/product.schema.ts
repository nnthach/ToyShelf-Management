import { z } from "zod";

export const productSchema = z.object({
  productCategoryId: z.string().min(1, "Danh mục sản phẩm là bắt buộc"),
  name: z.string().min(1, "Tên sản phẩm là bắt buộc"),
  basePrice: z.coerce.number().min(1, "Giá là bắt buộc"),
  description: z.string().min(1, "Mô tả là bắt buộc"),
  brand: z.string().min(1, "Thương hiệu là bắt buộc"),
  material: z.string().min(1, "Chất liệu là bắt buộc"),
  originCountry: z.string().min(1, "Quốc gia sản xuất là bắt buộc"),
  ageRange: z.string().min(1, "Độ tuổi là bắt buộc"),
  width: z.coerce.number(),
  length: z.coerce.number(),
  height: z.coerce.number(),
  weight: z.coerce.number(),
  colors: z.array(
    z.object({
      name: z.string().optional(),
      colorId: z.string().min(1, "Chọn màu sắc là bắt buộc"),
      priceSegmentId: z.string().min(1, "Chọn phân khúc giá là bắt buộc"),
      price: z.coerce.number().min(1, "Giá sản phẩm là bắt buộc"),
      model3DUrl: z.string(),
      model3DFile: z
        .instanceof(File)
        .optional()
        .or(z.undefined())
        .refine((file) => !file || file.size <= 10 * 1024 * 1024, {
          message: "File 3D phải nhỏ hơn 10MB",
        }),
      imageUrl: z.string(),
      imageFile: z.instanceof(File).optional().or(z.undefined()),
      priceSegmentName: z.string().optional(),
      colorName: z.string().optional(),
      colorHex: z.string().optional(),
    }),
  ),
});

export type ProductFormValues = z.input<typeof productSchema>;

export const productUpdateSchema = z.object({
  name: z.string().min(1, "Tên sản phẩm là bắt buộc"),
  description: z.string().min(1, "Mô tả là bắt buộc"),
  productCategoryId: z.string().min(1, "Danh mục sản phẩm là bắt buộc"),
  basePrice: z.coerce.number().min(1, "Giá là bắt buộc"),
  brand: z.string().min(1, "Thương hiệu là bắt buộc"),
  material: z.string().min(1, "Chất liệu là bắt buộc"),
  originCountry: z.string().min(1, "Quốc gia sản xuất là bắt buộc"),
  ageRange: z.string().min(1, "Độ tuổi là bắt buộc"),
  length: z.coerce.number().min(1, "Chiều dài là bắt buộc"),
  width: z.coerce.number().min(1, "Chiều rộng là bắt buộc"),
  height: z.coerce.number().min(1, "Chiều cao là bắt buộc"),
  weight: z.coerce.number().min(1, "Cân nặng là bắt buộc"),
  isConsignment: z.boolean().optional(),
  colors: z.array(
    z.object({
      name: z.string().optional(),
      colorId: z.string().min(1, "Chọn màu sắc là bắt buộc"),
      priceSegmentId: z.string().min(1, "Chọn phân khúc giá là bắt buộc"),
      price: z.coerce.number().min(1, "Giá sản phẩm là bắt buộc"),
      model3DUrl: z.string(),
      model3DFile: z
        .instanceof(File)
        .optional()
        .or(z.undefined())
        .refine((file) => !file || file.size <= 10 * 1024 * 1024, {
          message: "File 3D phải nhỏ hơn 10MB",
        }),
      imageUrl: z.string(),
      imageFile: z.instanceof(File).optional().or(z.undefined()),
      priceSegmentName: z.string().optional(),
      colorName: z.string().optional(),
      colorHex: z.string().optional(),
    }),
  ),
});

export type ProductUpdateFormValues = z.input<typeof productUpdateSchema>;

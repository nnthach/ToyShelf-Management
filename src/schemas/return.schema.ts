import { z } from "zod";

export const returnSchema = z.object({
  source: z.string().min(1, "Nguồn là bắt buộc"),
  description: z.string().optional(),
  isWarrantyClaim: z.boolean().optional(),
  items: z
    .array(
      z
        .object({
          type: z.enum(["Product", "Shelf", ""]),
          shelfId: z
            .string()
            .uuid("shelfId không hợp lệ")
            .optional()
            .or(z.literal(""))
            .transform((val) => (val === "" ? undefined : val)),

          productColorId: z
            .string()
            .uuid("productColorId không hợp lệ")
            .optional()
            .or(z.literal(""))
            .transform((val) => (val === "" ? undefined : val)),
          quantity: z.number().min(1, "Số lượng phải > 0"),
          mediaUrls: z.array(z.string()).optional(),
          imageFile: z
            .array(z.instanceof(File))
            .optional()
            .refine(
              (files) =>
                !files || files.every((file) => file.size <= 5 * 1024 * 1024),
              {
                message: "Mỗi ảnh phải nhỏ hơn 5MB",
              },
            ),
        })
        .superRefine((data, ctx) => {
          if (data.type === "Product" && !data.productColorId) {
            ctx.addIssue({
              path: ["productColorId"],
              code: z.ZodIssueCode.custom,
              message: "Phải chọn sản phẩm",
            });
          }

          if (data.type === "Shelf" && !data.shelfId) {
            ctx.addIssue({
              path: ["shelfId"],
              code: z.ZodIssueCode.custom,
              message: "Phải chọn kệ",
            });
          }
        }),
    )
    .min(1, "Phải có ít nhất 1 item"),
});

export type ReturnFormValues = z.input<typeof returnSchema>;

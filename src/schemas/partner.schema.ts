import { z } from "zod";

export const partnerSchema = z.object({
  companyName: z.string().min(1, "Tên công ty là bắt buộc"),
  partnerTierId: z.string().min(1, "Cấp độ đối tác là bắt buộc"),
});

export type PartnerFormValues = z.input<typeof partnerSchema>;

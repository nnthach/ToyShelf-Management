import { z } from "zod";

export const partnerSchema = z.object({
  companyName: z.string().min(1, "Tên công ty là bắt buộc"),
  partnerTierId: z.string().min(1, "Cấp độ đối tác là bắt buộc"),
  commissionTableId: z.string().min(1, "Bảng hoa hồng là bắt buộc"),
  tableStartDate: z.string().min(1, "Ngày bắt đầu là bắt buộc"),
  tableEndDate: z.string().min(1, "Ngày kết thúc là bắt buộc"),
});

export type PartnerFormValues = z.input<typeof partnerSchema>;

import { z } from "zod";

export const partnerSchema = z.object({
  companyName: z.string().min(1, "Tên công ty là bắt buộc"),
  partnerTierId: z.string().min(1, "Cấp độ đối tác là bắt buộc"),
  commissionTableId: z.string().min(1, "Bảng hoa hồng là bắt buộc"),
  tableStartDate: z.string().min(1, "Ngày bắt đầu là bắt buộc"),
  tableEndDate: z.string().min(1, "Ngày kết thúc là bắt buộc"),
  address: z.string().min(1, "Địa chỉ không được để trống"),
  latitude: z.number().min(1, "Vĩ độ không được để trống"),
  longitude: z.number().min(1, "Kinh độ không được để trống"),
});

export type PartnerFormValues = z.input<typeof partnerSchema>;

export const updatePartnerSchema = z.object({
  companyName: z.string().min(1, "Tên công ty là bắt buộc"),
  partnerTierId: z.string().min(1, "Cấp độ đối tác là bắt buộc"),
  address: z.string().min(1, "Địa chỉ không được để trống"),
  latitude: z.number().min(1, "Vĩ độ không được để trống"),
  longitude: z.number().min(1, "Kinh độ không được để trống"),
});

export type UpdatePartnerFormValues = z.input<typeof updatePartnerSchema>;

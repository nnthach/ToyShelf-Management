import { z } from "zod";

export const partnerSchema = z.object({
  companyName: z.string().min(1, "Tên công ty là bắt buộc"),
  bankName: z.string().min(1, "Tên ngân hàng là bắt buộc"),
  bankAccountNumber: z.string().min(1, "Số tài khoản ngân hàng là bắt buộc"),
  bankAccountName: z.string().min(1, "Tên chủ tài khoản là bắt buộc"),
  partnerTierId: z.string().min(1, "Cấp bậc đối tác là bắt buộc"),
  commissionTableId: z.string().min(1, "Bảng hoa hồng là bắt buộc"),
  tableStartDate: z.string().min(1, "Ngày bắt đầu là bắt buộc"),
  tableEndDate: z.string().min(1, "Ngày kết thúc là bắt buộc"),
  address: z.string().min(1, "Địa chỉ không được để trống"),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
});

export type PartnerFormValues = z.input<typeof partnerSchema>;

export const updatePartnerSchema = z.object({
  bankName: z.string().min(1, "Tên ngân hàng là bắt buộc"),
  bankAccountNumber: z.string().min(1, "Số tài khoản ngân hàng là bắt buộc"),
  bankAccountName: z.string().min(1, "Tên chủ tài khoản là bắt buộc"),
  companyName: z.string().min(1, "Tên công ty là bắt buộc"),
  partnerTierId: z.string().min(1, "Cấp bậc đối tác là bắt buộc"),
  address: z.string().min(1, "Địa chỉ không được để trống"),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
});

export type UpdatePartnerFormValues = z.input<typeof updatePartnerSchema>;

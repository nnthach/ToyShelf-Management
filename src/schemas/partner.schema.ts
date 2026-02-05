import { z } from "zod";

export const partnerSchema = z.object({
  companyName: z.string().min(1, "admin.partners.fields.companyName.required"),
  tier: z.string().min(1, "admin.partners.fields.tier.required"),
  revenueSharePercent: z.preprocess(
    (val) => Number(val),
    z.number().min(1, "admin.partners.fields.revenueSharePercent.required"),
  ),
});

export type PartnerFormValues = z.input<typeof partnerSchema>;

"use client";
import { Button } from "@/src/styles/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/src/styles/components/ui/dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { FormProvider, useFieldArray, useForm } from "react-hook-form";
import z from "zod";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "react-toastify";
import { FormFieldCustom } from "@/src/styles/components/custom/FormFieldCustom";
import {
  createPartnerTierAPI,
  getAllPartnerTierAPI,
} from "@/src/services/partner-tier.service";
import { createPriceTableAPI } from "@/src/services/price-table.service";
import { PriceTableType } from "@/src/enums/price-table-type.enum";
import { PartnerTier, ProductPriceSegment } from "@/src/types";
import { getAllProducePriceSegmentAPI } from "@/src/services/product-segment.service";
import { formatToInitials } from "@/src/utils/format";
import { createCityAPI } from "@/src/services/city.service";

function CreateCityModal() {
  const queryClient = useQueryClient();

  const [open, setOpen] = useState(false);

  const formSchema = z.object({
    name: z.string().min(1, "Tên thành phố là bắt buộc"),
  });

  const form = useForm<z.input<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  async function onSubmit(data: z.output<typeof formSchema>) {
    const payload = {
      ...data,
      code: formatToInitials(data.name),
    };
    try {
      await createCityAPI(payload);

      queryClient.invalidateQueries({
        queryKey: ["cities"],
      });

      form.reset();
      toast.success("Thêm thành phố mới thành công");

      setOpen(false);
    } catch (error) {
      console.log("create city err", error);
      toast.error("Thêm thành phố mới thất bại");
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        setOpen(value);
        if (!value) {
          form.reset();
        }
      }}
    >
      <DialogTrigger asChild>
        <Button className="btn-primary-gradient">
          <Plus /> Thêm thành phố
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[300px]">
        <DialogHeader>
          <DialogTitle>Thêm thành phố</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>

        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} id="form-create-city">
            <FormFieldCustom
              name="name"
              label="Tên thành phố"
              placeholder="Ví dụ: TP.HCM"
            />
          </form>
        </FormProvider>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Hủy</Button>
          </DialogClose>
          <Button type="submit" form="form-create-city">
            Tạo mới
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default CreateCityModal;

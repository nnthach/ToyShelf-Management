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
} from "@/src/styles/components/ui/dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import z from "zod";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { FormFieldCustom } from "@/src/styles/components/custom/FormFieldCustom";
import { getCityDetailAPI, updateCityAPI } from "@/src/services/city.service";
import { formatToInitials } from "@/src/utils/format";

type EditCityModalProps = {
  cityId: string;
  isOpen: boolean;
  onClose: () => void;
};

function EditCityModal({ cityId, isOpen, onClose }: EditCityModalProps) {
  const queryClient = useQueryClient();

  const { data: cityDetail, isLoading } = useQuery({
    queryKey: ["city", cityId],
    queryFn: () => getCityDetailAPI(cityId!),
    select: (res) => res.data,
    enabled: !!cityId,
  });

  const formSchema = z.object({
    name: z.string().min(1, "Tên thành phố là bắt buộc"),
  });

  const form = useForm<z.input<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  useEffect(() => {
    if (cityDetail) {
      form.reset({
        name: cityDetail.name,
      });
    }
  }, [cityDetail, form]);

  async function onSubmit(data: z.infer<typeof formSchema>) {
    try {
      const payload = {
        ...data,
        code: formatToInitials(data.name),
      };
      await updateCityAPI(payload, cityId);

      queryClient.invalidateQueries({
        queryKey: ["cities"],
      });

      await queryClient.invalidateQueries({
        queryKey: ["city", cityId],
      });

      form.reset();
      toast.success("Chỉnh sửa thành phố thành công");
      onClose();
    } catch (error) {
      console.log("update city err", error);
      toast.error("Chỉnh sửa thành phố thất bại");
    }
  }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(value) => {
        if (!value) onClose();
      }}
    >
      <form>
        <DialogContent className="sm:max-w-[300px]">
          <DialogHeader>
            <DialogTitle>Chỉnh sửa thành phố</DialogTitle>
            <DialogDescription>
              Make changes to your profile here. Click save when you&apos;re
              done.
            </DialogDescription>
          </DialogHeader>

          <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} id="form-edit-city">
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
            <Button type="submit" form="form-edit-city">
              Chỉnh sửa
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}

export default EditCityModal;

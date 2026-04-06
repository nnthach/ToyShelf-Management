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
import { Building2, Edit, Sparkles } from "lucide-react";
import { getErrorMessage } from "@/src/utils/getErrorMessage";

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
      toast.error(getErrorMessage(error, "Chỉnh sửa thành phố thất bại"));
    }
  }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(value) => {
        if (!value) onClose();
      }}
    >
      <DialogContent className="sm:max-w-[380px] p-0 overflow-hidden border-none shadow-2xl">
        {/* Header: Sạch sẽ, icon Building đại diện cho đô thị */}
        <DialogHeader className="p-6 bg-slate-50/50 border-b">
          <DialogTitle className="text-xl font-bold text-slate-800 flex items-center gap-2">
            Chỉnh sửa thành phố
          </DialogTitle>
          <DialogDescription className="text-slate-500 flex items-center gap-1.5 mt-1">
            <Sparkles size={14} className="text-sky-500" />
            Bổ sung địa danh mới vào hệ thống quản lý khu vực.
          </DialogDescription>
        </DialogHeader>

        {/* Form Body: Padding rộng để trường nhập liệu nổi bật */}
        <div className="p-6">
          <FormProvider {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              id="form-create-city"
              className="space-y-4"
            >
              <FormFieldCustom
                name="name"
                label="Tên thành phố / Tỉnh"
                placeholder="Ví dụ: TP. Hồ Chí Minh, Hà Nội..."
                icon={<Building2 size={18} />}
                required
              />
            </form>
          </FormProvider>
        </div>

        {/* Footer: Nút bấm lớn, dễ thao tác */}
        <DialogFooter className="p-4 bg-slate-50/50 border-t flex gap-3">
          <DialogClose asChild>
            <Button
              variant="ghost"
              className="flex-1 font-medium text-slate-600 hover:bg-slate-200"
            >
              Hủy
            </Button>
          </DialogClose>
          <Button
            type="submit"
            form="form-create-city"
            className="flex-1 min-w-[120px] gap-2 font-bold shadow-md active:scale-95 transition-all"
            variant="success"
          >
            <Edit className="h-4 w-4" />
            Lưu
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default EditCityModal;

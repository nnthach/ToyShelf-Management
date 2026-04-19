import { useAuth } from "@/src/hooks/useAuth";
import { ReturnFormValues, returnSchema } from "@/src/schemas/return.schema";
import { getAllShelfAPI } from "@/src/services/shelf.service";
import { Button } from "@/src/styles/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/src/styles/components/ui/dialog";
import { ShelfShelf } from "@/src/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Box, Plus, Sparkles } from "lucide-react";
import { memo, useState } from "react";
import { FormProvider, useFieldArray, useForm } from "react-hook-form";
import ReturnItem from "./ReturnItem";
import { FormFieldCustom } from "@/src/styles/components/custom/FormFieldCustom";
import { ScrollArea } from "@/src/styles/components/ui/scroll-area";
import { Separator } from "@/src/styles/components/ui/separator";
import { uploadFileToCloudinary } from "@/src/config/cloundinary";
import { createDamageReportAPI } from "@/src/services/damage-report.service";
import { toast } from "react-toastify";

function CreateReturnModal() {
  const { myStore } = useAuth();
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const storeLocationId = myStore?.storeLocationId;

  const form = useForm<ReturnFormValues>({
    resolver: zodResolver(returnSchema),
    defaultValues: {
      source: "",
      description: "",
      isWarrantyClaim: false,
      items: [
        {
          type: "",
          productColorId: "",
          shelfId: "",
          quantity: 0,
          mediaUrls: [],
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });

  // shelf list
  const {
    data: shelfList = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["shelfs", storeLocationId],
    queryFn: () => getAllShelfAPI({ inventoryLocationId: storeLocationId }),
    select: (res) => res.data.items as ShelfShelf[],
    enabled: !!storeLocationId,
  });

  const shelfOptions = shelfList?.map((s) => {
    return {
      value: s.id,
      label: s.code,
    };
  });

  async function onSubmit(data: ReturnFormValues) {
    console.log("data", data);

    try {
      const itemsWithUrls = await Promise.all(
        data.items.map(async (item) => {
          let uploadedUrls: string[] = [];

          if (item.imageFile && item.imageFile.length > 0) {
            uploadedUrls = await Promise.all(
              item.imageFile.map((file) =>
                uploadFileToCloudinary(file, "return"),
              ),
            );
          }
          return {
            type: item.type,
            ...(item.type === "Product"
              ? {
                  productColorId: item.productColorId,
                }
              : {}),

            ...(item.type === "Shelf"
              ? {
                  shelfId: item.shelfId,
                }
              : {}),
            quantity: item.quantity,
            mediaUrls: [...(item.mediaUrls || []), ...uploadedUrls],
          };
        }),
      );

      const finalPayload = {
        ...data,
        items: itemsWithUrls,
      };

      await createDamageReportAPI(finalPayload);

      queryClient.invalidateQueries({
        queryKey: ["returnRequests"],
      });

      toast.success("Tạo đơn trả thành công");
      form.reset();
      setOpen(false);
    } catch (error) {
      console.log("error", error);
    }
  }

  const sourceOption = [
    {
      value: "Manufacturer",
      label: "Lỗi NSX",
    },
    {
      value: "StoreHandling",
      label: "Cửa hàng làm hỏng",
    },
    {
      value: "CustomerUsage",
      label: "Khách hàng làm hỏng",
    },
    {
      value: "Transportation",
      label: "Lỗi vận chuyển",
    },
    {
      value: "IoTSystemError",
      label: "Lỗi hệ thống IoT",
    },
  ];

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        setOpen(v);
        if (!v) form.reset();
      }}
    >
      <DialogTrigger asChild>
        <Button className="btn-primary-gradient shadow-md">
          <Plus className="mr-2 h-4 w-4" /> Tạo đơn trả hàng
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[750px] p-0 overflow-hidden border-none shadow-2xl bg-slate-50">
        <DialogHeader className="p-6 bg-white border-b">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-100 rounded-lg text-amber-600">
              <Sparkles size={24} />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold text-slate-800">
                Tạo đơn trả hàng
              </DialogTitle>
              <DialogDescription className="text-slate-500">
                Nhập thông tin chi tiết các sản phẩm cần hoàn kho
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <FormProvider {...form}>
          <form
            id="form-create-return"
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col"
          >
            <ScrollArea className="max-h-[70vh]">
              <div className="p-6 space-y-6">
                {/* PHẦN 1: THÔNG TIN CHUNG */}
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-4">
                  <h3 className="font-semibold text-slate-700 flex items-center gap-2 text-sm uppercase tracking-wider">
                    <Box size={16} /> Thông tin đơn hàng
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2 sm:col-span-1">
                      <FormFieldCustom
                        name="source"
                        label="Nguyên nhân"
                        placeholder="Chọn nguyên nhân"
                        icon={<Box size={16} />}
                        required
                        type="select"
                        selectData={sourceOption}
                      />
                    </div>
                    <div className="col-span-2 sm:col-span-1 flex items-end pb-2">
                      <FormFieldCustom
                        name="isWarrantyClaim"
                        label="Yêu cầu bảo hành"
                        type="switch"
                      />
                    </div>
                    <div className="col-span-2">
                      <FormFieldCustom
                        name="description"
                        label="Ghi chú"
                        placeholder="Lý do trả hàng, tình trạng đơn..."
                        icon={<Box size={16} />}
                      />
                    </div>
                  </div>
                </div>

                <Separator className="bg-slate-200" />

                {/* PHẦN 2: DANH SÁCH SẢN PHẨM */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center px-1">
                    <h3 className="font-semibold text-slate-700 text-sm uppercase tracking-wider">
                      Danh sách sản phẩm ({fields.length})
                    </h3>
                  </div>

                  <div className="flex flex-col gap-4">
                    {fields.map((field, index) => (
                      <ReturnItem
                        key={field.id}
                        index={index}
                        form={form}
                        remove={remove}
                        fieldsLength={fields.length}
                        shelfOptions={shelfOptions}
                      />
                    ))}

                    <Button
                      type="button"
                      variant="outline"
                      className="w-full border-dashed border-2 py-8 bg-slate-50 hover:bg-slate-100 transition-all text-slate-600"
                      onClick={() =>
                        append({
                          type: "",
                          productColorId: "",
                          shelfId: "",
                          quantity: 1,
                          mediaUrls: [],
                        })
                      }
                    >
                      <Plus className="mr-2 h-4 w-4" /> Thêm sản phẩm trả hàng
                    </Button>
                  </div>
                </div>
              </div>
            </ScrollArea>
          </form>
        </FormProvider>

        <DialogFooter className="p-4 border-t bg-white gap-2">
          <Button variant="ghost" onClick={() => setOpen(false)}>
            Hủy bỏ
          </Button>
          <Button
            variant="success"
            type="submit"
            form="form-create-return"
            className="px-8 font-bold"
          >
            Xác nhận trả hàng
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default memo(CreateReturnModal);

"use client";
import { Button } from "@/src/styles/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/src/styles/components/ui/dialog";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { Send, Warehouse as WarehouseIcon, Pen } from "lucide-react";
import { memo, useState } from "react";
import { getErrorMessage } from "@/src/utils/getErrorMessage";
import { getAllWarehouseAPI } from "@/src/services/warehouse.service";
import { FormProvider, useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormFieldCustom } from "@/src/styles/components/custom/FormFieldCustom";
import { Warehouse } from "@/src/types";
import { createDamageAssignWarehouseAPI } from "@/src/services/damage-report.service";

type AssignWarehouseModalProps = {
  requestId: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
};

function AssignWarehouseModal({
  requestId,
  isOpen,
  onClose,
}: AssignWarehouseModalProps) {
  const queryClient = useQueryClient();

  const [isLoading, setIsLoading] = useState(false);

  const formSchema = z.object({
    warehouseLocationId: z.string().min(1, "Kho là bắt buộc"),
  });

  const form = useForm<z.input<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      warehouseLocationId: "",
    },
  });

  const { data: availableWarehouseList } = useQuery({
    queryKey: ["warehouses"],
    queryFn: () => getAllWarehouseAPI({}),
    select: (res) => res.data as Warehouse[],
    enabled: isOpen,
  });

  const warehouseOptions = availableWarehouseList?.map((s) => ({
    value: s.warehouseLocationId,
    label: s.name,
  }));

  async function onSubmit(data: z.infer<typeof formSchema>) {
    setIsLoading(true);
    const params = {
      warehouseLocationId: data.warehouseLocationId,
    };
    try {
      await createDamageAssignWarehouseAPI(requestId, params);

      queryClient.invalidateQueries({ queryKey: ["returnRequest", requestId] });
      queryClient.invalidateQueries({ queryKey: ["returnRequests"] });
      queryClient.invalidateQueries({
        queryKey: ["shipmentAssigns", requestId],
      });

      toast.success("Điều phối kho thành công");
      form.reset();
      onClose();
    } catch (error) {
      toast.error(getErrorMessage(error, "Điều phối kho thất bại"));
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(v) => {
        if (!v) {
          form.reset();
          onClose();
        }
      }}
    >
      {" "}
      <DialogContent className="sm:max-w-[400px] max-h-[90vh] flex flex-col p-0 overflow-hidden">
        <DialogHeader className="p-6 pb-2">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600">
              <WarehouseIcon className="h-5 w-5" />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold">
                Chọn kho thực hiện
              </DialogTitle>
              <DialogDescription>
                Chọn kho phù hợp để thực hiện đơn
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="p-6">
          <FormProvider {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-5"
              id="form-create-staff-account"
            >
              <div className="grid gap-4">
                <FormFieldCustom
                  name="warehouseLocationId"
                  label="Kho thực hiện"
                  icon={<WarehouseIcon size={18} />}
                  placeholder="Chọn kho thực hiện"
                  type="select"
                  selectData={warehouseOptions}
                  required
                />
              </div>
            </form>
          </FormProvider>
        </div>

        <DialogFooter className="p-6 pt-2 gap-3 bg-gray-50 border-t">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1 rounded-lg border-gray-300"
          >
            Huỷ bỏ
          </Button>
          <Button
            disabled={isLoading}
            type="submit"
            form="form-create-staff-account"
            className="flex-1 rounded-lg bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-100"
          >
            {isLoading ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" /> Xác nhận
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default memo(AssignWarehouseModal);

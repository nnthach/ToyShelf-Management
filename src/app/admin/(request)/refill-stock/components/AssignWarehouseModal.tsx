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
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import z from "zod";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { FormFieldCustom } from "@/src/styles/components/custom/FormFieldCustom";
import { AlertCircle, Send, Warehouse, XCircle } from "lucide-react";
import { memo } from "react";
import { getAllInventoryLocationAPI } from "@/src/services/inventory-location.service";
import { InventoryLocation } from "@/src/types";
import { createShipmentAssignWarehouseAPI } from "@/src/services/shipment-assignment.service";

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
  onSuccess,
}: AssignWarehouseModalProps) {
  const queryClient = useQueryClient();

  const formSchema = z.object({
    warehouseLocationId: z.string().min(1, "Kho là bắt buộc"),
    storeOrderId: z.string().optional(),
  });

  const form = useForm<z.input<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      warehouseLocationId: "",
      storeOrderId: requestId,
    },
  });

  const { data: inventoryLocationList } = useQuery({
    queryKey: ["inventoryLocations"],
    queryFn: () => getAllInventoryLocationAPI({}),
    select: (res) => res.data as InventoryLocation[],
  });

  const inventoryLocationOptions = inventoryLocationList?.map((item) => {
    return {
      label: item.name,
      value: item.id,
    };
  });

  const isSubmitting = form.formState.isSubmitting;

  async function onSubmit(data: z.infer<typeof formSchema>) {
    try {
      await createShipmentAssignWarehouseAPI(data);

      queryClient.invalidateQueries({
        queryKey: ["requestDetail", requestId],
      });

      queryClient.invalidateQueries({
        queryKey: ["shipmentAssignDetail"],
      });

      toast.success("Điều phối kho thành công");

      form.reset();
      onClose();
      // onSuccess();
    } catch (error) {
      toast.error("Điều phối kho thất bại");
    }
  }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(value) => {
        if (!value) {
          form.reset();
          onClose();
        }
      }}
    >
      <DialogContent className="sm:max-w-[400px] border-red-100">
        <DialogHeader className="space-y-3">
          {/* Icon Header */}
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
            <AlertCircle className="h-6 w-6 text-red-600" />
          </div>

          <div className="text-center space-y-1">
            <DialogTitle className="text-xl font-bold text-red-700">
              Chọn kho thực hiện
            </DialogTitle>
            <DialogDescription>
              Vui lòng chọn kho để thực hiện điều phối đơn hàng.
            </DialogDescription>
          </div>
        </DialogHeader>

        <FormProvider {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            id="form-reject-request"
            className="py-4"
          >
            <div className="relative group">
              <FormFieldCustom
                name="warehouseLocationId"
                label="Kho hàng"
                placeholder="Chọn kho"
                type="select"
                selectData={inventoryLocationOptions}
                icon={<Warehouse size={16} />}
              />
            </div>
          </form>
        </FormProvider>

        <DialogFooter className="flex sm:justify-between gap-3 border-t pt-4">
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            className="flex-1 gap-2"
          >
            <XCircle className="h-4 w-4" /> Huỷ
          </Button>
          <Button
            type="submit"
            form="form-reject-request"
            disabled={isSubmitting}
            className="flex-1 gap-2 bg-red-600 hover:bg-red-700 text-white"
          >
            {isSubmitting ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : (
              <Send className="h-4 w-4" />
            )}
            Xác nhận
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default memo(AssignWarehouseModal);

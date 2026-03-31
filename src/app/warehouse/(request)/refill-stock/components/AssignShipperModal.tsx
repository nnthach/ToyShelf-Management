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
import { Send, XCircle, Truck, User } from "lucide-react";
import { assignShipperShipmentAssignAPI } from "@/src/services/shipment-assignment.service";
import {
  getAllUserAPI,
  getAllWarehouseStaffAPI,
} from "@/src/services/user.service";
import { User as UserType, WarehouseStaff } from "@/src/types";
import { memo } from "react";
import { useAuth } from "@/src/hooks/useAuth";

type AssignShipperModalProps = {
  requestId: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
};

function AssignShipperModal({
  requestId,
  isOpen,
  onClose,
}: AssignShipperModalProps) {
  const { warehouse } = useAuth();
  const warehouseId = warehouse?.warehouseId;

  const queryClient = useQueryClient();

  const { data: userList } = useQuery({
    queryKey: ["shipper", { warehouseId: warehouseId }],
    queryFn: () =>
      getAllWarehouseStaffAPI({ warehouseId: warehouseId, role: "Shipper" }),
    select: (res) => res.data as WarehouseStaff[],
    enabled: !!warehouseId,
  });

  const userOptions = userList?.map((s) => ({
    value: s.userId,
    label: s.fullName,
  }));

  const formSchema = z.object({
    shipmentAssignmentId: z.string(),
    shipperId: z.string().min(1, "Hãy chọn nhân viên giao hàng"),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      shipmentAssignmentId: requestId,
      shipperId: "",
    },
  });

  const isSubmitting = form.formState.isSubmitting;

  async function onSubmit(data: z.infer<typeof formSchema>) {
    try {
      await assignShipperShipmentAssignAPI(data);
      queryClient.invalidateQueries({ queryKey: ["shipmentAssignRequests"] });
      queryClient.invalidateQueries({
        queryKey: ["shipmentAssignRequest", requestId],
      });

      form.reset();
      toast.success("Điều phối giao hàng thành công");
      onClose();
    } catch (error) {
      toast.error("Điều phối giao hàng thất bại");
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
      <DialogContent className="sm:max-w-[450px] p-0 overflow-hidden border-none shadow-2xl">
        {/* Header với Background Gradient nhẹ */}
        <DialogHeader className="p-6 bg-gradient-to-b from-blue-50 to-white">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-200 animate-in zoom-in duration-300">
              <Truck className="h-6 w-6" />
            </div>
            <div className="text-left space-y-1">
              <DialogTitle className="text-xl font-black text-slate-800 uppercase tracking-tight">
                Điều phối vận chuyển
              </DialogTitle>
              <DialogDescription className="text-xs font-medium text-slate-500">
                Giao nhiệm vụ cho nhân viên giao hàng phù hợp
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="px-6 py-2">
          <FormProvider {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              id="form-assign-shipper"
              className="space-y-6 py-4"
            >
              <FormFieldCustom
                name="shipperId"
                label="Nhân viên phụ trách"
                type="select"
                placeholder="Tìm kiếm hoặc chọn nhân viên..."
                selectData={userOptions}
                icon={<User size={16} />}
              />
            </form>
          </FormProvider>
        </div>

        <DialogFooter className="p-6 bg-slate-50 border-t flex gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              form.reset();
              onClose();
            }}
            className="flex-1 h-11 font-bold border-slate-200 hover:bg-slate-100 text-slate-600 rounded-xl transition-all"
          >
            <XCircle className="h-4 w-4 mr-2" /> Huỷ
          </Button>
          <Button
            type="submit"
            form="form-assign-shipper"
            disabled={isSubmitting}
            className="flex-1 h-11 font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md shadow-blue-100 transition-all active:scale-95"
          >
            {isSubmitting ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : (
              <>
                Xác nhận điều phối <Send className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default memo(AssignShipperModal);

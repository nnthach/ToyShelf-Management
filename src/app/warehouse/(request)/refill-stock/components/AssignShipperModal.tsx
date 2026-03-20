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

import { reviewStoreCreationRequestAPI } from "@/src/services/store-create-request.service";
import { AlertCircle, Layers, Send, XCircle } from "lucide-react";
import { assignShipperShipmentAssignAPI } from "@/src/services/shipment-assignment.service";
import { getAllUserAPI } from "@/src/services/user.service";
import { User } from "@/src/types";
import { Value } from "@radix-ui/react-select";
import { memo } from "react";

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
  onSuccess,
}: AssignShipperModalProps) {
  const queryClient = useQueryClient();

  const { data: userList = [] } = useQuery({
    queryKey: ["shipper", {}],
    queryFn: () => getAllUserAPI({}),
    select: (res) => res.data as User[],
  });

  const userOptions = userList.map((s) => ({
    value: s.id,
    label: s.fullName,
  }));

  const formSchema = z.object({
    shipmentAssignmentId: z.string(),
    shipperId: z.string().min(1, "Hãy chọn nhân viên giao hàng"),
  });

  const form = useForm<z.input<typeof formSchema>>({
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

      queryClient.invalidateQueries({
        queryKey: ["shipmentAssignRequests"],
      });

      queryClient.invalidateQueries({
        queryKey: ["shipmentAssignRequest", requestId],
      });

      queryClient.invalidateQueries({
        queryKey: ["shipment", requestId],
      });

      form.reset();
      toast.success("Giao nhiệm vụ thành công");
      onClose();
      onSuccess();
    } catch (error) {
      toast.error("Giao nhiệm vụ thất bại");
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
              Chọn nhân viên giao hàng
            </DialogTitle>
            <DialogDescription>
              Vui lòng cung cấp lý do cụ thể để chủ cửa hàng có thể điều chỉnh
              lại thông tin.
            </DialogDescription>
          </div>
        </DialogHeader>

        <FormProvider {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            id="form-assign-shipper"
            className="py-4"
          >
            <div className="relative group">
              <FormFieldCustom
                name="shipperId"
                label="Nhân viên giao hàng"
                type="select"
                placeholder="Chọn nhân viên"
                selectData={userOptions}
                icon={<Layers size={16} />}
              />
            </div>
          </form>
        </FormProvider>

        <DialogFooter className="flex sm:justify-between gap-3 border-t pt-4">
          <Button
            type="button"
            variant="ghost"
            onClick={() => {
              form.reset();
              onClose();
            }}
            className="flex-1 gap-2"
          >
            <XCircle className="h-4 w-4" /> Huỷ
          </Button>
          <Button
            type="submit"
            form="form-assign-shipper"
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

export default memo(AssignShipperModal);

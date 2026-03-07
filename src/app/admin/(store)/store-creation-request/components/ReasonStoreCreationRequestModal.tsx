"use client";
import { Button } from "@/src/styles/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
} from "@/src/styles/components/ui/dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import z from "zod";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { FormFieldCustom } from "@/src/styles/components/custom/FormFieldCustom";

import { reviewStoreCreationRequestAPI } from "@/src/services/store-create-request.service";

type ReasonStoreCreateRequestModalProps = {
  requestId: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
};

function ReasonStoreCreateRequestModal({
  requestId,
  isOpen,
  onClose,
  onSuccess,
}: ReasonStoreCreateRequestModalProps) {
  const queryClient = useQueryClient();

  const formSchema = z.object({
    rejectReason: z.string().min(1, "Lý do là bắt buộc"),
    status: z.string().min(1, "Trạng thái là bắt buộc"),
  });

  const form = useForm<z.input<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      status: "Rejected",
      rejectReason: "",
    },
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    try {
      await reviewStoreCreationRequestAPI(data, requestId);

      queryClient.invalidateQueries({
        queryKey: ["storeRequests"],
      });

      await queryClient.invalidateQueries({
        queryKey: ["requestDetail", requestId],
      });

      form.reset();
      toast.success("Cập nhật yêu cầu thành công");
      onClose();
      onSuccess();
    } catch (error) {
      console.log("update city err", error);
      toast.error("Cập nhật yêu cầu thất bại");
    }
  }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(value) => {
        if (!value) onClose();
      }}
    >
      <DialogContent className="sm:max-w-[300px]">
        <FormProvider {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            id="form-approve-request"
          >
            <FormFieldCustom name="rejectReason" label="Lý do" />
          </form>
        </FormProvider>
        <DialogFooter>
          <Button type="submit" form="form-approve-request">
            Gửi
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default ReasonStoreCreateRequestModal;

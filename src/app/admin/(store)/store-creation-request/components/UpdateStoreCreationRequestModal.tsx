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
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { FormFieldCustom } from "@/src/styles/components/custom/FormFieldCustom";
import { getCityDetailAPI, updateCityAPI } from "@/src/services/city.service";
import { formatToInitials } from "@/src/utils/format";
import {
  getStoreCreationRequestDetailAPI,
  reviewStoreCreationRequestAPI,
} from "@/src/services/store-create-request.service";
import { useMapCreate } from "@/src/hooks/useMapCreate";
import { StoreFormValues, storeSchema } from "@/src/schemas/store.schema";
import {
  formatStoreCreateRequestStatusColor,
  formatStoreCreateRequestStatusText,
} from "@/src/utils/formatStatus";
import ReasonStoreCreateRequestModal from "./ReasonStoreCreationRequestModal";

type UpdateStoreCreateRequestModalProps = {
  requestId: string;
  isOpen: boolean;
  onClose: () => void;
};

function UpdateStoreCreateRequestModal({
  requestId,
  isOpen,
  onClose,
}: UpdateStoreCreateRequestModalProps) {
  const queryClient = useQueryClient();

  const [isApprove, setIsApprove] = useState(false);

  const { data: requestDetail, isLoading: requestLoading } = useQuery({
    queryKey: ["requestDetail", requestId],
    queryFn: () => getStoreCreationRequestDetailAPI(requestId!),
    select: (res) => res.data,
    enabled: !!requestId,
  });

  async function handleApprove() {
    try {
      await reviewStoreCreationRequestAPI({ status: "Approved" }, requestId);

      queryClient.invalidateQueries({
        queryKey: ["storeRequests"],
      });

      toast.success("Chấp nhận yêu cầu thành công");

      onClose();
    } catch {
      toast.error("Chấp nhận yêu cầu thất bại");
    }
  }

  return (
    <>
      <Dialog
        open={isOpen}
        onOpenChange={(value) => {
          if (!value) onClose();
        }}
      >
        <form>
          <DialogContent className="sm:max-w-[300px]">
            <DialogHeader>
              <DialogTitle>Chi tiết yêu cầu</DialogTitle>
              <DialogDescription>
                Make changes to your profile here. Click save when you&apos;re
                done.
              </DialogDescription>
            </DialogHeader>

            {/*Chi tiết thông tin yêu cầu */}
            <span
              className={`${formatStoreCreateRequestStatusColor(requestDetail?.status)}`}
            >
              {formatStoreCreateRequestStatusText(requestDetail?.status)}
            </span>
            <p>{requestDetail?.name}</p>
            <p>{requestDetail?.storeAddress}</p>
            <p>{requestDetail?.phoneNumber}</p>

            <DialogFooter>
              <Button onClick={() => setIsApprove(true)}>Từ chối</Button>
              <Button type="submit" onClick={handleApprove}>
                Chấp nhận
              </Button>
            </DialogFooter>
          </DialogContent>
        </form>
      </Dialog>

      {/*Is approve */}
      <ReasonStoreCreateRequestModal
        requestId={requestId}
        isOpen={!!isApprove}
        onClose={() => {
          setIsApprove(false);
        }}
        onSuccess={onClose}
      />
    </>
  );
}

export default UpdateStoreCreateRequestModal;

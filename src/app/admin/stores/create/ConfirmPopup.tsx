import { StoreFormValues } from "@/src/schemas/store.schema";
import { Button } from "@/src/styles/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/src/styles/components/ui/dialog";
import { Check, Clock, Mail, MapPin, User } from "lucide-react";
import { memo } from "react";

import { Dispatch, SetStateAction } from "react";

interface ConfirmPopupProps {
  openVerifyCreateForm: boolean;
  setOpenVerifyCreateForm: Dispatch<SetStateAction<boolean>>;
  imagePreview: string | null;
  previewData: StoreFormValues | null;
  handleConfirmCreateOrUpdate: () => void;
  isLoading: boolean;
}

function ConfirmPopup({
  openVerifyCreateForm,
  setOpenVerifyCreateForm,
  imagePreview,
  previewData,
  handleConfirmCreateOrUpdate,
  isLoading,
}: ConfirmPopupProps) {

  if (!previewData) return null;

  return (
    <Dialog open={openVerifyCreateForm} onOpenChange={setOpenVerifyCreateForm}>
      {previewData && (
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Xác nhận tạo cửa hàng</DialogTitle>
          </DialogHeader>

          {/* IMAGE PREVIEW */}
          {imagePreview && (
            <div className="relative h-40 w-full">
              <img
                src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5"
                alt="Store image"
                className="h-full w-full object-cover"
              />
              {/* Overlay */}
              <div className="absolute inset-0 bg-black/20" />
            </div>
          )}

          {/* Content */}
          <div className="p-5 space-y-4">
            {/* Name & Rating */}
            <div className="space-y-1">
              <h3 className="text-xl font-bold">{previewData?.name}</h3>
            </div>

            {/* Divider */}
            <div className="h-px bg-border" />

            {/* Info */}
            <div className="space-y-3 text-sm">
              {/* Address */}
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 mt-0.5 text-muted-foreground shrink-0" />
                <p className="leading-snug">{previewData.storeAddress}</p>
              </div>

              {/* Time */}
              <div className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-muted-foreground shrink-0" />
                <p>Mon – Sun: 08:00 – 22:00</p>
              </div>
            </div>

            <div className="rounded-md border bg-muted/40 p-2 space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium">
                <User className="w-4 h-4 text-muted-foreground" />
                <span>Owner: Nguyen Ngoc Thach</span>
              </div>

              <div className="space-y-1 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="w-4 h-4" />
                  <span className="text-xs">{previewData.partnerID}</span>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              disabled={isLoading}
              onClick={() => setOpenVerifyCreateForm(false)}
            >
              Đóng
            </Button>

            <Button
              onClick={handleConfirmCreateOrUpdate}
              disabled={isLoading}
              className="btn-primary-gradient"
            >
              Xuất bản
              <Check />
            </Button>
          </DialogFooter>
        </DialogContent>
      )}
    </Dialog>
  );
}

export default memo(ConfirmPopup);

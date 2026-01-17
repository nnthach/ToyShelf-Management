import { ProductFormValues } from "@/shared/schemas/product.schema";
import ModelThreeDPreview from "@/shared/styles/components/custom/ModelThreeDPreview";
import { Button } from "@/shared/styles/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/styles/components/ui/dialog";
import { Check, Clock, Mail, MapPin, User } from "lucide-react";
import { useTranslations } from "next-intl";
import { memo } from "react";

import { Dispatch, SetStateAction } from "react";

interface ConfirmPopupProps {
  openVerifyCreateForm: boolean;
  setOpenVerifyCreateForm: Dispatch<SetStateAction<boolean>>;
  imagePreview: File[] | [];
  threeDPreview: string | null;
  previewData: ProductFormValues | null;
  handleConfirmCreate: () => void;
  isLoading: boolean;
}

function ConfirmPopup({
  openVerifyCreateForm,
  setOpenVerifyCreateForm,
  imagePreview,
  threeDPreview,
  previewData,
  handleConfirmCreate,
  isLoading,
}: ConfirmPopupProps) {
  const tButton = useTranslations("admin.button");

  if (!previewData) return null;

  return (
    <Dialog open={openVerifyCreateForm} onOpenChange={setOpenVerifyCreateForm}>
      {previewData && (
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Xác nhận thêm sản phẩm</DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            {/* LEFT */}
            <div className="space-y-4">
              {threeDPreview && (
                <div className="rounded-xl overflow-hidden border bg-muted">
                  <div className="px-3 py-2 text-sm font-medium border-b">
                    3D Preview
                  </div>
                  <div className="h-[260px]">
                    <ModelThreeDPreview url={threeDPreview} />
                  </div>
                </div>
              )}

              {imagePreview.length > 0 && (
                <div className="rounded-xl border bg-muted p-3">
                  <div className="text-sm font-medium mb-2">
                    Product Images ({imagePreview.length}/4)
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    {imagePreview.slice(0, 4).map((file, index) => {
                      const previewUrl = URL.createObjectURL(file);

                      return (
                        <div
                          key={index}
                          className="relative aspect-square overflow-hidden rounded-lg border"
                        >
                          <img
                            src={previewUrl}
                            alt={`preview-${index}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* RIGHT */}
            <div className="rounded-xl border bg-background p-5 space-y-5">
              <div>
                <h3 className="text-xl font-bold">{previewData?.name}</h3>
                <p className="text-sm text-muted-foreground">
                  Category: {previewData?.productCategoryId}
                </p>
              </div>

              <div className="h-px bg-border" />

              <div>
                <h4 className="text-sm font-medium mb-1">Description</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {previewData?.description}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-md border p-3">
                  <span className="text-muted-foreground text-xs">Weight</span>
                  <p className="font-medium">
                    {previewData?.weight != null
                      ? Number(previewData.weight)
                      : "--"}{" "}
                    {previewData?.unit}
                  </p>
                </div>

                <div className="rounded-md border p-3">
                  <span className="text-muted-foreground text-xs">Colors</span>
                  <p className="font-medium">
                    {previewData?.color?.length
                      ? previewData.color.join(", ")
                      : "--"}
                  </p>
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
              {tButton("close")}
            </Button>

            <Button
              onClick={handleConfirmCreate}
              disabled={isLoading}
              className="btn-primary-gradient"
            >
              {tButton("publish")}
              <Check />
            </Button>
          </DialogFooter>
        </DialogContent>
      )}
    </Dialog>
  );
}

export default memo(ConfirmPopup);

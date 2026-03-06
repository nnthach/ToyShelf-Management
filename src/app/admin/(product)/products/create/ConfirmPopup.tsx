import {
  ProductFormValues,
  ProductUpdateFormValues,
} from "@/src/schemas/product.schema";
import ModelThreeDPreview from "@/src/styles/components/custom/ModelThreeDPreview";
import { Button } from "@/src/styles/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/src/styles/components/ui/dialog";
import { memo } from "react";

import { Dispatch, SetStateAction } from "react";
import { Check } from "lucide-react";

interface ConfirmPopupProps {
  openVerifyCreateForm: boolean;
  setOpenVerifyCreateForm: Dispatch<SetStateAction<boolean>>;
  previewData: ProductUpdateFormValues | ProductFormValues | null;
  handleConfirmCreate: () => void;
  isLoading: boolean;
}

function ConfirmPopup({
  openVerifyCreateForm,
  setOpenVerifyCreateForm,
  previewData,
  handleConfirmCreate,
  isLoading,
}: ConfirmPopupProps) {
  if (!previewData) return null;

  return (
    <Dialog open={openVerifyCreateForm} onOpenChange={setOpenVerifyCreateForm}>
      {previewData && (
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Xác nhận thêm sản phẩm</DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            {/* left info */}
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
              </div>
            </div>

            {/* right color & media*/}
            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
              <h3 className="text-sm font-semibold">Màu sắc & Media</h3>

              {previewData?.colors?.map((color, index) => (
                <div
                  key={index}
                  className="rounded-xl border bg-background p-4 space-y-3"
                >
                  {/* Header */}
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-5 h-5 rounded-full border shadow-sm"
                        style={{ backgroundColor: color.colorHex }}
                      />
                      <span className="font-semibold">{color.colorName}</span>
                    </div>

                    <span className="text-xs bg-muted px-2 py-1 rounded-md">
                      {color.priceSegmentName}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {/* Image */}
                    <div className="aspect-square rounded-lg overflow-hidden border bg-muted">
                      {color.imageUrl ? (
                        <img
                          src={color.imageUrl}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full text-xs text-muted-foreground">
                          Không có ảnh
                        </div>
                      )}
                    </div>

                    {/* 3D */}
                    <div className="aspect-square rounded-lg overflow-hidden border bg-muted">
                      {color.model3DUrl ? (
                        <ModelThreeDPreview
                          key={color.model3DUrl}
                          url={color.model3DUrl}
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full text-xs text-muted-foreground">
                          Không có 3D
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Price */}
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Giá:</span>
                    <span className="font-semibold">
                      {Number(color.price).toLocaleString()} đ
                    </span>
                  </div>
                </div>
              ))}
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
              onClick={handleConfirmCreate}
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

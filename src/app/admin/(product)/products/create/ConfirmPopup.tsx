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
import { Box, Check, Edit, Globe, Package, Ruler, Tag } from "lucide-react";

interface ConfirmPopupProps {
  openVerifyCreateForm: boolean;
  setOpenVerifyCreateForm: Dispatch<SetStateAction<boolean>>;
  previewData: ProductUpdateFormValues | ProductFormValues | null;
  handleConfirmCreate: () => void;
  isLoading: boolean;
  type: string;
}

function ConfirmPopup({
  openVerifyCreateForm,
  setOpenVerifyCreateForm,
  previewData,
  handleConfirmCreate,
  isLoading,
  type,
}: ConfirmPopupProps) {
  if (!previewData) return null;

  return (
    <Dialog open={openVerifyCreateForm} onOpenChange={setOpenVerifyCreateForm}>
      {previewData && (
        <DialogContent className="!max-w-none w-[50vw] max-h-[95vh] flex flex-col p-0 overflow-hidden border-none shadow-2xl">
          <DialogHeader className="p-6 pb-0">
            <DialogTitle className="text-2xl font-bold flex items-center gap-2">
              <Package className="w-6 h-6 text-primary" />
              Xác nhận thông tin sản phẩm
            </DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
            <div className="grid grid-cols-2 gap-6">
              {/* CỘT TRÁI: THÔNG TIN CHI TIẾT (3/5) */}
              <div className=" space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs font-bold rounded uppercase">
                      {previewData?.brand || "Popmart"}
                    </span>
                    <span className="text-sm text-muted-foreground italic">
                      Tuổi: {previewData?.ageRange}+
                    </span>
                  </div>
                  <h3 className="text-2xl font-extrabold tracking-tight">
                    {previewData?.name}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {previewData?.description || "Không có mô tả."}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 rounded-lg bg-secondary/30 border space-y-1">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium uppercase">
                      <Globe className="w-3 h-3" /> Xuất xứ
                    </div>
                    <p className="font-semibold">
                      {previewData?.originCountry || "N/A"}
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-secondary/30 border space-y-1">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium uppercase">
                      <Tag className="w-3 h-3" /> Chất liệu
                    </div>
                    <p className="font-semibold">
                      {previewData?.material || "N/A"}
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="text-sm font-bold flex items-center gap-2 uppercase tracking-wider">
                    <Ruler className="w-4 h-4" /> Thông số vật lý
                  </h4>
                  <div className="grid grid-cols-4 gap-2">
                    {/* Chiều Dài */}
                    <div className="flex flex-col items-center justify-center p-2 rounded-md border bg-background">
                      <span className="text-[10px] text-muted-foreground uppercase">
                        Dài
                      </span>
                      <span className="font-bold text-sm">
                        {typeof previewData?.length === "number" ||
                        typeof previewData?.length === "string"
                          ? previewData.length
                          : "--"}
                        cm
                      </span>
                    </div>

                    {/* Chiều Rộng */}
                    <div className="flex flex-col items-center justify-center p-2 rounded-md border bg-background">
                      <span className="text-[10px] text-muted-foreground uppercase">
                        Rộng
                      </span>
                      <span className="font-bold text-sm">
                        {typeof previewData?.width === "number" ||
                        typeof previewData?.width === "string"
                          ? previewData.width
                          : "--"}
                        cm
                      </span>
                    </div>

                    {/* Chiều Cao */}
                    <div className="flex flex-col items-center justify-center p-2 rounded-md border bg-background">
                      <span className="text-[10px] text-muted-foreground uppercase">
                        Cao
                      </span>
                      <span className="font-bold text-sm">
                        {typeof previewData?.height === "number" ||
                        typeof previewData?.height === "string"
                          ? previewData.height
                          : "--"}
                        cm
                      </span>
                    </div>

                    {/* Cân nặng */}
                    <div className="flex flex-col items-center justify-center p-2 rounded-md border bg-background">
                      <span className="text-[10px] text-muted-foreground uppercase">
                        Nặng
                      </span>
                      <span className="font-bold text-sm">
                        {typeof previewData?.weight === "number" ||
                        typeof previewData?.weight === "string"
                          ? previewData.weight
                          : "--"}
                        g
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              {/* CỘT PHẢI: BIẾN THỂ MÀU SẮC (2/5) */}
              <div className=" space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider flex items-center gap-2">
                  <Box className="w-4 h-4" /> Phiên bản & Media (
                  {previewData?.colors?.length || 0})
                </h3>

                <div className="space-y-4 overflow-y-visible">
                  {previewData?.colors?.map((color, index: number) => (
                    <div
                      key={index}
                      className="group relative rounded-xl border bg-card hover:shadow-md transition-all overflow-hidden"
                    >
                      <div className="p-3 border-b bg-muted/50 flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-4 h-4 rounded-full border ring-2 ring-offset-2 ring-transparent group-hover:ring-primary/20"
                            style={{ backgroundColor: color.colorHex }}
                          />
                          <span className="text-sm font-bold">
                            {color.colorName}
                          </span>
                        </div>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            color.priceSegmentName === "Rẻ"
                              ? "bg-green-100 text-green-700"
                              : "bg-blue-100 text-blue-700"
                          }`}
                        >
                          {color.priceSegmentName}
                        </span>
                      </div>

                      <div className="p-3 grid grid-cols-2 gap-2">
                        <div className="aspect-square rounded-md overflow-hidden border bg-white flex items-center justify-center">
                          {color.imageUrl ? (
                            <img
                              src={color.imageUrl}
                              alt={color.colorName}
                              className="w-full h-full object-contain p-1"
                            />
                          ) : (
                            <span className="text-[10px] text-muted-foreground italic">
                              No Image
                            </span>
                          )}
                        </div>
                        <div className="aspect-square rounded-md overflow-hidden border bg-black/5 relative">
                          {color.model3DUrl ? (
                            <ModelThreeDPreview
                              key={color.model3DUrl}
                              url={color.model3DUrl}
                            />
                          ) : (
                            <div className="flex items-center justify-center h-full text-[10px] text-muted-foreground">
                              No 3D
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="px-3 pb-3 flex justify-between items-baseline">
                        <span className="text-xs text-muted-foreground italic font-mono">
                          Price
                        </span>
                        <span className="text-base font-black text-primary">
                          {Number(color.price).toLocaleString()}{" "}
                          <small className="text-[10px]">VNĐ</small>
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <DialogFooter className="p-6 bg-muted/30 border-t gap-2 shadow-[0_-10px_20px_-5px_rgba(0,0,0,0.05)]">
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
              {type === "Update" ? (
                <>
                  <Edit />
                  Lưu
                </>
              ) : (
                <>
                  <Check />
                  Tạo
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      )}
    </Dialog>
  );
}

export default memo(ConfirmPopup);

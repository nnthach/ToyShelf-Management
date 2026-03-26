"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/src/styles/components/ui/sheet";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getProductDetailAPI } from "@/src/services/product.service";
import ModelThreeDPreview from "@/src/styles/components/custom/ModelThreeDPreview";
import Image from "next/image";
import { Product } from "@/src/types";
import {
  Box,
  ImageIcon,
  Tag,
  Hash,
  BadgeDollarSign,
  Ruler,
  Weight,
  Globe2,
  Shapes,
  Baby,
  Info,
  Power,
  Edit,
  Lock,
  Trash2,
  RotateCcw,
} from "lucide-react";
import {
  formatBooleanIsActiveStatusColor,
  formatBooleanIsActiveStatusText,
} from "@/src/utils/formatStatus";
import { formatColorNameToVN } from "@/src/utils/format";
import { useRouter } from "next/navigation";
import {
  deleteProductAPI,
  disableProductAPI,
  restoreProductAPI,
} from "@/src/services/product.service";
import { toast } from "react-toastify";
import { Button } from "@/src/styles/components/ui/button";

type ViewDetailSheetProps = {
  productId: string | null;
  isOpen: boolean;
  onClose: () => void;
};

function ViewDetailSheet({ productId, isOpen, onClose }: ViewDetailSheetProps) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: productDetail, isLoading } = useQuery({
    queryKey: ["product", productId],
    queryFn: () => getProductDetailAPI(productId!),
    select: (res) => res.data as Product,
    enabled: !!productId,
  });

  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const [viewMode, setViewMode] = useState<"image" | "3d">("image");

  const selectedColor = productDetail?.colors?.[selectedColorIndex];

  async function handleDisable() {
    try {
      await disableProductAPI(productId!);

      queryClient.invalidateQueries({
        queryKey: ["products"],
      });

      await queryClient.invalidateQueries({
        queryKey: ["product", productId],
      });

      toast.success("Vô hiệu hóa sản phẩm thành công");
    } catch (error) {
      toast.error("Vô hiệu hóa sản phẩm thất bại");
    }
  }

  async function handleRestore() {
    try {
      await restoreProductAPI(productId!);

      queryClient.invalidateQueries({
        queryKey: ["products"],
      });

      await queryClient.invalidateQueries({
        queryKey: ["product", productId],
      });

      toast.success("Khôi phục sản phẩm thành công");
    } catch (error) {
      toast.error("Khôi phục sản phẩm thất bại");
    }
  }

  async function handleDelete() {
    try {
      await deleteProductAPI(productId!);

      queryClient.invalidateQueries({
        queryKey: ["products"],
      });

      onClose();
      toast.success("Xóa sản phẩm thành công");
    } catch (error) {
      toast.error("Xóa sản phẩm thất bại");
    }
  }

  if (!productId) return null;

  return (
    <Sheet open={isOpen} onOpenChange={(v) => !v && onClose()}>
      <SheetContent className="w-full sm:max-w-[550px] p-0 flex flex-col gap-0 border-l">
        <SheetHeader className="p-6 pb-4 border-b flex-row justify-between items-center space-y-0">
          <SheetTitle className="flex items-center gap-2 text-xl font-semibold tracking-tight">
            <Box className="w-5 h-5" />
            Chi tiết sản phẩm
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-8 pb-10">
          {/* Main Preview Section */}
          <div className="relative group">
            <div className="w-full aspect-square rounded-2xl border bg-secondary/10 overflow-hidden relative shadow-inner">
              {viewMode === "image" ? (
                selectedColor?.imageUrl ? (
                  <Image
                    src={selectedColor.imageUrl}
                    alt="product"
                    fill
                    className="object-contain p-6 animate-in fade-in duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">
                    Không có hình ảnh
                  </div>
                )
              ) : selectedColor?.model3DUrl ? (
                <div className="w-full h-full animate-in zoom-in-95 duration-300">
                  <ModelThreeDPreview url={selectedColor.model3DUrl} />
                </div>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm italic">
                  Chưa có mô hình 3D cho phiên bản này
                </div>
              )}

              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex p-1 bg-white/90 backdrop-blur-md rounded-full shadow-lg border border-black/5 items-center gap-1">
                <button
                  onClick={() => setViewMode("image")}
                  className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
                    viewMode === "image"
                      ? "bg-black text-white"
                      : "hover:bg-gray-100"
                  }`}
                >
                  <ImageIcon size={14} /> Ảnh
                </button>
                <button
                  onClick={() => setViewMode("3d")}
                  className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
                    viewMode === "3d"
                      ? "bg-black text-white"
                      : "hover:bg-gray-100"
                  }`}
                >
                  <Box size={14} /> 3D
                </button>
              </div>
            </div>
          </div>

          {/* Header Info */}
          <div className="space-y-4">
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold tracking-tight">
                  {productDetail?.name}
                </h2>

                {productDetail?.isActive && (
                  <span
                    className={`
          shrink-0 whitespace-nowrap
          text-[10px] font-bold uppercase border rounded-full px-2 py-1
          ${formatBooleanIsActiveStatusColor(productDetail?.isActive)}
        `}
                  >
                    {formatBooleanIsActiveStatusText(productDetail?.isActive)}
                  </span>
                )}
              </div>

              <p className="text-sm text-muted-foreground italic">
                {productDetail?.description || "Không có mô tả sản phẩm"}
              </p>
            </div>

            <div className="grid grid-cols-3 gap-4 py-4 border-y border-dashed">
              {/* Cột 1: SKU */}
              <div className="space-y-1">
                <p className="text-[10px] uppercase font-bold text-muted-foreground flex items-center gap-1">
                  <Hash size={12} /> SKU Sản phẩm
                </p>
                <p className="font-mono text-sm font-medium">
                  {productDetail?.sku}
                </p>
              </div>

              {/* Cột 2: Danh mục (Mới thêm) */}
              <div className="space-y-1 text-center">
                <p className="text-[10px] uppercase font-bold text-muted-foreground flex items-center gap-1 justify-center">
                  <Tag size={12} /> Danh mục
                </p>
                <p className="text-sm font-medium">
                  {productDetail?.productCategoryName || "Chưa phân loại"}
                </p>
              </div>

              {/* Cột 3: Giá gốc */}
              <div className="space-y-1 text-right">
                <p className="text-[10px] uppercase font-bold text-muted-foreground flex items-center gap-1 justify-end">
                  <BadgeDollarSign size={12} /> Giá gốc
                </p>
                <p className="font-bold text-primary text-lg leading-none">
                  {productDetail?.basePrice?.toLocaleString()}đ
                </p>
              </div>
            </div>
          </div>

          {/* Color Selection */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold flex items-center gap-2 uppercase tracking-wider">
              <Tag size={16} /> Phiên bản màu sắc
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {productDetail?.colors?.map((color, index) => (
                <button
                  key={color.id}
                  onClick={() => setSelectedColorIndex(index)}
                  className={`relative flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${
                    selectedColorIndex === index
                      ? "border-black bg-black/[0.02] shadow-sm ring-1 ring-black/5"
                      : "border-gray-200 opacity-70 hover:opacity-100 hover:border-gray-400"
                  }`}
                >
                  <div
                    className="w-8 h-8 rounded-full border border-black/10 shadow-inner shrink-0 flex items-center justify-center overflow-hidden"
                    style={{ backgroundColor: color.hexcode }}
                  >
                    <div className="w-full h-full shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)]" />
                  </div>
                  <div className="flex items-start justify-between w-full">
                    <div className="overflow-hidden space-y-0.5">
                      <p className="text-sm font-bold truncate text-foreground">
                        {formatColorNameToVN(color?.colorName as string)}
                      </p>

                      <p className="text-[12px] text-gray-800 font-medium pt-0.5">
                        {color.price?.toLocaleString()}đ
                      </p>
                    </div>
                    <p className="text-[9px] font-mono text-blue-600 leading-none bg-blue-50 w-fit px-1 py-0.5 rounded uppercase">
                      {color.sku || "N/A"}
                    </p>
                  </div>
                  {/* Indicator cho màu đang chọn */}
                  {selectedColorIndex === index && (
                    <div className="absolute -top-1.5 -right-1.5 bg-black text-white rounded-full p-0.5 shadow-md">
                      <svg
                        width="10"
                        height="10"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Specifications - Đưa các thông tin bạn yêu cầu vào đây */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold flex items-center gap-2 uppercase tracking-wider">
              <Info size={16} /> Thông số kỹ thuật
            </h3>
            <div className="grid grid-cols-2 gap-px bg-gray-200 border border-gray-200 rounded-xl overflow-hidden shadow-sm">
              <SpecItem
                icon={<Shapes size={14} />}
                label="Chất liệu"
                value={productDetail?.material}
              />
              <SpecItem
                icon={<Globe2 size={14} />}
                label="Xuất xứ"
                value={productDetail?.originCountry}
              />
              <SpecItem
                icon={<Baby size={14} />}
                label="Độ tuổi"
                value={`${productDetail?.ageRange}+`}
              />
              <SpecItem
                icon={<Weight size={14} />}
                label="Trọng lượng"
                value={`${productDetail?.weight}g`}
              />
              <div className="col-span-2 bg-white p-3 flex items-center gap-3">
                <Ruler size={14} className="text-muted-foreground" />
                <div className="flex-1">
                  <p className="text-[10px] text-muted-foreground uppercase font-bold">
                    Kích thước (D x R x C)
                  </p>
                  <p className="text-sm font-medium">
                    {productDetail?.length} x {productDetail?.width} x{" "}
                    {productDetail?.height} cm
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Action Bar */}
        <div className="p-4 border-t bg-white flex items-center gap-3 shadow-[0_-8px_20px_rgba(0,0,0,0.04)]">
          <div className="flex gap-2 flex-1">
            {productDetail?.isActive ? (
              <button
                onClick={handleDisable}
                title="Vô hiệu hóa sản phẩm"
                className="flex items-center justify-center w-full h-11 rounded-xl border border-red-100 text-red-500 hover:bg-red-50 hover:border-red-200 transition-all"
              >
                <Lock size={20} /> Vô hiệu hóa
              </button>
            ) : (
              <>
                <button
                  onClick={handleDelete}
                  title="Xóa vĩnh viễn"
                  className="flex-1 flex items-center justify-center gap-2 h-11 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 transition-all font-medium text-sm"
                >
                  <Trash2 size={18} />
                  Xóa
                </button>

                <button
                  onClick={handleRestore}
                  title="Khôi phục hoạt động"
                  className="flex-1 flex items-center justify-center gap-2 h-11 rounded-xl border border-blue-200 text-blue-600 hover:bg-blue-50 transition-all font-medium text-sm"
                >
                  <RotateCcw size={18} />
                  Mở lại
                </button>
              </>
            )}
          </div>

          <button
            onClick={() => router.push(`/admin/products/edit/${productId}`)}
            className="flex-[2] flex items-center justify-center gap-2 h-11 rounded-xl bg-black text-white text-sm font-bold hover:bg-zinc-800 active:scale-[0.98] transition-all shadow-lg shadow-black/10"
          >
            <Edit size={18} />
            Chỉnh sửa sản phẩm
          </button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

// Component phụ để render dòng thông số cho sạch code
function SpecItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: number | string | undefined;
}) {
  return (
    <div className="bg-white p-3 flex items-center gap-3">
      <div className="text-muted-foreground">{icon}</div>
      <div>
        <p className="text-[10px] text-muted-foreground uppercase font-bold">
          {label}
        </p>
        <p className="text-sm font-medium capitalize">{value || "---"}</p>
      </div>
    </div>
  );
}

export default ViewDetailSheet;

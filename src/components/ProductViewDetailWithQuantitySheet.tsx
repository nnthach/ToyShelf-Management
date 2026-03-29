"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/src/styles/components/ui/sheet";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getProductDetailAPI } from "@/src/services/product.service";
import dynamic from "next/dynamic";
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
} from "lucide-react";
import { formatColorNameToVN } from "@/src/utils/format";

const ModelThreeDPreview = dynamic(
  () => import("@/src/styles/components/custom/ModelThreeDPreview"),
  { ssr: false },
);

type ProductViewDetailWithQuantitySheetProps = {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
};

function ProductViewDetailWithQuantitySheet({
  product,
  isOpen,
  onClose,
}: ProductViewDetailWithQuantitySheetProps) {
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const [viewMode, setViewMode] = useState<"image" | "3d">("image");

  const selectedColor = product?.colors?.[selectedColorIndex];

  console.log("product", product);
  if (!product) return null;

  return (
    <Sheet open={isOpen} onOpenChange={(v) => !v && onClose()}>
      <SheetContent className="w-full sm:max-w-[650px] p-0 flex flex-col gap-0 border-l">
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
                  {product?.name}
                </h2>
              </div>

              <p className="text-sm text-muted-foreground italic">
                {product?.description || "Không có mô tả sản phẩm"}
              </p>
            </div>

            <div className="grid grid-cols-3 gap-4 py-4 border-y border-dashed">
              {/* Cột 1: SKU */}
              <div className="space-y-1">
                <p className="text-[10px] uppercase font-bold text-muted-foreground flex items-center gap-1">
                  <Hash size={12} /> SKU Sản phẩm
                </p>
                <p className="font-mono text-sm font-medium">
                  {product?.productSKU}
                </p>
              </div>

              {/* Cột 2: Danh mục (Mới thêm) */}
              <div className="space-y-1 text-center">
                <p className="text-[10px] uppercase font-bold text-muted-foreground flex items-center gap-1 justify-center">
                  <Tag size={12} /> Danh mục
                </p>
                <p className="text-sm font-medium">
                  {product?.productCategoryName || "Chưa phân loại"}
                </p>
              </div>

              {/* Cột 3: Giá gốc */}
              <div className="space-y-1 text-right">
                <p className="text-[10px] uppercase font-bold text-muted-foreground flex items-center gap-1 justify-end">
                  <BadgeDollarSign size={12} /> Giá gốc
                </p>
                <p className="font-bold text-primary text-lg leading-none">
                  {product?.basePrice?.toLocaleString()}đ
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
              {product?.colors?.map((color, index) => (
                <button
                  key={color.productColorId}
                  onClick={() => setSelectedColorIndex(index)}
                  className={`relative flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${
                    selectedColorIndex === index
                      ? "border-black bg-black/[0.02] shadow-sm ring-1 ring-black/5"
                      : "border-gray-200 opacity-70 hover:opacity-100 hover:border-gray-400"
                  }`}
                >
                  {/* Hình tròn màu */}
                  <div
                    className="w-8 h-8 rounded-full border border-black/10 shadow-inner shrink-0 overflow-hidden"
                    style={{ backgroundColor: color.hexCode }}
                  />

                  <div className="flex flex-col flex-1 min-w-0 gap-1">
                    <div className="flex justify-between items-center">
                      <p className="text-xs font-bold truncate uppercase">
                        {formatColorNameToVN(color?.colorName as string)}
                      </p>
                      <p className="text-[10px] font-mono text-blue-600 bg-blue-50 px-1 rounded">
                        {color.productColorSku || "N/A"}
                      </p>
                    </div>

                    {/* HÀNG CHỈ SỐ KHO: Hiển thị gọn gàng */}
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100">
                        Kho: {color.quantity || 0}
                      </span>
                      {color.inTransit >= 0 && (
                        <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-100">
                          Về: {color.inTransit}
                        </span>
                      )}
                      {color.damaged >= 0 && (
                        <span className="text-[10px] font-bold text-red-600 bg-red-50 px-1.5 py-0.5 rounded border border-red-100">
                          Lỗi: {color.damaged}
                        </span>
                      )}
                    </div>

                    <p className="text-sm font-bold text-gray-900 mt-1">
                      {color.productColorPrice?.toLocaleString()}đ
                    </p>
                  </div>

                  {/* Checkmark khi được chọn */}
                  {selectedColorIndex === index && (
                    <div className="absolute -top-1.5 -right-1.5 bg-black text-white rounded-full p-0.5">
                      <svg
                        width="10"
                        height="10"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="4"
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
                value={product?.material}
              />
              <SpecItem
                icon={<Globe2 size={14} />}
                label="Xuất xứ"
                value={product?.originCountry}
              />
              <SpecItem
                icon={<Baby size={14} />}
                label="Độ tuổi"
                value={`${product?.ageRange}+`}
              />
              <SpecItem
                icon={<Weight size={14} />}
                label="Trọng lượng"
                value={`${product?.weight}g`}
              />
              <div className="col-span-2 bg-white p-3 flex items-center gap-3">
                <Ruler size={14} className="text-muted-foreground" />
                <div className="flex-1">
                  <p className="text-[10px] text-muted-foreground uppercase font-bold">
                    Kích thước (D x R x C)
                  </p>
                  <p className="text-sm font-medium">
                    {product?.length} x {product?.width} x {product?.height} cm
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

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

export default ProductViewDetailWithQuantitySheet;

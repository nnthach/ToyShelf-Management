"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/src/styles/components/ui/sheet";
import { useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import dynamic from "next/dynamic";
import Image from "next/image";
import { Product, ProductAuditTransaction } from "@/src/types";
import {
  Box,
  ImageIcon,
  Tag,
  Hash,
  Ruler,
  Weight,
  Globe2,
  Shapes,
  Baby,
  Info,
  Loader2,
  ArrowUpCircle,
  ArrowDownCircle,
  Package,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { formatColorNameToVN, formatDateTime } from "@/src/utils/format";
import { useSearchParams } from "next/navigation";
import { getInventoryOfProductAPI } from "../services/inventory.service";
import { cn } from "../styles/lib/utils";

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
  const searchParams = useSearchParams();
  const locationId = searchParams.get("locationId");

  const [showInventoryAudit, setShowInventoryAudit] = useState(false);

  const [query, setQuery] = useState({
    fromDate: "",
    toDate: "",
  });

  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const [viewMode, setViewMode] = useState<"image" | "3d">("image");

  const scrollRef = useRef<HTMLDivElement>(null);

  const handleColorSelect = (index: number) => {
    setSelectedColorIndex(index);
    scrollRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  };

  const selectedColor = product?.colors?.[selectedColorIndex];

  // filter
  const updateQuery = (val: Partial<typeof query>) => {
    setQuery((prev) => ({ ...prev, ...val }));
  };

  // call api biến động
  const { data: productInventoryAudit, isLoading } = useQuery({
    queryKey: [
      "inventories",
      locationId,
      selectedColor?.productColorId,
      query.fromDate,
      query.toDate,
    ],
    queryFn: () =>
      getInventoryOfProductAPI({
        locationId,
        productColorId: selectedColor?.productColorId,
        fromDate: query.fromDate || undefined,
        toDate: query.toDate || undefined,
      }),
    select: (res) => res.data,
    enabled: !!locationId && !!selectedColor?.productColorId && isOpen,
  });

  if (!product) return null;

  return (
    <Sheet open={isOpen} onOpenChange={(v) => !v && onClose()}>
      <SheetContent
        className={cn(
          "p-0 flex flex-col gap-0 border-l transition-all duration-300",
          showInventoryAudit
            ? "w-full sm:max-w-[1100px]"
            : "w-full sm:max-w-[650px]",
        )}
      >
        <SheetHeader className="p-6 pb-4 border-b flex-col justify-start items-start space-y-0">
          <SheetTitle className="flex items-center gap-2 text-xl font-semibold tracking-tight">
            <Box className="w-5 h-5" />
            Chi tiết sản phẩm và biến động tồn kho
          </SheetTitle>

          <button
            onClick={() => setShowInventoryAudit((prev) => !prev)}
            className="px-3 py-2 rounded-lg border text-xs font-medium hover:bg-slate-100 transition"
          >
            {showInventoryAudit ? "Ẩn biến động" : "Xem biến động"}
          </button>
        </SheetHeader>
        <div className="flex flex-1 overflow-hidden">
          {/*Left */}
          {showInventoryAudit && (
            <div className="w-[450px] border-r bg-slate-50/50 flex flex-col overflow-hidden">
              {/* Filter Section: Đặt ngay dưới Header để người dùng luôn thấy */}
              <div className="p-4 border-b bg-white/50 space-y-3 shrink-0">
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <input
                      type="date"
                      value={query.fromDate}
                      onChange={(e) =>
                        updateQuery({ fromDate: e.target.value })
                      }
                      className="w-full bg-white border border-slate-200 text-xs font-medium rounded-lg px-2 py-2 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    />
                    <span className="absolute -top-2 left-2 bg-white px-1 text-[9px] text-slate-400 font-bold uppercase">
                      Từ ngày
                    </span>
                  </div>

                  <div className="relative flex-1">
                    <input
                      type="date"
                      value={query.toDate}
                      onChange={(e) => updateQuery({ toDate: e.target.value })}
                      className="w-full bg-white border border-slate-200 text-xs font-medium rounded-lg px-2 py-2 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    />
                    <span className="absolute -top-2 left-2 bg-white px-1 text-[9px] text-slate-400 font-bold uppercase">
                      Đến ngày
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex-1 min-h-0 p-4">
                {isLoading ? (
                  <div className="h-full flex flex-col items-center justify-center text-muted-foreground gap-2">
                    <Loader2 className="h-8 w-8 animate-spin" />
                    <p className="text-sm">Đang tải dữ liệu...</p>
                  </div>
                ) : productInventoryAudit ? (
                  <div className="h-full flex flex-col min-h-0 space-y-6">
                    {/* Tóm tắt nhanh */}
                    <div className="grid grid-cols-3 gap-3 shrink-0">
                      <div className="bg-white p-3 rounded-xl border shadow-sm">
                        <p className="text-[10px] text-muted-foreground uppercase font-bold">
                          Đầu kỳ
                        </p>
                        <p className="text-xl font-bold">
                          {productInventoryAudit?.openingStock || 0}
                        </p>
                      </div>
                      <div className="bg-white p-3 rounded-xl border shadow-sm">
                        <p className="text-[10px] text-muted-foreground uppercase font-bold">
                          Cuối kỳ
                        </p>
                        <p className="text-xl font-bold text-blue-600">
                          {productInventoryAudit?.closingStock || 0}
                        </p>
                      </div>

                      <div className="bg-white p-3 rounded-xl border shadow-sm">
                        <p className="text-[10px] text-muted-foreground uppercase font-bold">
                          Hiện tại
                        </p>
                        <p className="text-xl font-bold text-green-600">
                          {productInventoryAudit?.currentInventory || 0}
                        </p>
                      </div>
                    </div>
                    {/* Status Check */}
                    <div className="shrink-0">
                      <div
                        className={`p-3 rounded-xl border flex items-center gap-3 ${productInventoryAudit.isMatched ? "bg-emerald-50 border-emerald-100 text-emerald-800" : "bg-amber-50 border-amber-100 text-amber-800"}`}
                      >
                        {productInventoryAudit.isMatched ? (
                          <CheckCircle2 size={18} />
                        ) : (
                          <AlertCircle size={18} />
                        )}
                        <span className="text-xs font-medium">
                          {productInventoryAudit.isMatched
                            ? "Số liệu kho trùng khớp hệ thống"
                            : "Phát hiện sai lệch tồn kho"}
                        </span>
                      </div>
                    </div>
                    {/* Danh sách giao dịch */}
                    <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar">
                      {productInventoryAudit?.transactions?.length > 0 ? (
                        productInventoryAudit.transactions.map(
                          (trans: ProductAuditTransaction, i: number) => (
                            <div
                              key={i}
                              className="bg-white p-3 rounded-lg border border-slate-200 flex items-center gap-3"
                            >
                              <div
                                className={`p-2 rounded-full ${trans.quantity >= 0 ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"}`}
                              >
                                {trans.quantity >= 0 ? (
                                  <ArrowUpCircle size={18} />
                                ) : (
                                  <ArrowDownCircle size={18} />
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-bold truncate capitalize">
                                  {productInventoryAudit?.locationType ===
                                  "Store"
                                    ? trans?.type === "Shipment"
                                      ? "Nhập hàng"
                                      : trans?.type === "DamageReport"
                                        ? "Thu hồi"
                                        : "Bán hàng"
                                    : trans?.type === "Shipment"
                                      ? "Giao hàng"
                                      : trans?.type === "DamageReport"
                                        ? "Thu hồi"
                                        : trans?.type === "Refill"
                                          ? "Bổ sung hàng"
                                          : "Bán hàng"}
                                </p>
                                <p className="text-[12px] text-muted-foreground">
                                  {formatDateTime(trans?.date).full || ""}
                                </p>
                              </div>
                              <div className="text-right">
                                <p
                                  className={`text-sm font-bold ${trans.quantity >= 0 ? "text-emerald-600" : "text-red-600"}`}
                                >
                                  {trans.quantity > 0
                                    ? `+${trans.quantity}`
                                    : trans.quantity}
                                </p>
                                <p className="text-[12px] text-muted-foreground">
                                  Tồn: {trans.balanceAfter}
                                </p>
                              </div>
                            </div>
                          ),
                        )
                      ) : (
                        <div className="text-center py-10 bg-white rounded-xl border border-dashed">
                          <Package className="mx-auto h-8 w-8 text-slate-300 mb-2" />
                          <p className="text-sm text-slate-400">
                            Không có giao dịch nào
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-muted-foreground">
                    <AlertCircle className="mb-2" />
                    <p className="text-sm">Không tìm thấy dữ liệu kho</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/*Right */}
          <div
            ref={scrollRef}
            className={`overflow-y-auto px-6 py-4 space-y-8 pb-10 scroll-smooth custom-scrollbar transition-all duration-300 ${
              showInventoryAudit ? "flex-1" : "w-full"
            }`}
          >
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
                    {product?.name ||
                      product?.productName ||
                      "Tên sản phẩm không xác định"}
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
                {/* <div className="space-y-1 text-right">
                  <p className="text-[10px] uppercase font-bold text-muted-foreground flex items-center gap-1 justify-end">
                    <BadgeDollarSign size={12} /> Giá gốc
                  </p>
                  <p className="font-bold text-primary text-lg leading-none">
                    {product?.basePrice?.toLocaleString()}đ
                  </p>
                </div> */}
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
                    onClick={() => handleColorSelect(index)}
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
                          Kho: {color?.quantity || color?.available || 0}
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
            {/* Specifications Section */}
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b pb-2">
                <h3 className="text-sm font-bold flex items-center gap-2 uppercase tracking-widest text-slate-800">
                  <div className="p-1.5 bg-blue-50 rounded-lg text-blue-600">
                    <Info size={16} />
                  </div>
                  Thông số kỹ thuật
                </h3>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <SpecItem
                  icon={<Shapes size={16} />}
                  label="Chất liệu"
                  value={product?.material}
                  color="bg-orange-50 text-orange-600"
                />
                <SpecItem
                  icon={<Globe2 size={16} />}
                  label="Xuất xứ"
                  value={product?.originCountry}
                  color="bg-blue-50 text-blue-600"
                />
                <SpecItem
                  icon={<Baby size={16} />}
                  label="Độ tuổi"
                  value={product?.ageRange ? `${product.ageRange}+` : undefined}
                  color="bg-purple-50 text-purple-600"
                />
                <SpecItem
                  icon={<Weight size={16} />}
                  label="Trọng lượng"
                  value={product?.weight ? `${product.weight}g` : undefined}
                  color="bg-emerald-50 text-emerald-600"
                />

                {/* Full width item cho Kích thước */}
                <div className="col-span-2 flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100/50 hover:bg-slate-100 transition-colors">
                  <div className="h-10 w-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-slate-500 shrink-0">
                    <Ruler size={20} />
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-[10px] text-slate-400 uppercase font-extrabold tracking-wider">
                      Kích thước tổng thể (D x R x C)
                    </p>
                    <p className="text-sm font-bold text-slate-900">
                      {product?.length} × {product?.width} × {product?.height}{" "}
                      <span className="text-[12px] font-normal text-slate-600 ml-1">
                        cm
                      </span>
                    </p>
                  </div>
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
  color = "bg-slate-100 text-slate-600",
}: {
  icon: React.ReactNode;
  label: string;
  value: number | string | undefined;
  color?: string;
}) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-xl bg-white border border-slate-100 hover:border-blue-200 transition-all group">
      {/* Icon bên trái */}
      <div
        className={`w-9 h-9 shrink-0 rounded-lg ${color} flex items-center justify-center transition-transform group-hover:scale-105`}
      >
        {icon}
      </div>

      {/* Nội dung bên phải */}
      <div className="flex flex-col min-w-0">
        <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider leading-none mb-1">
          {label}
        </p>
        <p className="text-[13px] font-bold text-slate-800 truncate leading-tight">
          {value || "---"}
        </p>
      </div>
    </div>
  );
}

export default ProductViewDetailWithQuantitySheet;

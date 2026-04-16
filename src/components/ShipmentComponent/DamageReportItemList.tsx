import { DamageReportItem } from "@/src/types";
import { formatColorNameToVN } from "@/src/utils/format";
import { Box, LayoutGrid, Package, Package2, Warehouse } from "lucide-react";
import Image from "next/image";
import { memo } from "react";
import { ImageView } from "../ImageView";

// 1. Helper để render Type Badge đồng nhất
const TypeBadge = ({ type }: { type: string }) => {
  const configs = {
    Product: {
      icon: Package2,
      label: "Sản phẩm",
      color: "text-blue-500",
      bg: "bg-blue-50",
    },
    Shelf: {
      icon: LayoutGrid,
      label: "Kệ",
      color: "text-indigo-500",
      bg: "bg-indigo-50",
    },
    Default: {
      icon: Box,
      label: "Hỗn hợp",
      color: "text-slate-500",
      bg: "bg-slate-50",
    },
  };
  const config = configs[type as keyof typeof configs] || configs.Default;
  const Icon = config.icon;

  return (
    <div
      className={`flex items-center gap-1 px-1.5 py-0.5 rounded border border-slate-100 bg-white shadow-sm`}
    >
      <Icon className={`w-3 h-3 ${config.color}`} />
      <span className="text-[10px] font-bold text-slate-600 uppercase tracking-tight">
        {config.label}
      </span>
    </div>
  );
};

const QuantityDisplay = ({ value }: { value: number }) => (
  <div className="flex flex-col items-end shrink-0 pt-1">
    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter leading-none mb-1">
      Số lượng
    </span>
    <span className="text-xl font-black text-slate-900 leading-none tabular-nums">
      {value}
    </span>
  </div>
);

function DamageReportItemList({
  damageItems,
}: {
  damageItems: DamageReportItem[];
}) {
  const totalQuantity = damageItems.reduce(
    (sum, item) => sum + item.quantity,
    0,
  );
  return (
    <div className="flex flex-col h-full bg-white overflow-hidden">
      <div className="p-4 border-b bg-slate-50/80 flex items-center justify-between sticky top-0 z-10 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <Package className="h-4 w-4 text-slate-600" />
          <h4 className="font-bold text-[11px] uppercase tracking-wider text-slate-600">
            Sản phẩm & Kệ hàng
          </h4>
        </div>
        <span className="bg-slate-900 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
          {totalQuantity || 0}
        </span>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-slate-50/50">
        {damageItems?.length > 0 ? (
          damageItems.map((item) => (
            <div
              key={item.id}
              className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm transition-all"
            >
              {item.type === "Product" ? (
                <ProductDamageItem item={item} />
              ) : (
                <ShelfDamageItem item={item} />
              )}
            </div>
          ))
        ) : (
          <div className="text-center py-20 text-slate-400 italic text-sm">
            Chưa có báo cáo hư hỏng
          </div>
        )}
      </div>
    </div>
  );
}

const ProductDamageItem = ({ item }: { item: DamageReportItem }) => {
  return (
    <div className="flex items-start justify-between gap-3">
      <div className="flex items-start gap-3 flex-1 min-w-0">
        {/* Image Thumbnail */}
        <div className="h-12 w-12 rounded-lg border border-slate-200 bg-slate-100 flex-shrink-0 overflow-hidden relative shadow-sm">
          {item?.imageUrl ? (
            <Image
              src={item.imageUrl}
              alt=""
              fill
              className="object-cover"
              sizes="48px"
            />
          ) : (
            <div className="flex items-center justify-center h-full w-full">
              <Package className="h-5 w-5 text-slate-300" />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="min-w-0 flex-1 flex flex-col gap-1.5">
          <h5 className="font-bold text-[13px] text-slate-800 leading-snug truncate">
            {item.productName || "N/A"}
          </h5>

          <div className="flex flex-wrap items-center gap-1.5">
            <TypeBadge type={item.type} />
            <span className="text-[11px] font-mono text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
              {item.sku}
            </span>
            <span className="text-[11px] font-medium text-violet-600 bg-violet-50 px-1.5 py-0.5 rounded border border-violet-100">
              {formatColorNameToVN(item.colorName)}
            </span>
          </div>

          <div className="mt-1">
            <ImageView
              mediaUrls={item.mediaUrls}
              productName={item.productName}
            />
          </div>
        </div>
      </div>

      <QuantityDisplay value={item.quantity} />
    </div>
  );
};

// 3. Shelf Item Component
const ShelfDamageItem = ({ item }: { item: DamageReportItem }) => {
  return (
    <div className="flex items-start justify-between gap-3">
      <div className="flex items-start gap-3 flex-1 min-w-0">
        <div className="h-12 w-12 rounded-lg border border-orange-200 bg-orange-50 flex-shrink-0 flex items-center justify-center shadow-sm">
          <Warehouse className="h-6 w-6 text-orange-500" />
        </div>

        <div className="min-w-0 flex-1 flex flex-col gap-1.5">
          <h5 className="font-bold text-[13px] text-slate-800 leading-snug truncate">
            Kệ: {item.shelfName || "N/A"}
          </h5>

          <div className="flex flex-wrap items-center gap-1.5">
            <TypeBadge type={item.type} />
            <span className="text-[11px] font-mono font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded border border-orange-100">
              {item.shelfCode}
            </span>
          </div>

          <div className="mt-1">
            <ImageView
              mediaUrls={item.mediaUrls}
              productName={item.shelfCode}
            />
          </div>
        </div>
      </div>

      <QuantityDisplay value={item.quantity} />
    </div>
  );
};

export default memo(DamageReportItemList);

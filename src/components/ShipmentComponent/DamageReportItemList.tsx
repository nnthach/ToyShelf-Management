import { DamageReportItem } from "@/src/types";
import { formatColorNameToVN } from "@/src/utils/format";
import { Package, Warehouse } from "lucide-react";
import Image from "next/image";
import { memo } from "react";

function DamageReportItemList({
  damageItems,
}: {
  damageItems: DamageReportItem[];
}) {
  return (
    <div className="flex flex-col h-full bg-white overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b bg-slate-50/50 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <Package className="h-4 w-4 text-primary" />
          <h4 className="font-bold text-xs uppercase tracking-wider text-slate-600">
            Sản phẩm & Kệ hàng
          </h4>
        </div>
        <span className="bg-primary/10 text-primary text-[11px] px-2.5 py-0.5 rounded-full font-bold border border-primary/20">
          {damageItems?.length || 0} mục
        </span>
      </div>

      {/* Danh sách sản phẩm - Chỉ dùng 1 vòng lặp duy nhất */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar bg-slate-50/30">
        {damageItems?.length > 0 ? (
          damageItems.map((item) => (
            <div
              key={item.id}
              className="bg-white p-3 rounded-xl border border-slate-100 shadow-sm hover:border-primary/30 transition-all group"
            >
              {item.type === "Product" ? (
                <ProductDamageItem item={item} />
              ) : (
                <ShelfDamageItem item={item} />
              )}
            </div>
          ))
        ) : (
          <div className="text-center py-10 text-slate-400 italic text-sm">
            Chưa có báo cáo hư hỏng
          </div>
        )}
      </div>
    </div>
  );
}

const ProductDamageItem = ({ item }: { item: DamageReportItem }) => {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-4 flex-1 min-w-0">
        {/* Image */}
        <div className="h-12 w-12 rounded-lg border border-slate-100 bg-slate-50 flex-shrink-0 overflow-hidden relative group-hover:shadow-md transition-shadow">
          {item?.imageUrl ? (
            <Image
              src={item.imageUrl}
              alt={item.productName || ""}
              fill
              className="object-cover"
              sizes="48px"
            />
          ) : (
            <div className="flex items-center justify-center h-full w-full">
              <Package className="h-5 w-5 text-slate-200" />
            </div>
          )}
        </div>

        {/* Info */}
        <div className="min-w-0 flex-1">
          <h5 className="font-bold text-[13px] text-slate-800 leading-tight truncate">
            {item.productName || "N/A"}
          </h5>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-[11px] font-mono text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-100">
              {item.sku}
            </span>
            <span className="w-1 h-1 rounded-full bg-slate-300"></span>
            <span className="text-[11px] font-medium text-slate-500 bg-violet-50 text-violet-600 px-1.5 py-0.5 rounded">
              {formatColorNameToVN(item.colorName)}
            </span>
          </div>
        </div>
      </div>

      {/* Quantity - Đã căn chỉnh lại */}
      <div className="flex flex-col items-end shrink-0">
        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">
          Số lượng
        </span>
        <span className="text-lg font-black text-slate-900 leading-none">
          {item.quantity}
        </span>
      </div>
    </div>
  );
};

const ShelfDamageItem = ({ item }: { item: DamageReportItem }) => {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-4 flex-1 min-w-0">
        {/* Icon đặc trưng cho kệ để dễ phân biệt với SP */}
        <div className="h-12 w-12 rounded-lg border border-orange-100 bg-orange-50 flex-shrink-0 flex items-center justify-center">
          <Warehouse className="h-6 w-6 text-orange-400" />
        </div>

        <div className="min-w-0 flex-1">
          <h5 className="font-bold text-[13px] text-slate-800 leading-tight truncate">
            Kệ: {item.shelfName || "N/A"}
          </h5>
          <div className="mt-1">
            <span className="text-[11px] font-mono text-orange-600 bg-orange-50 px-1.5 py-0.5 rounded border border-orange-100">
              Mã kệ: {item.shelfCode}
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-end shrink-0">
        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">
          Số lượng
        </span>
        <span className="text-lg font-black text-slate-900 leading-none">
          {item.quantity}
        </span>
      </div>
    </div>
  );
};

export default memo(DamageReportItemList);

import { RefillRequest, RefillRequestProductColor } from "@/src/types";
import { formatColorNameToVN } from "@/src/utils/format";
import { Package, AlertCircle, CheckCircle2 } from "lucide-react";
import Image from "next/image";
import { memo } from "react";

interface ShipmentProductListComponentProps {
  storeOrderDetail: RefillRequest | undefined;
}

function ShipmentProductListComponent({
  storeOrderDetail,
}: ShipmentProductListComponentProps) {
  const itemList = storeOrderDetail?.items;

  return (
    <div className="flex flex-col h-full overflow-hidden bg-slate-50/50">
      {/* Header */}
      <div className="p-4 border-b bg-white flex items-center justify-between sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-2">
          <Package className="h-4 w-4 text-primary" />
          <h4 className="font-bold text-xs uppercase tracking-wider text-slate-700">
            Sản phẩm & Đối soát số lượng
          </h4>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-medium text-slate-400 uppercase">
            Tổng mục:
          </span>
          <span className="bg-primary text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
            {itemList?.length || 0}
          </span>
        </div>
      </div>

      {/* Danh sách sản phẩm */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
        {itemList?.length ? (
          itemList.map((item: RefillRequestProductColor, index: number) => {
            const received = item.fulfilledQuantity || 0;
            const requested = item.quantity || 0;
            const isShortfall = received < requested;
            const isFullyReceived = received >= requested && requested > 0;

            return (
              <div
                key={item.productColorId || index}
                className="bg-white border border-slate-200 rounded-xl p-3 shadow-sm hover:shadow-md transition-all flex items-center gap-4 group"
              >
                {/* BÊN TRÁI: THÔNG TIN SẢN PHẨM */}
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="h-12 w-12 rounded-lg border border-slate-100 bg-slate-50 flex-shrink-0 overflow-hidden relative shadow-sm group-hover:border-primary/20 transition-colors">
                    {item?.imageUrl ? (
                      <Image
                        src={item.imageUrl}
                        alt={item.productName || "Product"}
                        fill
                        className="object-cover"
                        sizes="48px"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full w-full bg-slate-100">
                        <Package className="h-5 w-5 text-slate-300" />
                      </div>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <h5 className="font-bold text-[13px] text-slate-800 leading-tight truncate mb-1">
                      {item.productName}
                    </h5>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[10px] font-mono text-slate-400 font-medium bg-slate-50 px-1 rounded border border-slate-100">
                        {item.sku || "N/A"}
                      </span>
                      <span className="text-[10px] bg-violet-50 text-violet-600 px-1.5 py-0.5 rounded font-medium border border-violet-100 leading-none">
                        {formatColorNameToVN(item?.color as string)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* BÊN PHẢI: CỤM SỐ LIỆU ĐỐI SOÁT */}
                <div className="flex items-center shrink-0">
                  <div className="flex items-center bg-slate-50/80 rounded-lg border border-slate-100 p-1">
                    {/* Cột Yêu cầu */}
                    <div className="flex flex-col items-center px-3 py-1">
                      <span className="text-[8px] text-slate-400 uppercase font-black leading-none mb-1">
                        Yêu cầu
                      </span>
                      <span className="text-xs font-bold text-slate-600">
                        {requested}
                      </span>
                    </div>

                    {/* Đường chia dọc */}
                    <div className="h-6 w-px bg-slate-200" />

                    {/* Cột Thực nhận */}
                    <div className="flex flex-col items-center px-3 py-1 min-w-[60px]">
                      <span
                        className={`text-[8px] uppercase font-black leading-none mb-1 ${
                          isShortfall && received > 0
                            ? "text-destructive"
                            : isFullyReceived
                              ? "text-emerald-600"
                              : "text-slate-400"
                        }`}
                      >
                        Thực nhận
                      </span>
                      <div className="flex items-center gap-1">
                        <span
                          className={`text-sm font-black ${
                            isShortfall && received > 0
                              ? "text-destructive"
                              : isFullyReceived
                                ? "text-emerald-600"
                                : received === 0
                                  ? "text-slate-300"
                                  : "text-slate-600"
                          }`}
                        >
                          {received}
                        </span>

                        {/* Biểu tượng trạng thái */}
                        {isFullyReceived && (
                          <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                        )}
                        {isShortfall && received > 0 && (
                          <AlertCircle className="h-3 w-3 text-destructive animate-pulse" />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400 opacity-60">
            <Package className="h-10 w-10 mb-2 stroke-1" />
            <p className="text-sm italic">Danh sách sản phẩm trống</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default memo(ShipmentProductListComponent);

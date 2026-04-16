import { RefillRequest, RefillShelfRequestItem, Shipment } from "@/src/types";
import { AlertCircle, CheckCircle2, Layers, Package } from "lucide-react";
import Image from "next/image";

interface ShipmentShelfListComponentProps {
  shelfOrderDetail: RefillRequest | undefined;
}

function ShipmentShelfListComponent({
  shelfOrderDetail,
}: ShipmentShelfListComponentProps) {
  const itemList = shelfOrderDetail?.items as RefillShelfRequestItem[] | [];

  return (
    <div className="flex flex-col h-full overflow-hidden bg-slate-50/50">
      {/* Header */}
      <div className="p-4 border-b bg-white flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <Package className="h-4 w-4 text-primary" />
          <h4 className="font-bold text-sm uppercase">Sản phẩm & Số lượng</h4>
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
          itemList.map((item: RefillShelfRequestItem, index: number) => {
            const received = item.fulfilledQuantity || 0;
            const requested = item.quantity || 0;
            const isShortfall = received < requested;
            const isFullyReceived = received >= requested && requested > 0;

            return (
              <div
                key={item.shelfTypeId || index}
                className="bg-white border rounded-xl p-3 shadow-sm hover:shadow-md transition-all flex items-center gap-4"
              >
                {/* BÊN TRÁI: THÔNG TIN SẢN PHẨM (Chiếm phần lớn diện tích) */}
                <div className="flex items-center gap-4 flex-1 min-w-0 group">
                  <div className="h-14 w-14 rounded-xl border bg-slate-50 flex-shrink-0 overflow-hidden relative shadow-sm">
                    {item?.imageUrl ? (
                      <Image
                        src={item.imageUrl}
                        alt=""
                        fill
                        className="object-cover"
                        sizes="56px"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full w-full bg-slate-50">
                        <Package className="h-5 w-5 text-slate-300" />
                      </div>
                    )}
                  </div>

                  <div className="min-w-0">
                    <h5 className="font-bold text-[14px] text-slate-900 leading-tight truncate">
                      {item.shelfTypeName || "N/A"}
                    </h5>

                    <div className="flex items-center gap-2 mt-1.5">
                      <div className="flex items-center text-[12px] text-slate-500 whitespace-nowrap">
                        <span className="font-medium">
                          {item.width}×{item.height}×{item.depth}
                        </span>
                      </div>

                      <span className="w-1 h-1 rounded-full bg-slate-300"></span>

                      <div className="flex items-center gap-1 text-[12px]">
                        <Layers className="w-3.5 h-3.5 text-blue-500" />
                        <span className="font-semibold text-slate-700">
                          {item.totalLevels} tầng
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* BÊN PHẢI: 3 NHÓM SỐ LIỆU (Gom cụm đối soát) */}
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

export default ShipmentShelfListComponent;

import { RefillRequest, RefillShelfRequestItem, Shipment } from "@/src/types";
import { Layers, Package } from "lucide-react";
import Image from "next/image";

interface ShipmentShelfListComponentProps {
  shipmentDetail: Shipment | undefined;
  storeOrderDetail: RefillRequest | undefined;
}

function ShipmentShelfListComponent({
  shipmentDetail,
  storeOrderDetail,
}: ShipmentShelfListComponentProps) {
  const shipmentItemMap = new Map(
    shipmentDetail?.shelfItems?.map((item: RefillShelfRequestItem) => [
      item.shelfTypeId,
      item,
    ]) || [],
  );

  const itemsWithQuantities = (
    storeOrderDetail?.items as RefillShelfRequestItem[]
  )?.map((item) => {
    const shipmentItem = shipmentItemMap.get(item.shelfTypeId);

    return {
      ...item,
      expectedQuantity: shipmentItem?.expectedQuantity || 0,
      receivedQuantity: shipmentItem?.receivedQuantity || 0,
    };
  });

  return (
    <>
      {/* Header */}
      <div className="p-4 border-b bg-white flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <Package className="h-4 w-4 text-primary" />
          <h4 className="font-bold text-sm uppercase">Sản phẩm & Số lượng</h4>
        </div>
        <span className="bg-primary text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
          {itemsWithQuantities?.length || 0}
        </span>
      </div>

      {/* Danh sách sản phẩm */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
        {itemsWithQuantities?.map(
          (item: RefillShelfRequestItem, index: number) => {
            const expected = item?.expectedQuantity ?? 0;
            const received = item?.receivedQuantity ?? 0;
            const isShortfall = received < expected;

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
                <div className="flex items-center gap-4 shrink-0 pr-2">
                  {/* Yêu cầu */}
                  <div className="flex flex-col items-center min-w-[45px]">
                    <span className="text-[8px] text-slate-400 uppercase font-bold tracking-tighter mb-0.5">
                      Yêu cầu
                    </span>
                    <span className="text-sm font-semibold text-slate-500">
                      {item.quantity}
                    </span>
                  </div>

                  {/* Kho giao */}
                  <div className="flex flex-col items-center min-w-[45px] border-l border-slate-100 pl-4">
                    <span className="text-[8px] text-blue-500 uppercase font-bold tracking-tighter mb-0.5">
                      Xuất kho
                    </span>
                    <span
                      className={`text-sm font-bold ${expected > 0 ? "text-blue-600" : "text-slate-300"}`}
                    >
                      {expected}
                    </span>
                  </div>

                  {/* Thực nhận */}
                  <div className="flex flex-col items-center min-w-[45px] border-l border-slate-100 pl-4">
                    <span
                      className={`text-[8px] uppercase font-bold tracking-tighter mb-0.5 ${isShortfall && received > 0 ? "text-destructive" : "text-green-600"}`}
                    >
                      Nhận
                    </span>
                    <span
                      className={`text-sm font-bold ${isShortfall && received > 0 ? "text-destructive" : received > 0 ? "text-green-600" : "text-slate-300"}`}
                    >
                      {received}
                    </span>
                  </div>
                </div>
              </div>
            );
          },
        )}
      </div>
    </>
  );
}

export default ShipmentShelfListComponent;

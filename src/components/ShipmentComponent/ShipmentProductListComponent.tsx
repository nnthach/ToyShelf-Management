import {
  RefillRequest,
  RefillRequestProductColor,
  Shipment,
} from "@/src/types";
import { Package } from "lucide-react";

interface ShipmentProductListComponentProps {
  shipmentDetail: Shipment | undefined;
  storeOrderDetail: RefillRequest | undefined;
}

function ShipmentProductListComponent({
  shipmentDetail,
  storeOrderDetail,
}: ShipmentProductListComponentProps) {
  const shipmentItemMap = new Map(
    shipmentDetail?.items?.map((item: RefillRequestProductColor) => [
      item.productColorId,
      item,
    ]) || [],
  );

  const itemsWithQuantities = storeOrderDetail?.items?.map(
    (item: RefillRequestProductColor) => {
      // Tra cứu thông tin shipment tương ứng
      const shipmentItem = shipmentItemMap.get(item.productColorId);

      return {
        ...item,
        expectedQuantity: shipmentItem?.expectedQuantity || 0,
        receivedQuantity: shipmentItem?.receivedQuantity || 0,
      };
    },
  );
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
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {itemsWithQuantities?.map(
          (item: RefillRequestProductColor, index: number) => {
            const expected = item?.expectedQuantity ?? 0;
            const received = item?.receivedQuantity ?? 0;

            const isShortfall = received < expected;

            return (
              <div
                key={item.productColorId || index}
                className="bg-white border rounded-xl p-3 shadow-sm hover:shadow-md transition-shadow"
              >
                {/* Header sản phẩm */}
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="font-bold text-[13px] uppercase text-slate-800 leading-tight">
                      {item.productName}
                    </p>
                  </div>
                  <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full border font-bold uppercase font-mono">
                    {item.color}
                  </span>
                </div>

                {/* 3 Cột số lượng */}
                <div className="grid grid-cols-3 gap-1 bg-slate-50 rounded-lg p-2 border border-slate-100 relative">
                  {/* 1. Số lượng Yêu cầu */}
                  <div className="text-center">
                    <p className="text-[9px] text-muted-foreground uppercase font-bold tracking-tighter">
                      Yêu cầu
                    </p>
                    <p className="font-bold text-lg text-slate-600">
                      {item.quantity}
                    </p>
                  </div>

                  {/* 2. Số lượng Kho chuẩn bị */}
                  <div className="text-center relative">
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[1px] h-8 bg-slate-200"></div>

                    <p className="text-[9px] text-blue-500 uppercase font-bold tracking-tighter">
                      Kho giao
                    </p>
                    <p
                      className={`font-bold text-lg ${expected > 0 ? "text-blue-600" : "text-slate-300"}`}
                    >
                      {item.expectedQuantity}
                    </p>
                  </div>

                  {/* 3. Số lượng Thực nhận */}
                  <div className="text-center relative">
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[1px] h-8 bg-slate-200"></div>

                    <p
                      className={`text-[9px] uppercase font-bold tracking-tighter ${isShortfall && received > 0 ? "text-destructive" : "text-green-600"}`}
                    >
                      Thực nhận
                    </p>
                    <p
                      className={`font-bold text-lg ${isShortfall && received > 0 ? "text-destructive" : received > 0 ? "text-green-600" : "text-slate-300"}`}
                    >
                      {item.receivedQuantity}
                    </p>
                  </div>
                </div>
              </div>
            );
          },
        )}

        {(!itemsWithQuantities || itemsWithQuantities.length === 0) && (
          <div className="flex flex-col items-center justify-center py-12 text-slate-300">
            <Package className="h-12 w-12 mb-2 opacity-20" />
            <p className="text-sm italic">Không có dữ liệu sản phẩm</p>
          </div>
        )}
      </div>
    </>
  );
}

export default ShipmentProductListComponent;

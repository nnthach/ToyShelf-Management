import {
  RefillRequestProductColor,
  Shipment,
  ShipmentAssign,
} from "@/src/types";
import { formatColorNameToVN } from "@/src/utils/format";
import { Package } from "lucide-react";

interface WarehouseShipmentProductListProps {
  shipmentDetail: Shipment | undefined;
  shipmentAssignDetail: ShipmentAssign;
}

function WarehouseShipmentProductList({
  shipmentDetail,
  shipmentAssignDetail,
}: WarehouseShipmentProductListProps) {
  console.log("shipment", shipmentDetail);
  console.log("shipmentAssignDetail", shipmentAssignDetail);

  // 1. Tạo Map để tra cứu nhanh thông tin từ shipmentDetail
  // Sử dụng đúng kiểu dữ liệu RefillRequestProductColor thay vì any
  const shipmentItemMap = new Map<string, RefillRequestProductColor>(
    (shipmentDetail?.items as RefillRequestProductColor[])?.map((item) => [
      item.productColorId as string,
      item,
    ]) || [],
  );

  // 2. Map dữ liệu dựa trên danh sách của Assignment
  const itemsWithQuantities: RefillRequestProductColor[] =
    (shipmentAssignDetail?.items as RefillRequestProductColor[])?.map(
      (item) => {
        // Tra cứu thông tin shipment tương ứng từ Map
        const shipmentItem = shipmentItemMap.get(item.productColorId as string);

        return {
          ...item,
          // Kho giao: Ưu tiên expectedQuantity từ shipment,
          // nếu chưa có shipment thì fallback về fulfilledQuantity từ assign
          displayExpected: shipmentItem
            ? (shipmentItem.expectedQuantity ?? 0)
            : (item.fulfilledQuantity ?? 0),
          // Thực nhận: Lấy từ shipment
          displayReceived: shipmentItem
            ? (shipmentItem.receivedQuantity ?? 0)
            : 0,
        };
      },
    ) || [];

  return (
    <>
      {/* Header */}
      <div className="p-4 border-b bg-white flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <Package className="h-4 w-4 text-primary" />
          <h4 className="font-bold text-sm uppercase">Sản phẩm & Số lượng</h4>
        </div>
        <span className="bg-primary text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
          {itemsWithQuantities.length}
        </span>
      </div>

      {/* Danh sách sản phẩm */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
        {itemsWithQuantities.map((item, index) => {
          const expected = item.displayExpected ?? 0;
          const received = item.displayReceived ?? 0;
          const request = item.quantity ?? 0;

          // Shortfall: Thực nhận < Kho giao (Chỉ khi đã có thông tin shipment)
          const isShortfall = shipmentDetail && received < expected;

          return (
            <div
              key={item.productColorId || index}
              className="bg-white border rounded-xl p-3 shadow-sm hover:shadow-md transition-shadow"
            >
              {/* Header sản phẩm */}
              <div className="flex justify-between items-start mb-3">
                <p className="font-bold text-[13px] uppercase text-slate-800 leading-tight">
                  {item.productName}
                </p>
                <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full border font-bold">
                  {formatColorNameToVN(item?.color || "")}
                </span>
              </div>

              {/* 3 Cột số lượng */}
              <div className="grid grid-cols-3 gap-1 bg-slate-50 rounded-lg p-2 border border-slate-100 relative">
                {/* 1. Yêu cầu (quantity từ assign) */}
                <div className="text-center">
                  <p className="text-[9px] text-muted-foreground uppercase font-bold tracking-tighter">
                    Yêu cầu
                  </p>
                  <p className="font-bold text-lg text-slate-600">{request}</p>
                </div>

                {/* 2. Kho giao (expectedQuantity từ shipment) */}
                <div className="text-center relative">
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[1px] h-8 bg-slate-200"></div>
                  <p className="text-[9px] text-blue-500 uppercase font-bold tracking-tighter">
                    Kho giao
                  </p>
                  <p
                    className={`font-bold text-lg ${expected > 0 ? "text-blue-600" : "text-slate-300"}`}
                  >
                    {expected}
                  </p>
                </div>

                {/* 3. Thực nhận (receivedQuantity từ shipment) */}
                <div className="text-center relative">
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[1px] h-8 bg-slate-200"></div>
                  <p
                    className={`text-[9px] uppercase font-bold tracking-tighter ${isShortfall ? "text-destructive" : "text-green-600"}`}
                  >
                    Thực nhận
                  </p>
                  <p
                    className={`font-bold text-lg ${isShortfall ? "text-destructive" : received > 0 ? "text-green-600" : "text-slate-300"}`}
                  >
                    {received}
                  </p>
                </div>
              </div>
            </div>
          );
        })}

        {itemsWithQuantities.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-slate-300">
            <Package className="h-12 w-12 mb-2 opacity-20" />
            <p className="text-sm italic">Không có dữ liệu sản phẩm</p>
          </div>
        )}
      </div>
    </>
  );
}

export default WarehouseShipmentProductList;

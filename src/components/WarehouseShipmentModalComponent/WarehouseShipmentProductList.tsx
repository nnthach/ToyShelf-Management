import {
  RefillRequestProductColor,
  Shipment,
  ShipmentAssign,
} from "@/src/types";
import { formatColorNameToVN } from "@/src/utils/format";
import { Package } from "lucide-react";
import Image from "next/image";

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
              className="bg-white border rounded-xl p-3 shadow-sm hover:shadow-md transition-all flex items-center gap-4"
            >
              {/* BÊN TRÁI: THÔNG TIN SẢN PHẨM (Chiếm phần lớn diện tích) */}
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="h-12 w-12 rounded-lg border bg-slate-50 flex-shrink-0 overflow-hidden relative shadow-sm">
                  {item?.imageUrl ? (
                    <Image
                      src={item.imageUrl}
                      alt=""
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

                <div className="min-w-0">
                  <h5 className="font-bold text-[13px] uppercase text-slate-800 leading-tight truncate">
                    {item.productName}
                  </h5>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] font-mono text-slate-400 font-medium">
                      {item.sku || "N/A"}
                    </span>
                    <span className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded border border-slate-200 leading-none">
                      {formatColorNameToVN(item?.color as string)}
                    </span>
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

import { Shipment } from "@/src/types";
import { Truck, Package, ArrowRight } from "lucide-react";
import ShipInfoItem from "./ShipInfoItem";
import ShipTimeNode from "./ShipTimeNode";
import EmptySection from "./EmptySection";
import { memo } from "react";
import { formatShipmentStatusText } from "@/src/utils/formatStatus";
import { formatColorNameToVN } from "@/src/utils/format";
import Image from "next/image";

interface ShipmentDetailDamageSectionProps {
  shipmentDetail: Shipment[] | undefined;
}

function ShipmentDetailDamageSection({
  shipmentDetail,
}: ShipmentDetailDamageSectionProps) {
  // Kiểm tra nếu có dữ liệu trong mảng
  const hasShipments = shipmentDetail && shipmentDetail.length > 0;

  return (
    <section className="space-y-4">
      {/* Tiêu đề Section */}
      <div className="flex items-center gap-2 font-bold uppercase text-xs tracking-wider">
        <Truck className="h-4 w-4" /> 3. Vận chuyển & Giao hàng
      </div>

      {hasShipments ? (
        <div className="space-y-6">
          {shipmentDetail.map((shipment, index) => (
            <div
              key={shipment.id || index}
              className="bg-white rounded-xl border border-emerald-100 overflow-hidden shadow-sm"
            >
              {/* Header của từng chuyến giao hàng */}
              <div className="bg-emerald-50/50 px-4 py-2 border-b border-emerald-100 flex justify-between items-center">
                <span className="text-[11px] font-bold text-emerald-700 uppercase flex items-center gap-1">
                  <Package className="h-3 w-3" /> Phiếu giao hàng #{index + 1}
                </span>
                <span className="text-[10px] text-emerald-600/60 font-mono font-bold">
                  {shipment.code}
                </span>
              </div>

              <div className="p-4 space-y-4">
                {/* Thông tin người giao và mã vận đơn */}
                <div className="grid grid-cols-2 gap-4">
                  <ShipInfoItem
                    label="Đơn vị/Người giao"
                    value={shipment.shipperName || "Chưa xác định"}
                    icon={<Truck className="h-3.5 w-3.5" />}
                  />
                  <ShipInfoItem
                    label="Trạng thái"
                    value={formatShipmentStatusText(shipment.status)} // Bạn có thể bọc thêm hàm formatStatus ở đây
                    isStatus
                  />
                </div>

                {/* Lộ trình di chuyển */}
                <div className="flex items-center gap-3 p-3 bg-emerald-50/30 rounded-lg border border-emerald-50 text-[12px]">
                  <div className="flex flex-col flex-1 min-w-0">
                    <span className="text-[10px] text-slate-400 uppercase font-bold">
                      Từ
                    </span>
                    <span className="text-slate-600 truncate font-medium">
                      {shipment.toLocationName}
                    </span>
                  </div>

                  <div className="flex flex-col items-center px-2">
                    <ArrowRight className="h-4 w-4 text-emerald-500" />
                  </div>

                  <div className="flex flex-col flex-1 text-right min-w-0">
                    <span className="text-[10px] text-slate-400 uppercase font-bold">
                      Đến
                    </span>
                    <span className="text-emerald-700 truncate font-bold">
                      {shipment.fromLocationName}
                    </span>
                  </div>
                </div>

                {/* Timeline các mốc thời gian */}
                <div className="grid grid-cols-3 gap-2 pt-2">
                  <ShipTimeNode
                    label="Lấy hàng"
                    time={shipment.returnPickedUpAt}
                  />
                  <ShipTimeNode
                    label="Hàng về kho"
                    time={shipment.arrivedWarehouseAt}
                  />
                  <ShipTimeNode
                    label="Kho xác nhận"
                    time={shipment.warehouseReceivedAt}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptySection message="Chưa có thông tin vận chuyển" />
      )}
    </section>
  );
}

export default memo(ShipmentDetailDamageSection);

import { Shipment } from "@/src/types";
import ShipInfoItem from "./ShipInfoItem";
import { ArrowRight, Package, Truck } from "lucide-react";
import ShipTimeNode from "./ShipTimeNode";
import EmptySection from "./EmptySection";
import { memo } from "react";

interface ShipmentDetailSectionProps {
  shipmentDetail: Shipment | undefined;
}

function ShipmentDetailSection({ shipmentDetail }: ShipmentDetailSectionProps) {
  return (
    <section>
      <div className="flex items-center gap-2 mb-4 text-primary font-bold uppercase text-xs tracking-wider">
        <Truck className="h-4 w-4" /> 3. Vận chuyển & Giao hàng
      </div>
      {shipmentDetail ? (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4 bg-green-50/30 p-4 rounded-xl border border-green-100">
            <ShipInfoItem
              label="Đơn vị/Người giao"
              value={shipmentDetail.shipperName}
              icon={<Truck className="h-3 w-3" />}
            />
            <ShipInfoItem
              label="Mã vận đơn"
              value={shipmentDetail.code}
              icon={<Package className="h-3 w-3" />}
            />
            <div className="col-span-2 flex items-center gap-2 text-sm font-medium py-2 border-y border-green-100 border-dashed">
              <span className="text-muted-foreground">
                {shipmentDetail.fromLocationName}
              </span>
              <ArrowRight className="h-3 w-3 text-green-500" />
              <span className="text-green-700">
                {shipmentDetail.toLocationName}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <ShipTimeNode label="Lấy hàng" time={shipmentDetail.pickedUpAt} />
            <ShipTimeNode label="Giao hàng" time={shipmentDetail.deliveredAt} />
            <ShipTimeNode label="Hoàn tất" time={shipmentDetail.receivedAt} />
          </div>
        </div>
      ) : (
        <EmptySection message="Chưa có thông tin vận chuyển" />
      )}
    </section>
  );
}

export default memo(ShipmentDetailSection);

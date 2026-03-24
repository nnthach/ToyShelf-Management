import { Shipment } from "@/src/types";
import { ArrowRight, Package, Truck, UserCheck } from "lucide-react";
import ShipInfoItem from "../ShipmentComponent/ShipInfoItem";
import ShipTimeNode from "../ShipmentComponent/ShipTimeNode";

interface WarehouseShipmentDetailSectionProps {
  shipmentDetail: Shipment;
}

function WarehouseShipmentDetailSection({
  shipmentDetail,
}: WarehouseShipmentDetailSectionProps) {
  return (
    <section>
      <div className="flex items-center gap-2 mb-4 text-primary font-bold uppercase text-xs tracking-wider">
        <Truck className="h-4 w-4" /> 2. Lộ trình vận chuyển thực tế
      </div>
      {shipmentDetail ? (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4 bg-green-50/30 p-4 rounded-xl border border-green-100">
            <ShipInfoItem
              label="Mã vận đơn"
              value={shipmentDetail.code || "Đang khởi tạo"}
              icon={<Package className="h-3 w-3" />}
            />
            <ShipInfoItem
              label="Shipper thực tế"
              value={shipmentDetail.shipperName}
              icon={<UserCheck className="h-3 w-3" />}
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
          {/* Time nodes */}
          <div className="grid grid-cols-3 gap-2">
            <ShipTimeNode label="Lấy hàng" time={shipmentDetail.pickedUpAt} />
            <ShipTimeNode label="Giao hàng" time={shipmentDetail.deliveredAt} />
            <ShipTimeNode label="Hoàn tất" time={shipmentDetail.receivedAt} />
          </div>
        </div>
      ) : (
        <div className="h-32 flex flex-col items-center justify-center border-2 border-dashed rounded-xl text-muted-foreground bg-slate-50/50">
          <Truck className="h-8 w-8 mb-2 opacity-20" />
          <p className="text-xs italic">
            Thông tin vận chuyển sẽ hiển thị sau khi yêu cầu được duyệt
          </p>
        </div>
      )}
    </section>
  );
}

export default WarehouseShipmentDetailSection;

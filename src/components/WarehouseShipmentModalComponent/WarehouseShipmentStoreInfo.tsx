import {
  Calendar,
  Store,
  Truck,
  User,
  UserCheck,
  Warehouse,
} from "lucide-react";
import ShipInfoItem from "../ShipmentComponent/ShipInfoItem";
import { ShipmentAssign } from "@/src/types";
import ShipTimeNode from "../ShipmentComponent/ShipTimeNode";
import { formatDateTime } from "@/src/utils/format";

interface WarehouseShipmentStoreInfoProps {
  shipmentAssignDetail: ShipmentAssign;
}
function WarehouseShipmentStoreInfo({
  shipmentAssignDetail,
}: WarehouseShipmentStoreInfoProps) {
  return (
    <section>
      <div className="flex items-center gap-2 mb-4 text-primary font-bold uppercase text-xs tracking-wider">
        <Warehouse className="h-4 w-4" /> 1. Điều phối & Kho hàng
      </div>
      {shipmentAssignDetail ? (
        <div className="grid grid-cols-2 gap-4 bg-blue-50/30 p-4 rounded-xl border border-blue-100">
          <ShipInfoItem
            label="Quản trị viên"
            value={shipmentAssignDetail.createdByName}
            icon={<User className="h-3 w-3" />}
          />
          <ShipInfoItem
            label="Kho xuất hàng"
            value={shipmentAssignDetail.warehouseLocationName}
            icon={<Warehouse className="h-3 w-3" />}
          />
          <ShipInfoItem
            label="Người điều phối"
            value={shipmentAssignDetail.assignedByName || "Chưa có"}
            icon={<UserCheck className="h-3 w-3" />}
          />
          <ShipInfoItem
            label="Nhân viên giao hàng"
            value={shipmentAssignDetail.shipperName || "Chưa có"}
            icon={<Truck className="h-3 w-3" />}
          />
          <ShipInfoItem
            label="Cửa hàng nhận"
            value={shipmentAssignDetail.storeLocationName}
            icon={<Store className="h-3 w-3" />}
          />
          <ShipInfoItem
            label="Ngày tạo"
            value={formatDateTime(shipmentAssignDetail.createdAt).full}
            icon={<Calendar className="h-3 w-3" />}
          />
        </div>
      ) : (
        <div className="h-24 flex items-center justify-center border border-dashed rounded-xl text-muted-foreground italic text-sm">
          Đang tải dữ liệu điều phối...
        </div>
      )}
    </section>
  );
}

export default WarehouseShipmentStoreInfo;

import { ShipmentAssign } from "@/src/types";
import { Calendar, UserCheck, Warehouse } from "lucide-react";
import ShipInfoItem from "./ShipInfoItem";
import { formatShipmentAssignStatusText } from "@/src/utils/formatStatus";
import { formatDateTime } from "@/src/utils/format";
import EmptySection from "./EmptySection";
import { memo } from "react";

interface ShipmentAssignDetailSectionProps {
  shipmentAssignDetail: ShipmentAssign | undefined;
}

function ShipmentAssignDetailSection({
  shipmentAssignDetail,
}: ShipmentAssignDetailSectionProps) {
  return (
    <section>
      <div className="flex items-center gap-2 mb-4 text-primary font-bold uppercase text-xs tracking-wider">
        <Warehouse className="h-4 w-4" /> 2. Điều phối & Kho hàng
      </div>
      {shipmentAssignDetail ? (
        <div className="grid grid-cols-2 gap-4 bg-blue-50/30 p-4 rounded-xl border border-blue-100">
          <ShipInfoItem
            label="Quản trị viên duyệt đơn"
            value={shipmentAssignDetail.createdByName}
            icon={<Warehouse className="h-3 w-3" />}
          />
          <ShipInfoItem
            label="Kho xuất hàng"
            value={shipmentAssignDetail.warehouseLocationName}
            icon={<Warehouse className="h-3 w-3" />}
          />
          <ShipInfoItem
            label="Người điều phối"
            value={shipmentAssignDetail.assignedByName}
            icon={<UserCheck className="h-3 w-3" />}
          />
          <ShipInfoItem
            label="Nhân viên giao hàng"
            value={shipmentAssignDetail.shipperName}
            icon={<UserCheck className="h-3 w-3" />}
          />
          <ShipInfoItem
            label="Trạng thái từ kho"
            value={formatShipmentAssignStatusText(shipmentAssignDetail.status)}
            isStatus
          />
          <ShipInfoItem
            label="Ngày phản hồi"
            value={formatDateTime(shipmentAssignDetail.respondedAt).full}
            icon={<Calendar className="h-3 w-3" />}
          />
        </div>
      ) : (
        <EmptySection message="Chưa được điều phối kho hàng" />
      )}
    </section>
  );
}

export default memo(ShipmentAssignDetailSection);

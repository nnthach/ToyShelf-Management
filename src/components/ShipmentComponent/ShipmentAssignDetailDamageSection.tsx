import { ShipmentAssign } from "@/src/types";
import {
  Calendar,
  ClipboardList,
  Package,
  UserCheck,
  Warehouse,
} from "lucide-react";
import ShipInfoItem from "./ShipInfoItem";
import { formatShipmentAssignStatusText } from "@/src/utils/formatStatus";
import { formatDateTime } from "@/src/utils/format";
import EmptySection from "./EmptySection";
import { memo } from "react";

interface ShipmentAssignDetailDamageSectionProps {
  shipmentAssignments: ShipmentAssign[] | [];
  isLoading: boolean;
}

function ShipmentAssignDetailDamageSection({
  shipmentAssignments,
  isLoading,
}: ShipmentAssignDetailDamageSectionProps) {
  const hasData = shipmentAssignments && shipmentAssignments.length > 0;
  return (
    <section>
      <div className="flex items-center gap-2 mb-4 text-primary font-bold uppercase text-xs tracking-wider">
        <Warehouse className="h-4 w-4" /> 2. Điều phối & Kho hàng
      </div>
      {isLoading ? (
        <div className="p-12 text-center text-slate-400 text-sm bg-slate-50 rounded-xl border border-dashed border-slate-200">
          Đang tải dữ liệu...
        </div>
      ) : hasData ? (
        <div className="space-y-4">
          {shipmentAssignments.map((assignment, index) => (
            <div
              key={assignment.id || index}
              className="bg-white rounded-xl border border-blue-100 overflow-hidden shadow-sm"
            >
              {/* Header nhỏ để phân biệt các phiếu nếu có nhiều kho */}
              <div className="bg-blue-50/50 px-4 py-2 border-b border-blue-100 flex justify-between items-center">
                <span className="text-[11px] font-bold text-blue-600 uppercase flex items-center gap-1">
                  <ClipboardList className="h-3 w-3" /> Phiếu điều phối #
                  {index + 1}
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  ID: {assignment.id?.slice(-8).toUpperCase()}
                </span>
              </div>

              {/*Thông tin kho */}
              <div className="grid grid-cols-2 gap-4 p-4">
                <ShipInfoItem
                  label="Quản trị viên duyệt đơn"
                  value={assignment.createdByName}
                  icon={<UserCheck className="h-3 w-3" />}
                />
                <ShipInfoItem
                  label="Kho thực hiện"
                  value={assignment.warehouseLocationName}
                  icon={<Warehouse className="h-3 w-3" />}
                />
                <ShipInfoItem
                  label="Quản lý kho điều phối"
                  value={assignment.assignedByName}
                  icon={<UserCheck className="h-3 w-3" />}
                />
                <ShipInfoItem
                  label="Nhân viên giao hàng"
                  value={assignment.shipperName}
                  icon={<UserCheck className="h-3 w-3" />}
                />
                <ShipInfoItem
                  label="Trạng thái từ kho"
                  value={formatShipmentAssignStatusText(assignment.status)}
                  isStatus
                />
                <ShipInfoItem
                  label="Ngày phản hồi"
                  value={
                    assignment.respondedAt
                      ? formatDateTime(assignment.respondedAt).full
                      : "---"
                  }
                  icon={<Calendar className="h-3 w-3" />}
                />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptySection message="Chưa được điều phối kho hàng" />
      )}
    </section>
  );
}

export default memo(ShipmentAssignDetailDamageSection);

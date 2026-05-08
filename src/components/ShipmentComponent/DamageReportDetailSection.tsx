import { DamageReport, RefillRequest } from "@/src/types";
import {
  AlertCircle,
  Clock,
  FileText,
  Layers,
  MapPin,
  Notebook,
  Store,
  Tag,
  User,
  UserCheck,
} from "lucide-react";
import ShipInfoItem from "./ShipInfoItem";
import { memo } from "react";
import { formatDateTime, formatSourceDamageReport } from "@/src/utils/format";

interface DamageReportDetailSectionProps {
  damageReportDetail: DamageReport | undefined;
}

function DamageReportDetailSection({
  damageReportDetail,
}: DamageReportDetailSectionProps) {
  return (
    <section className="space-y-4">
      {/* Header Section */}
      <div className="flex items-center gap-2 mb-4 text-primary font-bold uppercase text-xs tracking-wider">
        <Store className="h-4 w-4" /> 1. Thông tin yêu cầu từ cửa hàng
      </div>

      <div className="bg-muted/20 p-4 rounded-xl border border-dashed space-y-4">
        {/* Nhóm 1: Store & Reporter (Background nhẹ) */}
        <div className="grid grid-cols-2 gap-4">
          <ShipInfoItem
            label="Cửa hàng"
            value={damageReportDetail?.storeName}
            icon={<Store className="h-3.5 w-3.5" />}
          />
          <ShipInfoItem
            label="Người yêu cầu"
            value={damageReportDetail?.reportedByName}
            icon={<User className="h-3.5 w-3.5" />}
          />
          <div className="col-span-2">
            <ShipInfoItem
              label="Địa chỉ nhận hàng"
              value={damageReportDetail?.storeAddress}
              icon={<MapPin className="h-3.5 w-3.5 text-slate-400" />}
            />
          </div>
        </div>

        {/* Nhóm 2: Chi tiết đơn hàng */}
        <div className="grid grid-cols-2 gap-x-4 gap-y-5">
          <ShipInfoItem
            label="Loại hàng"
            value={
              <span className="font-bold text-slate-700">
                {damageReportDetail?.type === "Product"
                  ? "Sản phẩm"
                  : damageReportDetail?.type === "Shelf"
                    ? "Kệ"
                    : "Hỗn hợp"}
              </span>
            }
            icon={<Layers className="h-3.5 w-3.5 text-slate-400" />}
          />

          <div className="col-span-2">
            <ShipInfoItem
              label="Nguyên nhân hư hỏng"
              value={
                <div className="rounded-lg text-orange-700 font-bold">
                  {formatSourceDamageReport(damageReportDetail?.source || "")}
                </div>
              }
              icon={<AlertCircle className="h-3.5 w-3.5" />}
            />
          </div>

          {damageReportDetail?.description && (
            <div className="col-span-2">
              <ShipInfoItem
                label="Ghi chú từ cửa hàng"
                value={
                  <p className="text-slate-600">
                    {damageReportDetail?.description}
                  </p>
                }
                icon={<FileText className="h-3.5 w-3.5 text-slate-400" />}
              />
            </div>
          )}

          <ShipInfoItem
            label="Đối tác chấp nhận"
            value={damageReportDetail?.partnerAdminName}
            icon={<User className="h-3 w-3" />}
          />
          <ShipInfoItem
            label="Thời gian duyệt"
            value={
              formatDateTime(damageReportDetail?.partnerAdminApprovedAt || "")
                .full || ""
            }
            icon={<Clock className="h-3.5 w-3.5" />}
          />
        </div>

        {/* Nhóm 3: Admin Review */}
        <div className="grid grid-cols-2 gap-x-4 gap-y-5">
          <ShipInfoItem
            label={
              damageReportDetail?.status === "Rejected"
                ? "Quản trị viên từ chối"
                : "Quản trị viên chấp nhận"
            }
            value={damageReportDetail?.reviewedByName || "Chưa xem xét"}
            icon={<UserCheck className={`h-3.5 w-3.5`} />}
          />
          <ShipInfoItem
            label="Thời gian duyệt"
            value={
              formatDateTime(damageReportDetail?.reviewedAt || "").full || ""
            }
            icon={<Clock className="h-3.5 w-3.5" />}
          />
          {damageReportDetail?.status === "Rejected" && (
            <ShipInfoItem
              label="Lý do từ chối"
              value={
                <span className="text-red-600 font-medium">
                  {damageReportDetail?.adminNote}
                </span>
              }
              icon={<Notebook className="h-3.5 w-3.5 text-red-500" />}
            />
          )}
        </div>
      </div>
    </section>
  );
}

export default memo(DamageReportDetailSection);

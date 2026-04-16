import { DamageReport, RefillRequest } from "@/src/types";
import {
  AlertCircle,
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
import { formatSourceDamageReport } from "@/src/utils/format";

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
            icon={<Store className="h-3.5 w-3.5 text-blue-500" />}
          />
          <ShipInfoItem
            label="Người yêu cầu"
            value={damageReportDetail?.reportedByName}
            icon={<User className="h-3.5 w-3.5 text-indigo-500" />}
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
            label="Loại đơn"
            value={
              <span
                className={`font-bold ${damageReportDetail?.isWarrantyClaim ? "text-orange-600" : "text-blue-600"}`}
              >
                {damageReportDetail?.isWarrantyClaim ? "Trả hàng" : "Bảo hành"}
              </span>
            }
            icon={<Tag className="h-3.5 w-3.5 text-slate-400" />}
          />
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
              icon={<AlertCircle className="h-3.5 w-3.5 text-orange-500" />}
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
            icon={
              <UserCheck
                className={`h-3.5 w-3.5 ${damageReportDetail?.status === "Rejected" ? "text-red-500" : "text-emerald-500"}`}
              />
            }
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

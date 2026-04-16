import { DamageReport, RefillRequest } from "@/src/types";
import {
  FileText,
  Layers,
  MapPin,
  Notebook,
  Store,
  Tag,
  User,
} from "lucide-react";
import ShipInfoItem from "./ShipInfoItem";
import { memo } from "react";

interface DamageReportDetailSectionProps {
  damageReportDetail: DamageReport | undefined;
}

function DamageReportDetailSection({
  damageReportDetail,
}: DamageReportDetailSectionProps) {
  return (
    <section>
      <div className="flex items-center gap-2 mb-4 text-primary font-bold uppercase text-xs tracking-wider">
        <Store className="h-4 w-4" /> 1. Thông tin yêu cầu từ cửa hàng
      </div>
      <div className="grid grid-cols-2 gap-4 bg-muted/20 p-4 rounded-xl border border-dashed">
        <ShipInfoItem
          label="Cửa hàng"
          value={damageReportDetail?.storeName}
          icon={<Store className="h-3 w-3" />}
        />
        <ShipInfoItem
          label="Người yêu cầu"
          value={damageReportDetail?.reportedByName}
          icon={<User className="h-3 w-3" />}
        />

        <div className="col-span-2">
          <ShipInfoItem
            label="Địa chỉ nhận hàng"
            value={damageReportDetail?.storeAddress}
            icon={<MapPin className="h-3 w-3" />}
          />
        </div>
        <ShipInfoItem
          label="Loại đơn"
          value={damageReportDetail?.isWarrantyClaim ? "Trả hàng" : "Bảo hành"}
          icon={<Tag className="h-3 w-3" />}
        />
        <ShipInfoItem
          label="Loại hàng"
          value={
            damageReportDetail?.type === "Product"
              ? "Sản phẩm"
              : damageReportDetail?.type === "Shelf"
                ? "Kệ"
                : "Hỗn hợp"
          }
          icon={<Layers className="h-3 w-3" />}
        />
        {damageReportDetail?.status === "Rejected" ? (
          <>
            <ShipInfoItem
              label="Quản trị viên từ chối"
              value={damageReportDetail?.reviewedByName}
              icon={<User className="h-3 w-3" />}
            />
            <ShipInfoItem
              label="Ghi chú"
              value={damageReportDetail?.adminNote}
              icon={<Notebook className="h-3 w-3" />}
            />
          </>
        ) : (
          <ShipInfoItem
            label="Quản trị viên chấp nhận"
            value={damageReportDetail?.reviewedByName}
            icon={<User className="h-3 w-3" />}
          />
        )}
        {damageReportDetail?.description && (
          <div className="col-span-2">
            <ShipInfoItem
              label="Ghi chú từ cửa hàng"
              value={damageReportDetail?.description}
              icon={<FileText className="h-3 w-3" />}
            />
          </div>
        )}
      </div>
    </section>
  );
}

export default memo(DamageReportDetailSection);

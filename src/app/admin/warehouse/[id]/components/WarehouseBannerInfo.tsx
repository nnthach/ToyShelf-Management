import { getAllWarehouseStaffAPI } from "@/src/services/user.service";
import { Button } from "@/src/styles/components/ui/button";
import { User, Warehouse, WarehouseStaff } from "@/src/types";
import { formatWarehouseRoleToVN } from "@/src/utils/format";
import { useQuery } from "@tanstack/react-query";
import {
  Building,
  Hash,
  MapPin,
  Pencil,
  Sparkles,
  Target,
  UserCircle,
  Warehouse as WarehouseIcon,
} from "lucide-react";
import { memo } from "react";
import UpdateWarehouseModal from "../../components/UpdateWarehouseModal";

type WarehouseBannerInfoProps = {
  warehouseDetail: {
    warehouse: Warehouse;
    users: User[];
  };
};

function WarehouseBannerInfo({ warehouseDetail }: WarehouseBannerInfoProps) {
  const { data: warehouseStaffList } = useQuery({
    queryKey: [
      "warehouseStaffs",
      { warehouseId: warehouseDetail?.warehouse?.id },
    ],
    queryFn: () =>
      getAllWarehouseStaffAPI({ warehouseId: warehouseDetail?.warehouse?.id }),
    select: (res) => res.data,
    enabled: !!warehouseDetail?.warehouse?.id,
  });
  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
      {/* A. LEFT: Store Info - Compact Deep Gradient Section */}
      <div className="col-span-1 md:col-span-8">
        <div className="relative group p-5 rounded-xl bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 shadow-xl overflow-hidden transition-all border border-white/5">
          <div className="absolute inset-0 opacity-[0.03] bg-[url('/bg-patterns/abstract-01.png')] bg-cover" />
          <Sparkles className="absolute -top-4 -right-4 h-24 w-24 text-blue-400 opacity-10 rotate-12" />

          <div className="flex justify-between items-center mb-2 relative">
            <h2 className="text-sm font-bold flex items-center gap-2 uppercase tracking-widest text-blue-200/80">
              <Building size={16} /> Chi tiết kho hàng
            </h2>
            <UpdateWarehouseModal warehouse={warehouseDetail?.warehouse} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 relative">
            <InfoItem
              icon={WarehouseIcon}
              label="Tên kho"
              value={warehouseDetail?.warehouse?.name || "N/A"}
            />
            <InfoItem
              icon={UserCircle}
              label="Người quản lý"
              value={warehouseDetail?.users[0]?.fullName || "N/A"}
            />
            <InfoItem
              icon={Hash}
              label="Mã kho"
              value={warehouseDetail?.warehouse?.code || "N/A"}
              isMonospace
            />
            <InfoItem
              icon={MapPin}
              label="Khu vực"
              value={warehouseDetail?.warehouse?.cityName}
            />

            <div className="col-span-1 sm:col-span-2 flex items-center gap-3 p-3 rounded-lg bg-white/[0.03] border border-white/5 hover:bg-white/[0.06] transition-all mt-1">
              <MapPin className="h-4 w-4 text-blue-400 shrink-0" />
              <div className="flex-1">
                <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                  Địa chỉ chi tiết
                </p>
                <p className="text-sm font-medium text-slate-200">
                  {warehouseDetail?.warehouse?.address}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* B. RIGHT: Store Staff - Compact Section */}
      <div className="col-span-4">
        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-md p-3 h-full flex flex-col gap-3 border border-slate-100 dark:border-slate-800">
          <h2 className="text-sm font-bold flex items-center gap-2 border-b border-slate-50 dark:border-slate-800 pb-3 mb-1 text-slate-500 uppercase tracking-tighter">
            <Target size={14} className="text-amber-500" /> Nhân viên (
            {warehouseStaffList?.length || 0})
          </h2>

          <div className="flex flex-col gap-2 flex-1 overflow-y-auto max-h-[180px] custom-scrollbar">
            {warehouseStaffList?.map((staff: WarehouseStaff) => (
              <div
                key={staff?.userId}
                className="flex items-center gap-2.5 p-2 rounded-lg border border-transparent hover:border-slate-100 dark:hover:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all group"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-slate-700 dark:text-slate-200 group-hover:text-blue-600">
                    {staff.fullName}
                  </p>
                  <p className="text-[12px] text-slate-600 truncate">
                    {staff.email}
                  </p>
                </div>

                <span
                  className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                    staff.warehouseRole === "Manager"
                      ? "bg-amber-100/50 text-amber-700 border border-amber-200/50"
                      : "bg-slate-100 text-slate-500"
                  }`}
                >
                  {formatWarehouseRoleToVN(staff.warehouseRole)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoItem({
  icon: Icon,
  label,
  value,
  isMonospace,
}: {
  icon: React.ElementType;
  label: string;
  value?: string;
  isMonospace?: boolean;
}) {
  return (
    <div className="flex items-start gap-2 p-2 rounded-xl hover:bg-white/10 transition-colors">
      <Icon className="h-5 w-5 text-blue-100 mt-1 shrink-0" />
      <div>
        <p className="text-xs uppercase font-bold text-blue-200 tracking-wider">
          {label}
        </p>
        <p
          className={`text-sm font-medium text-white capitalize ${isMonospace ? "font-mono" : ""}`}
        >
          {value || "---"}
        </p>
      </div>
    </div>
  );
}

export default memo(WarehouseBannerInfo);

import { useAuth } from "@/src/hooks/useAuth";
import { getAllStoreStaffAPI } from "@/src/services/user.service";
import { Store, StoreStaff } from "@/src/types";
import { formatStoreRoleToVN } from "@/src/utils/format";
import { useQuery } from "@tanstack/react-query";
import { MapPin, Server, Store as StoreIcon, Target } from "lucide-react";
import Image from "next/image";

function BannerInfo({ storeDetail }: { storeDetail: Store }) {
  const { user, myStore } = useAuth();

  const { data: storeStaffList } = useQuery({
    queryKey: ["storeStaffs", { storeId: myStore?.storeId }],
    queryFn: () => getAllStoreStaffAPI({ storeId: myStore?.storeId }),
    select: (res) => res.data,
    enabled: !!myStore?.storeId,
  });

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4">
      <div className="relative rounded-xl overflow-hidden shadow-lg col-span-1 lg:col-span-8 min-h-[180px] flex items-center">
        {/* Background image với overlay chuyên nghiệp hơn */}
        <Image
          src="/images/banner_admin_hello.jpg"
          alt="Manager Banner"
          fill
          className="object-cover"
        />

        {/* Gradient overlay: Chỉnh lại để bên phải vẫn có một lớp phủ mờ bảo vệ chữ */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/95 via-slate-900/70 to-slate-900/30"></div>

        {/* Content */}
        <div className="relative px-8 py-6 text-white w-full flex justify-between items-center">
          <div className="space-y-3">
            {/* Lời chào & Tên Manager */}
            <h2 className="text-2xl font-bold tracking-wide">
              Xin chào, {user?.fullName}
            </h2>

            <div className="flex flex-wrap items-center gap-3">
              {/* Email */}
              <span className="text-sm text-white italic">{user?.email}</span>
            </div>

            {/* Tên Cửa hàng & Địa chỉ */}
            <div className="flex flex-col md:flex-row gap-6 pt-2 border-t border-white/10">
              {/* Cụm Tên Cửa hàng */}
              <div className="flex items-start gap-3">
                <div className="p-1.5 bg-blue-500/20 rounded-md mt-1">
                  <StoreIcon size={16} className="text-blue-300" />
                </div>
                <div>
                  <p className="text-[10px] text-white/50 uppercase font-bold tracking-wider">
                    Cửa hàng đang quản lý
                  </p>
                  <p className="text-base font-semibold text-blue-50">
                    {storeDetail?.name || "Chưa xác định"}
                  </p>
                </div>
              </div>

              {/* Cụm Địa chỉ */}
              <div className="flex items-start gap-3 border-white/10 md:border-l md:pl-6">
                <div className="p-1.5 bg-blue-500/20 rounded-md mt-1">
                  <MapPin size={16} className="text-blue-300" />
                </div>
                <div className="max-w-[300px]">
                  {" "}
                  {/* Giới hạn chiều ngang để không bị quá dài */}
                  <p className="text-[10px] text-white/50 uppercase font-bold tracking-wider">
                    Địa chỉ
                  </p>
                  <p className="text-sm font-semibold text-blue-50">
                    {storeDetail?.storeAddress || "N/A"}
                  </p>
                </div>
              </div>

              {/* Cụm Giới hạn kệ */}
              <div className="flex items-start gap-3 border-white/20 md:border-l md:pl-6">
                {/* Icon container: Tăng độ sáng icon và thêm hiệu ứng kính mờ */}
                <div className="p-1.5 bg-blue-400/20 backdrop-blur-md rounded-md mt-1 border border-white/10 shadow-lg">
                  <Server size={15} className="text-blue-300" />
                </div>

                <div>
                  <p className="text-[10px] text-white/70 uppercase font-extrabold tracking-widest drop-shadow-md">
                    Giới hạn kệ
                  </p>
                  <div className="flex items-baseline gap-1">
                    {/* text-blue-50 sẽ nổi hơn text-white thuần trên nền sáng */}
                    <p className="text-sm font-semibold text-white drop-shadow-lg">
                      {storeDetail?.maxShelvesPerStore || 0}
                    </p>
                    <span className="text-[10px] text-blue-100/80 font-bold uppercase">
                      kệ
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/*Trang trí */}
      <div className="col-span-1 lg:col-span-4">
        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-md p-3 h-full flex flex-col gap-3 border border-slate-100 dark:border-slate-800">
          <h2 className="text-sm font-bold flex items-center gap-2 border-b border-slate-50 dark:border-slate-800 pb-3 mb-1 text-slate-500 uppercase tracking-tighter">
            <Target size={14} className="text-amber-500" /> Nhân viên (
            {storeStaffList?.length || 0})
          </h2>

          <div className="flex flex-col gap-2 flex-1 overflow-y-auto max-h-[180px] custom-scrollbar">
            {storeStaffList?.map((staff: StoreStaff) => (
              <div
                key={staff.userId}
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
                    staff.storeRole === "Manager"
                      ? "bg-amber-100/50 text-amber-700 border border-amber-200/50"
                      : "bg-slate-100 text-slate-500"
                  }`}
                >
                  {formatStoreRoleToVN(staff.storeRole)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default BannerInfo;

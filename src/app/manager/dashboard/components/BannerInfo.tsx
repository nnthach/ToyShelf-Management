import { useAuth } from "@/src/hooks/useAuth";
import { getAllStoreStaffAPI } from "@/src/services/user.service";
import { StoreStaff } from "@/src/types";
import { formatStoreRoleToVN } from "@/src/utils/format";
import { useQuery } from "@tanstack/react-query";
import { Target } from "lucide-react";
import Image from "next/image";

function BannerInfo() {
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

        {/* Gradient overlay: Chuyển từ Indigo sang Blue để tạo cảm giác quản lý tin cậy */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-blue-900/80 to-transparent"></div>

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

            {/* Tên Cửa hàng đang quản lý */}
            <div className="flex items-center gap-2 pt-2">
              <div>
                <p className="text-xs text-white/50 uppercase font-bold">
                  Cửa hàng đang quản lý
                </p>
                <p className="text-lg font-semibold text-blue-100">
                  {myStore?.storeName || "Chưa xác định cửa hàng"}
                </p>
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

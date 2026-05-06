import { getDashboardTopStoreAPI } from "@/src/services/dashboard.service";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { MapPin, Store } from "lucide-react";
import { getAllPartnerAPI } from "@/src/services/partner.service";
import { Partner } from "@/src/types";

interface Store {
  storeId: string;
  storeName: string;
  city: string;
  partnerName: string;
  totalRevenue: number;
  totalOrders: number;
}

function TopStore() {
  const getPreviousMonth = () => {
    const now = new Date();
    now.setMonth(now.getMonth() - 1);
    return {
      month: String(now.getMonth() + 1),
      year: String(now.getFullYear()),
      partnerId: "",
    };
  };

  const [query, setQuery] = useState(getPreviousMonth());

  const { data: topStores } = useQuery({
    queryKey: ["topStores", query],
    queryFn: () => getDashboardTopStoreAPI(query),
    select: (res) => res.data as Store[],
  });

  const { data: partnerList } = useQuery({
    queryKey: ["partnerList"],
    queryFn: () => getAllPartnerAPI({}),
    select: (res) => res.data as Partner[],
  });

  const updateQuery = (val: Partial<typeof query>) => {
    setQuery((prev) => ({ ...prev, ...val }));
  };

  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const years = Array.from({ length: 10 }, (_, i) => 2020 + i);

  return (
    <div className="mt-8 space-y-4">
      {/* Filter Section - Tối giản, không background */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <select
            value={query.month}
            onChange={(e) => updateQuery({ month: e.target.value })}
            className="bg-gray-100 text-sm font-medium rounded-md px-2 py-1 outline-none"
          >
            <option value="">Tháng</option>
            {months.map((m) => (
              <option key={m} value={m}>
                Tháng {m}
              </option>
            ))}
          </select>

          <select
            value={query.year}
            onChange={(e) => updateQuery({ year: e.target.value })}
            className="bg-gray-100 text-sm font-medium rounded-md px-2 py-1 outline-none"
          >
            <option value="">Năm</option>
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
          <select
            value={query.partnerId}
            onChange={(e) => updateQuery({ partnerId: e.target.value })}
            className="bg-gray-100 text-sm font-medium rounded-md px-2 py-1 outline-none"
          >
            <option value="">Đối tác</option>
            {partnerList?.map((y) => (
              <option key={y.id} value={y.id}>
                {y.companyName}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-2">
        {topStores?.slice(0, 3).map((store, index) => (
          <div
            key={store.storeId}
            className={`
          group cursor-pointer relative p-3 flex flex-col gap-4 rounded-lg border transition-all hover:shadow-xl hover:-translate-y-1
          ${
            index === 0
              ? "bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200 shadow-yellow-100/50"
              : index === 1
                ? "bg-gradient-to-br from-slate-50 to-blue-50 border-slate-200 shadow-slate-100/50"
                : "bg-gradient-to-br from-orange-50 to-red-50 border-orange-200 shadow-orange-100/50"
          }
        `}
          >
            <div
              className={`
          absolute -top-3 -right-3 w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg text-white font-black text-lg
          ${index === 0 ? "bg-yellow-400" : index === 1 ? "bg-slate-400" : "bg-orange-400"}
        `}
            >
              {index + 1}
            </div>

            <div className="flex items-center gap-4">
              {/* Avatar với hiệu ứng mới */}
              <div className="relative shrink-0">
                <div className="w-16 h-16 rounded-2xl border-2 border-white bg-white shadow-sm flex items-center justify-center overflow-hidden transition-transform group-hover:scale-105">
                  <Store
                    size={32}
                    className={`${index === 0 ? "text-yellow-500" : "text-slate-400"}`}
                  />
                </div>
              </div>

              {/* Tên cửa hàng & Thông tin */}
              <div className="min-w-0 flex-1">
                <h4 className="text-[16px] font-bold text-slate-900 truncate group-hover:text-blue-600 transition-colors">
                  {store.storeName}
                </h4>
                <div className="flex flex-col gap-0.5">
                  <div className="flex items-center gap-1.5 text-slate-500">
                    <MapPin size={12} className="opacity-70" />
                    <span className="text-[13px] font-medium truncate">
                      {store.city}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-400">
                    <Store size={12} className="opacity-70" />
                    <span className="text-[12px] truncate">
                      {store.partnerName}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer chứa Doanh thu & Đơn hàng */}
            <div className="grid grid-cols-2 gap-2 mt-2 pt-4 border-t border-dashed border-slate-200">
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Doanh thu
                </span>
                <div className="flex items-center gap-1">
                  <span className="text-[14px] font-bold text-slate-900">
                    {store.totalRevenue.toLocaleString()}đ
                  </span>
                </div>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Đơn hàng
                </span>
                <div className="flex items-center gap-1">
                  <span className="text-[14px] font-bold text-blue-600">
                    {store.totalOrders.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TopStore;

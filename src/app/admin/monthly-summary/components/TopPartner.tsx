import { getDashboardTopPartnerAPI } from "@/src/services/dashboard.service";
import { formatPartnerTierTextColor } from "@/src/utils/formatStatus";
import { useQuery } from "@tanstack/react-query";
import { Mail, User } from "lucide-react";
import { useState } from "react";

interface Partner {
  partnerId: string;
  companyName: string;
  email: string;
  contactName: string;
  totalRevenue: number;
  totalCommission: number;
  tier: string;
}
function TopPartner() {
  const getPreviousMonth = () => {
    const now = new Date();
    now.setMonth(now.getMonth() - 1);

    return {
      month: String(now.getMonth() + 1),
      year: String(now.getFullYear()),
    };
  };

  const [queryTopPartners, setQueryTopPartners] = useState(() =>
    getPreviousMonth(),
  );

  const updateQueryTopPartners = (val: Partial<typeof queryTopPartners>) => {
    setQueryTopPartners((prev) => ({ ...prev, ...val }));
  };

  const { data: topPartners } = useQuery({
    queryKey: ["topPartners", queryTopPartners],
    queryFn: () => getDashboardTopPartnerAPI(queryTopPartners),
    select: (res) => res.data as Partner[],
  });

  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const years = Array.from({ length: 10 }, (_, i) => 2020 + i);

  return (
    <div className="mt-8 space-y-4">
      {/* Filter Section - Tối giản, không background */}
      <div className="flex flex-row items-center gap-4">
        <h2 className="text-xl font-bold text-slate-800 tracking-tight">
          Xếp hạng đối tác
        </h2>
        <div className="flex items-center gap-3">
          <select
            value={queryTopPartners.month}
            onChange={(e) => updateQueryTopPartners({ month: e.target.value })}
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
            value={queryTopPartners.year}
            onChange={(e) => updateQueryTopPartners({ year: e.target.value })}
            className="bg-gray-100 text-sm font-medium rounded-md px-2 py-1 outline-none"
          >
            <option value="">Năm</option>
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-2">
        {topPartners?.slice(0, 3).map((partner, index) => (
          <div
            key={partner.partnerId}
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
                  <span
                    className={`text-2xl font-black ${index === 0 ? "text-yellow-500" : "text-slate-400"}`}
                  >
                    {partner.contactName.charAt(0)}
                  </span>
                </div>
                <div
                  className={`absolute -bottom-1 -right-1 px-2 py-0.5 rounded-lg border text-[9px] font-black uppercase tracking-tighter shadow-sm ${formatPartnerTierTextColor(partner.tier)}`}
                >
                  {partner.tier}
                </div>
              </div>

              {/* Tên công ty & Thông tin liên hệ */}
              <div className="min-w-0 flex-1">
                <h4 className="text-[16px] font-bold text-slate-900 truncate group-hover:text-blue-600 transition-colors">
                  {partner.companyName}
                </h4>
                <div className="flex flex-col gap-0.5">
                  <div className="flex items-center gap-1.5 text-slate-500">
                    <User size={12} className="opacity-70" />
                    <span className="text-[13px] font-medium truncate">
                      {partner.contactName}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-400">
                    <Mail size={12} className="opacity-70" />
                    <span className="text-[12px] truncate">
                      {partner.email}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer chứa Doanh thu & Hoa hồng */}
            <div className="grid grid-cols-2 gap-2 mt-2 pt-4 border-t border-dashed border-slate-200">
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Doanh thu
                </span>
                <div className="flex items-center gap-1">
                  <span className="text-[14px] font-bold text-slate-900">
                    {partner.totalRevenue.toLocaleString()}đ
                  </span>
                </div>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Hoa hồng
                </span>
                <div className="flex items-center gap-1">
                  <span className="text-[14px] font-bold text-green-600">
                    {partner.totalCommission.toLocaleString()}đ
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

export default TopPartner;

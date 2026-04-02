"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/styles/components/ui/card";
import {
  User,
  Mail,
  DollarSign,
  Percent,
  Award,
  TrendingUp,
} from "lucide-react";

interface Partner {
  id: string;
  companyName: string;
  ownerEmail: string;
  ownerName: string;
  revenue: number;
  commission: number;
  partnerTier: string; // Đồng, Bạc, Vàng, Kim Cương
}

const TOP_PARTNERS: Partner[] = [
  {
    id: "1",
    companyName: "Công ty Đồ Chơi Luffy Gear",
    ownerEmail: "luffy.gear@gmail.com",
    ownerName: "Monkey D. Luffy",
    revenue: 150000000,
    commission: 15000000,
    partnerTier: "Kim Cương",
  },
  {
    id: "2",
    companyName: "Tiệm Kiếm Sĩ Zoro",
    ownerEmail: "zoro.wano@gmail.com",
    ownerName: "Roronoa Zoro",
    revenue: 95000000,
    commission: 8500000,
    partnerTier: "Vàng",
  },
  {
    id: "3",
    companyName: "Shop Thời Trang Nami",
    ownerEmail: "nami.money@gmail.com",
    ownerName: "Nami",
    revenue: 75000000,
    commission: 6000000,
    partnerTier: "Bạc",
  },
];

// Hàm bổ trợ màu sắc cho Tier
const getTierStyle = (tier: string) => {
  switch (tier) {
    case "Kim Cương":
      return "bg-blue-50 text-blue-600 border-blue-200";
    case "Vàng":
      return "bg-yellow-50 text-yellow-600 border-yellow-200";
    case "Bạc":
      return "bg-slate-50 text-slate-600 border-slate-200";
    default:
      return "bg-orange-50 text-orange-600 border-orange-200";
  }
};

const TopThreePartner = () => {
  return (
    <Card className="border-none shadow-none bg-transparent w-full h-full py-0 gap-2">
      <CardHeader className="p-0 flex-row items-center justify-between space-y-0">
        <CardTitle className="text-base font-bold flex items-center gap-2 uppercase tracking-tight">
          <Award className="w-5 h-5 text-emerald-500" />
          Đối tác doanh thu cao nhất
        </CardTitle>
      </CardHeader>

      <CardContent className="p-0 flex flex-1 flex-col justify-between gap-3">
        {TOP_PARTNERS.map((partner, index) => (
          <div
            key={partner.id}
            className={`
              group relative p-2 flex gap-4 rounded-2xl border border-transparent transition-all hover:border-blue-100 hover:shadow-md
              ${
                index === 0
                  ? "bg-yellow-100 border-yellow-100"
                  : index === 1
                    ? "bg-slate-100"
                    : index === 2
                      ? "bg-orange-100 border-orange-100"
                      : "bg-white"
              }
            `}
          >
            <div className="flex flex-col gap-3">
              {/* Avatar thay thế cho ảnh sản phẩm */}
              <div className="relative w-16 h-16 shrink-0 rounded-full border-2 border-white bg-gradient-to-br from-slate-100 to-slate-200 shadow-sm flex items-center justify-center overflow-hidden">
                <span className="text-xl font-black text-slate-400 group-hover:scale-110 transition-transform">
                  {partner.ownerName.charAt(0)}
                </span>
                <div
                  className={`
                  absolute bottom-0 w-full text-center py-0.5 text-[8px] font-bold text-white
                  ${index === 0 ? "bg-yellow-400" : "bg-slate-600"}
                `}
                >
                  TOP {index + 1}
                </div>
              </div>

              <div
                className={`px-2 py-0.5 rounded-full text-center border text-[9px] font-black uppercase tracking-tighter ${getTierStyle(partner.partnerTier)}`}
              >
                {partner.partnerTier}
              </div>
            </div>

            {/* Thông tin đối tác */}
            <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
              <div>
                <h4 className="text-[14px] font-bold text-slate-900 line-clamp-1 group-hover:text-blue-600 transition-colors">
                  {partner.companyName}
                </h4>

                <div className="flex flex-col gap-0.5 mt-1">
                  <div className="flex items-center gap-1.5 text-slate-500">
                    <User size={10} />
                    <span className="text-[12px] font-medium">
                      {partner.ownerName}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-400">
                    <Mail size={10} />
                    <span className="text-[12px] truncate">
                      {partner.ownerEmail}
                    </span>
                  </div>
                </div>
              </div>

              {/* Doanh thu & Hoa hồng */}
              <div className="flex items-center justify-between mt-3 pt-2 border-t border-dashed border-slate-200">
                <div className="flex items-center gap-1">
                  <TrendingUp size={12} className="text-emerald-500" />
                  <span className="text-[12px] font-bold text-slate-900">
                    {partner.revenue.toLocaleString()}đ
                  </span>
                </div>
                <div className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100">
                  <Percent size={10} />
                  <span className="text-[11px] font-bold">
                    {(partner.commission / 1000000).toFixed(1)}M
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default TopThreePartner;

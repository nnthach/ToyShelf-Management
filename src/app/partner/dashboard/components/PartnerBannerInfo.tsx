"use client";

import { Partner } from "@/src/types";
import { Calendar, CheckCircle2 } from "lucide-react";
import Image from "next/image";
import { formatPartnerTierTextColor } from "@/src/utils/formatStatus";
import TimeGreetingSubBanner from "@/src/components/TimeGreetingSubBanner";

function PartnerBannerInfo({
  partnerDetail,
}: {
  partnerDetail: Partner | null;
}) {
  return (
    <>
      {/* BANNER TRÁI: THÔNG TIN CHÍNH & CHIẾT KHẤU HIỆN TẠI (Col-span 3) */}
      <div className="relative rounded-2xl overflow-hidden shadow-lg col-span-3 h-[250px] flex">
        {/* Background image */}
        <Image
          src="/images/banner_admin_hello.jpg"
          alt="Banner"
          fill
          className="object-cover"
        />

        {/* Gradient overlay - Điều chỉnh để text dễ đọc hơn */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/90 to-blue-900/40"></div>

        {/* Content */}
        <div className="relative w-full p-8 text-white flex justify-between items-center">
          {/* Lớp thông tin Partner - Sử dụng h-full và justify-between để giãn cách đều */}
          <div className="flex flex-col justify-between h-full py-2 max-w-[55%]">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span
                  className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-[0.15em] backdrop-blur-md border border-white/20 shadow-xl ${formatPartnerTierTextColor(partnerDetail?.partnerTierName || "")}`}
                >
                  Hạng {partnerDetail?.partnerTierName}
                </span>
                <span className="text-white text-[10px] font-bold uppercase tracking-widest bg-white/50 px-2 py-0.5 rounded border border-white/5">
                  ID: {partnerDetail?.code}
                </span>
              </div>

              {/* MIDDLE: Company Name - Tách biệt hẳn ra */}
              <h2 className="text-4xl font-black tracking-tighter italic drop-shadow-md leading-tight text-white uppercase">
                {partnerDetail?.companyName}
              </h2>

              {/* Representative Info */}
              <div className="space-y-1.5 translate-y-1">
                <div className="flex items-center gap-2.5">
                  <div className="w-2 h-2 rounded-full bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.8)]"></div>
                  <p className="text-md font-bold text-white/95">
                    {partnerDetail?.partnerAccount?.fullName ||
                      "Chưa cập nhật đại diện"}
                  </p>
                </div>
                <p className="text-[14px] text-white/70 ml-4.5 font-medium tracking-wide">
                  {partnerDetail?.partnerAccount?.email ||
                    "Email hệ thống chưa sẵn sàng"}
                </p>
              </div>
            </div>
          </div>

          {/* Lớp thông tin Chiết khấu hiện tại (Mới đưa qua) */}
          {partnerDetail?.currentCommission ? (
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-5 w-[300px] shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-2 opacity-20">
                <CheckCircle2 size={40} />
              </div>

              <p className="text-[10px] font-bold text-blue-300 uppercase tracking-[0.2em] mb-2">
                Gói chiết khấu hiện tại
              </p>
              <h3 className="text-xl font-black mb-3 text-white truncate">
                {partnerDetail.currentCommission.name}
              </h3>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-[11px] text-white/80">
                  <Calendar size={12} className="text-blue-400" />
                  <span>
                    Từ:{" "}
                    {new Date(
                      partnerDetail.currentCommission.startDate,
                    ).toLocaleDateString("vi-VN")}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-white/80">
                  <Calendar size={12} className="text-orange-400" />
                  <span>
                    Đến:{" "}
                    {new Date(
                      partnerDetail.currentCommission.endDate,
                    ).toLocaleDateString("vi-VN")}
                  </span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-white/10 flex justify-between items-center">
                <span className="text-[10px] text-green-400 font-bold flex items-center gap-1">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                  </span>
                  Đang áp dụng
                </span>
              </div>
            </div>
          ) : (
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-5 w-[280px] text-center italic text-white/40 text-sm">
              Chưa áp dụng bảng chiết khấu
            </div>
          )}
        </div>
      </div>

      <TimeGreetingSubBanner heigh={"h-[250px]"} />
    </>
  );
}

export default PartnerBannerInfo;

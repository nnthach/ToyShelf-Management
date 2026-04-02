"use client";

import { Partner } from "@/src/types";
import {
  UserPlus,
  History,
  Calendar,
  CheckCircle2,
  FilePlus,
} from "lucide-react";
import Image from "next/image";
import CreatePartnerAccountModal from "./CreatePartnerAccountModal";
import { formatPartnerTierTextColor } from "@/src/utils/formatStatus";
import UpgradePartnerTierModal from "../../components/UpgradePartnerTierModal";
import ApplyNewCommissionTableModal from "../../components/ApplyNewCommissionTableModal";

function PartnerBannerInfo({ partnerDetail }: { partnerDetail: Partner }) {
  return (
    <>
      {/* BANNER TRÁI: THÔNG TIN CHÍNH & CHIẾT KHẤU HIỆN TẠI (Col-span 3) */}
      <div className="relative rounded-2xl overflow-hidden shadow-lg sm:col-span-3 lg:col-span-3 h-[300px] flex">
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

            {/* BOTTOM: Action Buttons - Cách đều so với phía trên */}
            <div className="flex items-center gap-3 mt-8">
              <UpgradePartnerTierModal partnerId={partnerDetail?.id} />
              <ApplyNewCommissionTableModal partnerId={partnerDetail?.id} />
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
                    ).toLocaleDateString("vi-VN", {
                      timeZone: "Asia/Ho_Chi_Minh",
                    })}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-white/80">
                  <Calendar size={12} className="text-orange-400" />
                  <span>
                    Đến:{" "}
                    {new Date(
                      partnerDetail.currentCommission.endDate,
                    ).toLocaleDateString("vi-VN", {
                      timeZone: "Asia/Ho_Chi_Minh",
                    })}
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

      {/* CỘT PHẢI: LỊCH SỬ CHIẾT KHẤU / TÀI KHOẢN (Col-span 1) */}
      <div className="bg-white max-h-[300px] dark:bg-zinc-950 shadow-sm rounded-2xl sm:col-span-3 lg:col-span-1 border border-zinc-200 dark:border-zinc-800 flex flex-col h-full overflow-hidden">
        {/* Header của cột phải */}
        <div className="px-5 py-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between bg-zinc-50/50">
          <h3 className="text-[11px] font-black text-zinc-600 dark:text-zinc-400 uppercase tracking-[0.15em] flex items-center gap-2">
            <History size={14} className="text-blue-500" />
            Lịch sử chiết khấu
          </h3>
        </div>

        {/* Nội dung chính */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-5 space-y-3.5 scrollbar-hide bg-zinc-50 dark:bg-zinc-950/50">
          {/* TRƯỜNG HỢP 1: CHƯA CÓ TÀI KHOẢN -> HIỆN CARD TẠO TÀI KHOẢN LÊN ĐẦU */}
          {!partnerDetail?.partnerAccount && (
            <div className="p-5 rounded-xl border-2 border-dashed border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 flex flex-col items-center text-center gap-3 mb-4 shadow-inner">
              <div className="w-12 h-12 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                <UserPlus size={24} className="text-zinc-400" />
              </div>
              <div>
                <p className="text-xs font-bold text-zinc-800 dark:text-zinc-200 uppercase">
                  Tài khoản đối tác
                </p>
                <p className="text-[10px] text-zinc-500 mt-1 italic">
                  Đối tác này chưa được cấp tài khoản truy cập hệ thống.
                </p>
              </div>
              <CreatePartnerAccountModal />
            </div>
          )}

          {/* TRƯỜNG HỢP 2: DANH SÁCH LỊCH SỬ */}
          {partnerDetail?.commissionHistories &&
          partnerDetail.commissionHistories.length > 0
            ? partnerDetail.commissionHistories.map((his, index) => (
                <div
                  key={index}
                  className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm hover:border-blue-400 hover:shadow-md transition-all group relative overflow-hidden"
                >
                  {/* Decor nhỏ cho mỗi item */}
                  <div className="absolute top-0 left-0 w-1 h-full bg-transparent group-hover:bg-blue-500 transition-all"></div>

                  <div className="flex justify-between items-start mb-2">
                    <p className="text-[13px] font-black text-zinc-900 dark:text-zinc-100 leading-tight">
                      {his.name}
                    </p>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-zinc-200 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 font-bold">
                      #{index + 1}
                    </span>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center gap-2 text-[11px] font-bold text-zinc-600 dark:text-zinc-400 uppercase tracking-tighter">
                      <Calendar size={12} className="text-blue-500" />
                      <span>
                        {new Date(his.startDate).toLocaleDateString("vi-VN")} -{" "}
                        {new Date(his.endDate).toLocaleDateString("vi-VN")}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            : /* Nếu không có cả account lẫn history */
              partnerDetail?.partnerAccount && (
                <div className="h-full flex flex-col items-center justify-center text-zinc-500 py-10 gap-2 opacity-60 italic">
                  <History size={40} />
                  <p className="text-sm font-bold">Không tìm thấy lịch sử</p>
                </div>
              )}
        </div>
      </div>
    </>
  );
}

export default PartnerBannerInfo;

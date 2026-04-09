"use client";

import { Partner } from "@/src/types";
import {
  UserPlus,
  History,
  Calendar,
  CheckCircle2,
  FilePlus,
  Settings,
  MapPin,
  Lock,
  ShieldCheck,
} from "lucide-react";
import Image from "next/image";
import CreatePartnerAccountModal from "./CreatePartnerAccountModal";
import { formatPartnerTierTextColor } from "@/src/utils/formatStatus";
import UpgradePartnerTierModal from "../../components/UpgradePartnerTierModal";
import ApplyNewCommissionTableModal from "../../components/ApplyNewCommissionTableModal";
import UpdatePartnerInfoModal from "./UpdatePartnerInfoModal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/src/styles/components/ui/dropdown-menu";
import { Button } from "@/src/styles/components/ui/button";
import { toast } from "react-toastify";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  disablePartnerAPI,
  restorePartnerAPI,
} from "@/src/services/partner.service";

function PartnerBannerInfo({ partnerDetail }: { partnerDetail: Partner }) {
  const queryClient = useQueryClient();

  const disableMutation = useMutation({
    mutationFn: disablePartnerAPI,
    onSuccess: () => {
      toast.success("Khóa đối tác thành công");

      queryClient.invalidateQueries({
        queryKey: ["partner", partnerDetail.id],
      });
    },
    onError: () => {
      toast.error("Vô hiệu hóa thất bại");
    },
  });

  const handleDisable = (partnerId: string) => {
    const confirmDisable = window.confirm(
      "Bạn có chắc muốn khóa đối tác này không?",
    );

    if (!confirmDisable) return;

    disableMutation.mutate(partnerId);
  };

  const restoreMutation = useMutation({
    mutationFn: restorePartnerAPI,
    onSuccess: () => {
      toast.success("Kích hoạt thành công");

      queryClient.invalidateQueries({
        queryKey: ["partner", partnerDetail.id],
      });
    },
    onError: () => {
      toast.error("Kích hoạt thất bại");
    },
  });

  const handleRestore = (partnerId: string) => {
    restoreMutation.mutate(partnerId);
  };

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
          <div className="flex flex-col justify-between h-full py-2 max-w-[60%]">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span
                  className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-[0.15em] backdrop-blur-md border border-white/20 shadow-xl ${formatPartnerTierTextColor(partnerDetail?.partnerTierName || "")}`}
                >
                  Hạng {partnerDetail?.partnerTierName}
                </span>

                <span
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-widest backdrop-blur-md border border-white/10 ${partnerDetail?.isActive ? "bg-emerald-500/20 text-emerald-400" : "bg-rose-500/20 text-rose-400"}`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${partnerDetail?.isActive ? "bg-emerald-400 animate-pulse" : "bg-rose-400"}`}
                  ></span>
                  {partnerDetail?.isActive ? "Hoạt động" : "Tạm ngưng"}
                </span>

                <span className="text-white/60 text-[10px] font-bold uppercase tracking-widest bg-white/5 px-2 py-0.5 rounded border border-white/5">
                  ID: {partnerDetail?.code}
                </span>
              </div>

              {/* DÒNG 2: TÊN CÔNG TY */}
              <h2 className="text-4xl font-black tracking-tighter italic drop-shadow-md leading-tight text-white uppercase">
                {partnerDetail?.companyName}
              </h2>

              <div className="flex items-start gap-8">
                <div className="space-y-1">
                  <div className="flex items-center gap-2.5">
                    <div className="w-2 h-2 rounded-full bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.8)]"></div>
                    <p className="text-md font-bold text-white/95">
                      {partnerDetail?.partnerAccount?.fullName ||
                        "Chưa cập nhật thông tin"}
                    </p>
                  </div>
                  <p className="text-[13px] text-white/60 ml-4.5 font-medium">
                    {partnerDetail?.partnerAccount?.email ||
                      "Chưa có tài khoản sở hữu"}
                  </p>
                </div>
                <div className="pl-6 border-l border-white/10">
                  <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1">
                    Giới hạn kệ/Cửa hàng
                  </p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-xl font-bold text-white leading-none">
                      {partnerDetail?.maxShelvesPerStore || 0}
                    </span>
                    <span className="text-[10px] text-white/40 uppercase font-bold">
                      Kệ
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* DÒNG CUỐI: ĐỊA CHỈ */}
            <p className="text-sm text-white/80 line-clamp-1 w-[500px] flex items-center gap-2">
              <MapPin size={26} className="text-blue-400" />
              {partnerDetail.address || "N/A"}
            </p>
          </div>

          <div className="flex flex-col gap-4 items-end h-full py-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 rounded-xl text-xs font-bold transition-all shadow-lg uppercase tracking-wider">
                  <Settings size={14} />
                  Quản lý đối tác
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-56 p-2 bg-slate-900 border-white/10 text-white"
              >
                <DropdownMenuLabel className="text-[10px] uppercase opacity-50">
                  Thao tác đối tác
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-white/10" />

                <div className="flex flex-col gap-1">
                  <UpdatePartnerInfoModal partner={partnerDetail} />
                  <UpgradePartnerTierModal partnerId={partnerDetail?.id} />
                  <ApplyNewCommissionTableModal partnerId={partnerDetail?.id} />

                  {partnerDetail?.isActive ? (
                    <Button
                      variant="secondary"
                      onClick={() => handleDisable(partnerDetail.id)}
                      className="px-2 py-0.5 bg-white/5 hover:bg-white/10 text-white/80 rounded-md text-[12px] border border-white/10"
                    >
                      <Lock />
                      Khóa đối tác
                    </Button>
                  ) : (
                    <Button
                      variant="secondary"
                      onClick={() => handleRestore(partnerDetail.id)}
                      className="px-2 py-0.5 bg-white/5 hover:bg-white/10 text-white/80 rounded-md text-[12px] border border-white/10"
                    >
                      <ShieldCheck />
                      Kích hoạt đối tác
                    </Button>
                  )}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
            {/* Lớp thông tin Chiết khấu hiện tại (Mới đưa qua) */}
            {partnerDetail?.currentCommission ? (
              <div className="flex flex-col gap-3 items-end">
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
              </div>
            ) : (
              <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-5 w-[280px] text-center italic text-white/40 text-sm">
                Chưa áp dụng bảng chiết khấu
              </div>
            )}
          </div>
        </div>
      </div>

      {/* CỘT PHẢI: TÀI KHOẢN / LỊCH SỬ CHIẾT KHẤU */}
      <div className="bg-white max-h-[300px] dark:bg-zinc-950 shadow-sm rounded-2xl sm:col-span-3 lg:col-span-1 border border-zinc-200 dark:border-zinc-800 flex flex-col h-full overflow-hidden">
        {!partnerDetail?.partnerAccount ? (
          /* --- TRƯỜNG HỢP 1: CHƯA CÓ TÀI KHOẢN (Hiển thị card mời tạo tài khoản) --- */
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center bg-zinc-50/50 dark:bg-zinc-900/30">
            <div className="w-16 h-16 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center mb-4">
              <UserPlus size={32} className="text-blue-500" />
            </div>
            <h3 className="text-sm font-black text-zinc-800 dark:text-zinc-200 uppercase tracking-wider mb-2">
              Tài khoản đối tác
            </h3>
            <p className="text-xs text-zinc-500 mb-6 italic px-4">
              Đối tác này chưa được cấp tài khoản truy cập. Hãy tạo tài khoản để
              theo dõi chiết khấu.
            </p>
            <CreatePartnerAccountModal />
          </div>
        ) : (
          /* --- TRƯỜNG HỢP 2: ĐÃ CÓ TÀI KHOẢN (Hiển thị Header và List Lịch sử) --- */
          <>
            {/* Header */}
            <div className="px-5 py-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between bg-white">
              <h3 className="text-[11px] font-black text-zinc-600 dark:text-zinc-400 uppercase tracking-[0.15em] flex items-center gap-2">
                <History size={14} className="text-blue-500" />
                Lịch sử áp dụng hoa hồng
              </h3>
            </div>

            {/* Nội dung danh sách */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-5 space-y-3.5 scrollbar-hide bg-slate-50 dark:bg-zinc-950/50">
              {partnerDetail?.commissionHistories &&
              partnerDetail.commissionHistories.length > 0 ? (
                partnerDetail.commissionHistories.map((his, index) => (
                  <div
                    key={index}
                    className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm hover:border-blue-400 hover:shadow-md transition-all group relative overflow-hidden"
                  >
                    <div className="absolute top-0 left-0 w-1 h-full bg-transparent group-hover:bg-blue-500 transition-all"></div>

                    <div className="flex justify-between items-start mb-2">
                      <p className="text-[13px] font-black text-zinc-900 dark:text-zinc-100 leading-tight">
                        {his.name}
                      </p>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-zinc-200 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 font-bold">
                        #{index + 1}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-[11px] font-bold text-zinc-600 dark:text-zinc-400 uppercase tracking-tighter">
                      <Calendar size={12} className="text-blue-500" />
                      <span>
                        {new Date(his.startDate).toLocaleDateString("vi-VN")} -{" "}
                        {new Date(his.endDate).toLocaleDateString("vi-VN")}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                /* Nếu đã có account nhưng chưa có data lịch sử */
                <div className="h-full flex flex-col items-center justify-center text-zinc-500 py-10 gap-2 opacity-60 italic">
                  <History size={40} />
                  <p className="text-sm font-bold">Không tìm thấy lịch sử</p>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default PartnerBannerInfo;

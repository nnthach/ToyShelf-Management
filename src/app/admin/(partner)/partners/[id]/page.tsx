"use client";

import StatCard from "@/src/components/StatCard";
import {
  ArrowLeft,
  ArrowRight,
  Box,
  Server,
  Store,
  UserPlus,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import { TargetRevenueChart } from "./components/charts/TargetRevenueChart";
import { Button } from "@/src/styles/components/ui/button";
import CreatePartnerAccountModal from "./components/CreatePartnerAccountModal";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { getPartnerDetailAPI } from "@/src/services/partner.service";
import { formatPartnerTierTextColor } from "@/src/utils/formatStatus";
import PartnerDetailStoreList from "./components/storelist/PartnerDetailStoreList";
import StatCardWithButton from "@/src/components/StatCardWithButton";
import TotalRevenueChart from "./components/charts/TotalRevenueChart";

export default function ViewPartnerDetailPage() {
  const { id: partnerId } = useParams<{ id: string }>();
  const router = useRouter();

  const {
    data: partnerDetail,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["partner", partnerId],
    queryFn: () => getPartnerDetailAPI(partnerId!),
    select: (res) => res.data,
    enabled: !!partnerId,
  });

  console.log("Partner Detail:", partnerDetail);

  return (
    <div className="pb-6">
      {/*Header */}
      <div className="flex items-center justify-between mb-6">
        {/*Left */}
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size={"sm"}
            onClick={() => router.back()}
            className="w-8 h-8"
          >
            <ArrowLeft />
          </Button>
          <h1 className="text-xl font-bold dark:text-foreground">
            Chi tiết thông tin đối tác
          </h1>
        </div>
      </div>

      {/* THÔNG TIN ĐỐI TÁC */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        {/* Banner chào*/}
        <div className="relative rounded-xl overflow-hidden shadow-md col-span-3">
          {/* Background image */}
          <Image
            src="/images/banner_admin_hello.jpg"
            alt="Banner"
            fill
            className="object-cover"
          />

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-linear-to-r from-black/90 to-blue-700/70"></div>

          {/* Content */}
          <div className="relative z-10 px-6 py-6 text-white flex items-center justify-between">
            <div className="flex flex-col gap-1 space-y-3">
              {/* Company Name */}
              <h2 className="text-2xl font-bold tracking-wide">
                {partnerDetail?.companyName}
              </h2>

              {/* Partner Tier */}
              <div className="flex items-center gap-2 text-sm">
                <span
                  className={`font-bold text-[10px] uppercase tracking-wide shadow-sm ${formatPartnerTierTextColor(partnerDetail?.partnerTierName || "")}`}
                >
                  {partnerDetail?.partnerTierName}
                </span>

                <span className="text-white/70 text-xs">
                  Uư tiên: {partnerDetail?.partnerTierPriority}
                </span>
              </div>

              {/* Representative */}
              <p className="text-sm text-white/80">
                Người đại diện:{" "}
                {partnerDetail?.partnerAccount?.fullName || "Chưa có"}
              </p>

              {/* Email */}
              <p className="text-sm text-white/60">
                {partnerDetail?.partnerAccount?.email}
              </p>
            </div>
          </div>
        </div>

        {/*Thông tin hợp đồng */}
        <div className="bg-white dark:bg-zinc-900 shadow-md rounded-xl col-span-1 h-full w-full flex flex-col items-center justify-center p-6 border border-zinc-100 dark:border-zinc-800 relative overflow-hidden group">
          {/* Decor trang trí nhẹ ở góc */}
          <div className="absolute -top-4 -right-4 w-16 h-16 bg-blue-500/10 rounded-full blur-xl group-hover:bg-blue-500/20 transition-all"></div>

          {partnerDetail?.partnerAccount ? (
            /* TRẠNG THÁI 1: ĐÃ CÓ TÀI KHOẢN -> HIỆN COMMISSION & INFO */
            <div className="flex flex-col items-center w-full gap-4">
              {/* Thông tin cá nhân nhỏ gọn */}
              <div className="flex items-center gap-3 w-full p-2 rounded-lg bg-zinc-50 dark:bg-zinc-800/50">
                <div className="relative w-10 h-10 rounded-full overflow-hidden border border-zinc-200">
                  {partnerDetail.partnerAccount.avatarUrl ? (
                    <Image
                      src={partnerDetail.partnerAccount.avatarUrl}
                      alt="avatar"
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                      {partnerDetail.partnerAccount.fullName?.charAt(0)}
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-zinc-800 dark:text-zinc-100 truncate">
                    {partnerDetail.partnerAccount.fullName}
                  </p>
                  <p className="text-[10px] text-zinc-500 truncate">
                    {partnerDetail.partnerAccount.email}
                  </p>
                </div>
              </div>

              {/* Thông tin Commission nổi bật */}
              {partnerDetail?.currentCommission && (
                <div className="w-full p-4 rounded-xl bg-linear-to-br from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/10 border border-orange-200 dark:border-orange-800/50 shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold text-orange-600 dark:text-orange-400 uppercase tracking-widest">
                      Gói chiết khấu
                    </span>
                    <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></div>
                  </div>
                  <p className="text-lg font-black text-zinc-800 dark:text-zinc-100">
                    {partnerDetail.currentCommission.name}
                  </p>
                  <div className="flex items-center gap-1 mt-2 text-zinc-500">
                    <span className="text-[10px]">Hiệu lực đến:</span>
                    <span className="text-[10px] font-medium">
                      {new Date(
                        partnerDetail.currentCommission.endDate,
                      ).toLocaleDateString("vi-VN")}
                    </span>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* TRẠNG THÁI 2: CHƯA CÓ TÀI KHOẢN -> HIỆN NÚT TẠO */
            <div className="flex flex-col items-center justify-center gap-4 w-full">
              <div className="w-20 h-20 rounded-full bg-zinc-50 dark:bg-zinc-800 flex items-center justify-center border-2 border-dashed border-zinc-200 dark:border-zinc-700 shadow-inner">
                <UserPlus className="text-zinc-300" size={32} />
              </div>

              <div className="text-center space-y-3">
                <div>
                  <p className="text-sm font-bold text-zinc-800 dark:text-zinc-200">
                    Chưa cấp tài khoản
                  </p>
                  <p className="text-xs text-zinc-500 mt-1">
                    Vui lòng tạo tài khoản để Partner có thể đăng nhập hệ thống
                  </p>
                </div>
                <CreatePartnerAccountModal />
              </div>
            </div>
          )}
        </div>
      </div>

      {/*Statistic card */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <StatCardWithButton
          title="Doanh thu"
          value="250,520 VND"
          change="+30,215 VND"
          changePercent="+12%"
          icon={Box}
          color="bg-green-100 text-green-900"
        />

        <StatCardWithButton
          title="Đơn hàng"
          value="10"
          change="+2,815"
          changePercent="+18%"
          icon={Server}
          color="bg-pink-100 text-pink-900"
        />

        <StatCardWithButton
          title="Hoa hồng"
          value="15"
          change="+2,815"
          changePercent="+18%"
          icon={Box}
          color="bg-blue-100 text-blue-900"
        />

        <StatCardWithButton
          title="Cửa hàng"
          value="15"
          change="+1,647"
          changePercent="+15%"
          icon={Store}
          color="bg-yellow-100 text-yellow-900"
          action={
            <span
              className={`inline-flex items-center justify-center h-7 w-10 rounded-2xl border 
  border-current bg-yellow-100 text-yellow-900
  bg-opacity-30 hover:bg-opacity-50
  transition-all cursor-pointer shadow-sm active:scale-95`}
              onClick={() =>
                router.push(`/admin/stores?companyid=${partnerId}`)
              }
            >
              <ArrowRight size={16} />
            </span>
          }
        />
      </div>

      {/*Content */}
      <div className="mt-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-4 gap-4 mb-4">
          {/*Chart total revenue */}
          <div className="bg-background rounded-lg lg:col-span-4 min-h-[70vh] p-4 border border-gray-100 shadow-sm">
            <TotalRevenueChart />
          </div>
          {/*Chart target value */}
          <div className="bg-background rounded-lg col-span-1 w-full">
            <TargetRevenueChart />
          </div>
        </div>
      </div>

      {/*Store */}
      <PartnerDetailStoreList partnerId={partnerId} />
    </div>
  );
}

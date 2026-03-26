"use client";

import StatCard from "@/src/components/StatCard";
import { ArrowLeft, Box, Server, Store, UserPlus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import BarChartExample from "./components/charts/BarChart";
import { TargetRevenueChart } from "./components/charts/TargetRevenueChart";
import { Button } from "@/src/styles/components/ui/button";
import CreatePartnerAccountModal from "./components/CreatePartnerAccountModal";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { getPartnerDetailAPI } from "@/src/services/partner.service";
import { formatPartnerTierTextColor } from "@/src/utils/formatStatus";
import PartnerDetailStoreList from "./components/storelist/PartnerDetailStoreList";

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
            Chi tiết đối tác
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
            <div className="flex flex-col items-center gap-3">
              <div className="relative w-20 h-20 rounded-full bg-linear-to-tr from-blue-500 to-indigo-600 p-0.5 shadow-lg">
                <div className="w-full h-full rounded-full bg-white dark:bg-zinc-800 flex items-center justify-center overflow-hidden">
                  {partnerDetail.partnerAccount.avatarUrl ? (
                    <Image
                      src={partnerDetail.partnerAccount.avatarUrl}
                      alt="avatar"
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <span className="text-2xl font-bold text-blue-600">
                      {partnerDetail.partnerAccount.fullName?.charAt(0)}
                    </span>
                  )}
                </div>
                {/* Trạng thái Online/Active */}
                <div className="absolute bottom-1 right-1 w-4 h-4 bg-green-500 border-2 border-white dark:border-zinc-900 rounded-full"></div>
              </div>

              <div className="text-center">
                <p className="font-bold text-zinc-800 dark:text-zinc-100">
                  {partnerDetail.partnerAccount.fullName}
                </p>
                <p className="text-xs text-zinc-500 truncate">
                  {partnerDetail.partnerAccount.email}
                </p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center gap-4 w-full">
              <div className="w-16 h-16 rounded-2xl bg-zinc-50 dark:bg-zinc-800 flex items-center justify-center border-2 border-dashed border-zinc-200 dark:border-zinc-700">
                <UserPlus className="text-zinc-300" size={32} />
              </div>

              <div className="space-y-1 flex flex-col items-center">
                <p className="text-sm font-medium text-zinc-500 text-center">
                  Chưa cấp tài khoản
                </p>
                <CreatePartnerAccountModal />
              </div>
            </div>
          )}
        </div>
      </div>

      {/*Statistic card */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <StatCard
          title="Doanh thu"
          value="$250,520"
          change="+$30,215"
          changePercent="+12%"
          icon={Box}
          color="bg-green-100 text-green-900"
        />

        <StatCard
          title="Cửa hàng"
          value="15"
          change="+1,647"
          changePercent="+15%"
          icon={Store}
          color="bg-yellow-100 text-yellow-900"
        />

        <StatCard
          title="Kệ"
          value="10"
          change="+2,815"
          changePercent="+18%"
          icon={Server}
          color="bg-pink-100 text-pink-900"
        />

        <StatCard
          title="Tồn kho"
          value="15"
          change="+2,815"
          changePercent="+18%"
          icon={Box}
          color="bg-blue-100 text-blue-900"
        />
      </div>

      {/*Content */}
      <div className="mt-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-4 gap-4 mb-4">
          {/*Chart total revenue */}
          <div className="bg-background shadow-sm rounded-lg col-span-3 h-[60vh] w-full">
            <BarChartExample />
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

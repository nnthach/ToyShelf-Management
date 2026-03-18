"use client";

import StatCard from "@/src/components/StatCard";
import { StoreFakeData } from "@/src/constants/fakeData";
import { ArrowLeft, Box, Eye, Server, Store } from "lucide-react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import BarChartExample from "./components/charts/BarChart";
import { TargetRevenueChart } from "./components/charts/TargetRevenueChart";
import { Button } from "@/src/styles/components/ui/button";
import CreatePartnerAccountModal from "./components/CreatePartnerAccountModal";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { getPartnerDetailAPI } from "@/src/services/partner.service";

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
    <>
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
                <span className="px-2 py-0.5 rounded-md bg-blue-500/80 text-white text-xs font-medium">
                  {partnerDetail?.partnerTierName}
                </span>

                <span className="text-white/70 text-xs">
                  Uư tiên: {partnerDetail?.partnerTierPriority}
                </span>
              </div>

              {/* Representative */}
              <p className="text-sm text-white/80">
                Người đại diện: {partnerDetail?.partnerAccount?.fullName}
              </p>

              {/* Email */}
              <p className="text-sm text-white/60">
                {partnerDetail?.partnerAccount?.email}
              </p>
            </div>
          </div>
        </div>

        {/*Thông tin hợp đồng */}
        <div className="bg-background shadow-sm rounded-lg col-span-1 h-[30vh] w-full flex flex-col items-center justify-center text-center gap-3">
          <p className="text-sm text-muted-foreground">
            Chưa có thông tin hợp đồng
          </p>
          {partnerDetail?.partnerAccount ? (
            <p className="text-sm text-white/60">
              {partnerDetail?.partnerAccount?.email}
            </p>
          ) : (
            <CreatePartnerAccountModal />
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
      <div>
        <h1 className="text-xl font-bold mb-4">Danh sách cửa hàng</h1>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-5 gap-4 mb-6">
          {StoreFakeData.slice(0, 3).map((store) => {
            const image = store.images?.[0];

            return (
              <div
                key={store.id}
                className="group rounded-xl border border-gray-200 bg-white p-4
                       hover:shadow-lg transition-shadow duration-200"
              >
                {/* Image */}
                <div className="relative rounded-lg overflow-hidden bg-gray-100 mb-2">
                  <div className="aspect-square">
                    {image && (
                      <img
                        src={image}
                        alt="Product"
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>

                  {/* Eye button */}
                  <Button
                    variant="outline"
                    size="icon"
                    className="absolute top-2 right-2 z-20
                       opacity-0 group-hover:opacity-100 transition"
                    onClick={() => router.push(`/admin/stores/${store.id}`)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>

                  {/* Hover info */}
                  <div
                    className="absolute inset-x-0 bottom-0 z-10
                           translate-y-full opacity-0
                           group-hover:translate-y-0 group-hover:opacity-100
                           transition-all duration-300 ease-out"
                  >
                    <div className="bg-white/90 backdrop-blur-sm px-3 py-2 text-xs">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Open day</span>
                        <span className="font-medium text-gray-900">
                          {store.openDay}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Open time</span>
                        <span className="font-medium text-gray-900">
                          {store.openTime} - {store.closeTime}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Address</span>
                        <span className="font-medium text-gray-900 truncate">
                          {store.address}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Status */}
                <div className="mb-2">
                  <span
                    className="inline-flex items-center gap-1 rounded-full
                               bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-green-600" />
                    {store?.status}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-sm font-semibold text-gray-900 line-clamp-2">
                  {store?.name}
                </h3>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

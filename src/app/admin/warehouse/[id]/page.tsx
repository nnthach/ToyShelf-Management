"use client";

import StatCard from "@/src/components/StatCard";
import { StoreFakeData } from "@/src/constants/fakeData";
import { ArrowLeft, Box, Eye, Server, Store } from "lucide-react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import BarChartExample from "./components/charts/BarChart";
import { TargetRevenueChart } from "./components/charts/TargetRevenueChart";
import { Button } from "@/src/styles/components/ui/button";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { getWarehouseDetailAPI } from "@/src/services/warehouse.service";
import { formatBooleanIsActiveStatusText } from "@/src/utils/formatStatus";
import UpdateWarehouseModal from "../components/UpdateWarehouseModal";
import CreateWarehouseManagerAccountModal from "./components/CreateWarehouseManagerAccountModal";

export default function ViewWarehouseDetailPage() {
  const { id: warehouseId } = useParams<{ id: string }>();
  const router = useRouter();

  const {
    data: warehouseDetail,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["warehouse", warehouseId],
    queryFn: () => getWarehouseDetailAPI(warehouseId!),
    select: (res) => res.data,
    enabled: !!warehouseId,
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
            Chi tiết kho
          </h1>
        </div>
      </div>

      {/* THÔNG TIN kho */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        {/* Banner chào */}
        <div className="relative rounded-2xl overflow-hidden shadow-lg col-span-3 min-h-[200px]">
          {/* Background image */}
          <Image
            src="/images/banner_admin_hello.jpg"
            alt="Banner Background"
            fill
            className="object-cover"
          />

          {/* Gradient overlay - Darker for better readability */}
          <div className="absolute inset-0 bg-linear-to-r from-slate-950 via-slate-900/80 to-blue-900/40"></div>

          {/* Content */}
          <div className="relative z-10 p-8 text-white flex flex-col md:flex-row items-start md:items-center justify-between h-full gap-6">
            <div className="flex flex-col gap-2">
              {/* Warehouse Info Tags */}
              <div className="flex flex-wrap items-center gap-3 mt-2">
                <span className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-blue-200 text-xs font-mono font-bold">
                  {/* Mã code: WH-HCM-03 */}
                  {warehouseDetail?.code}
                </span>
                <span
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-medium transition-colors ${
                    warehouseDetail?.isActive
                      ? "bg-emerald-500/20 border-emerald-500/30 text-emerald-400"
                      : "bg-rose-500/20 border-rose-500/30 text-rose-400"
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      warehouseDetail?.isActive
                        ? "bg-emerald-500 animate-pulse"
                        : "bg-rose-500"
                    }`}
                  ></span>
                  {formatBooleanIsActiveStatusText(warehouseDetail?.isActive)}
                </span>
                <span className="text-white/60 text-xs flex items-center gap-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  {warehouseDetail?.cityCode}
                </span>
              </div>

              {/* Specific Details */}
              <div className="mt-4 space-y-1.5">
                <p className="text-lg font-semibold text-white/90">
                  {warehouseDetail?.name}
                </p>
                <p className="text-sm text-white/70 max-w-2xl leading-relaxed flex items-start gap-2">
                  <span className="shrink-0 mt-1">📍</span>
                  {warehouseDetail?.address}
                </p>
              </div>
            </div>

            {/* Edit Button Side */}
            <div className="shrink-0">
              <UpdateWarehouseModal warehouse={warehouseDetail} />
            </div>
          </div>
        </div>

        {/*Thông tin hợp đồng */}
        <div className="bg-background shadow-sm rounded-lg col-span-1 h-[30vh] w-full flex flex-col items-center justify-center text-center gap-3">
          <p className="text-sm text-muted-foreground">
            Chưa có thông tin người quản lý
          </p>

          <CreateWarehouseManagerAccountModal warehouseId={warehouseId} />
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

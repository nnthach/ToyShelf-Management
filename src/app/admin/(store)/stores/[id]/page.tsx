"use client";

import { Button } from "@/src/styles/components/ui/button";
import { ArrowLeft, ArrowRight, Box, Store } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import BarChartExample from "../components/charts/BarChart";
import AreaChartExample from "../components/charts/AreaChart";
import { TargetRevenueChart } from "../components/charts/TargetRevenueChart";
import { useQuery } from "@tanstack/react-query";
import LoadingPageComponent from "@/src/components/LoadingPageComponent";
import { getStoreDetailAPI } from "@/src/services/store.service";
import StatCardWithButton from "@/src/components/StatCardWithButton";
import StoreBannerInfo from "./components/StoreBannerInfo";

export default function PartnerStoreDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const router = useRouter();

  const { data: storeDetail, isLoading } = useQuery({
    queryKey: ["store", id],
    queryFn: () => getStoreDetailAPI(id!),
    select: (res) => res.data,
    enabled: !!id,
  });

  if (!id) return null;

  if (isLoading) {
    return <LoadingPageComponent />;
  }

  return (
    <div className="space-y-6">
      {/*Header */}
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
          Thông tin cửa hàng {storeDetail?.name}
        </h1>
      </div>

      {/*banner store ìno */}
      <StoreBannerInfo storeDetail={storeDetail} />

      {/*Statistic card */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCardWithButton
          title="Doanh thu cửa hàng"
          value="$250,520"
          change="+$30,215"
          changePercent="+12%"
          icon={Box}
          color="bg-green-100 text-green-900"
        />

        <StatCardWithButton
          title="Đơn hàng"
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
              onClick={() => router.push(`/admin/stores/${id}/orders`)}
            >
              <ArrowRight size={16} />
            </span>
          }
        />

        <StatCardWithButton
          title="Tồn kho"
          value="15"
          change="+2,815"
          changePercent="+18%"
          icon={Box}
          color="bg-blue-100 text-blue-900"
          action={
            <span
              className={`inline-flex items-center justify-center h-7 w-10 rounded-2xl border 
  border-current bg-blue-100 text-blue-900
  bg-opacity-30 hover:bg-opacity-50
  transition-all cursor-pointer shadow-sm active:scale-95`}
              onClick={() =>
                router.push(
                  `/admin/stores/${id}/inventory?inventoryLocationId=${storeDetail.inventoryLocationId}`,
                )
              }
            >
              <ArrowRight size={16} />
            </span>
          }
        />
        <StatCardWithButton
          title="Kệ"
          value="15"
          change="+2,815"
          changePercent="+18%"
          icon={Box}
          color="bg-pink-100 text-pink-900"
          action={
            <span
              className={`inline-flex items-center justify-center h-7 w-10 rounded-2xl border 
  border-current bg-pink-100 text-pink-900
  bg-opacity-30 hover:bg-opacity-50
  transition-all cursor-pointer shadow-sm active:scale-95`}
              onClick={() =>
                router.push(
                  `/admin/stores/${id}/inventory?inventoryLocationId=${storeDetail.inventoryLocationId}`,
                )
              }
            >
              <ArrowRight size={16} />
            </span>
          }
        />
      </div>

      {/*Content */}
      <div className="">
        <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-4 gap-4 mb-4">
          {/*Chart total revenue */}
          <div className="bg-background rounded-lg col-span-3 h-[60vh] w-full">
            <BarChartExample />
          </div>
          {/*Chart target value */}
          <div className="bg-background rounded-lg col-span-1 w-full">
            <TargetRevenueChart />
          </div>

          {/*chart */}
          <div className="bg-background rounded-lg col-span-4 h-[60vh] w-full">
            <AreaChartExample />
          </div>
        </div>
      </div>
    </div>
  );
}

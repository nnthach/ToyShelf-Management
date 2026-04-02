"use client";

import React from "react";
import BarChartExample from "./components/charts/BarChart";
import AreaChartExample from "./components/charts/AreaChart";
import { PieChartExample } from "./components/charts/PieChart";
import MostSellStore from "./components/MostSellStore";
import BadFeedBackStore from "./components/BadFeedbackStore";
import FeedbackList from "./components/FeedbackList";
import { ArrowRight, Box, Server } from "lucide-react";
import { useAuth } from "@/src/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { getWarehouseDetailAPI } from "@/src/services/warehouse.service";
import WarehouseBannerInfo from "./components/WarehouseBannerInfo";
import StatCardWithButton from "@/src/components/StatCardWithButton";
import { useRouter } from "next/navigation";

export default function WarehouseDashboard() {
  const { warehouse } = useAuth();
  const router = useRouter();

  const warehouseId = warehouse?.warehouseId;

  const {
    data: warehouseDetail,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["warehouse", warehouseId],
    queryFn: () => getWarehouseDetailAPI(warehouseId!, { role: "Manager" }),
    select: (res) => res.data,
    enabled: !!warehouseId,
  });

  return (
    <div className="space-y-6">
      <WarehouseBannerInfo warehouseDetail={warehouseDetail} />

      {/*Statistic card */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCardWithButton
          title="Hàng tồn kho"
          value="$250,520"
          change="+$30,215"
          changePercent="+12%"
          icon={Box}
          color="bg-green-100 text-green-900"
          action={() => router.push(`/warehouse/inventory`)}
        />

        <StatCardWithButton
          title="Kệ"
          value="10"
          change="+2,815"
          changePercent="+18%"
          icon={Server}
          color="bg-pink-100 text-pink-900"
          action={() => router.push(`/warehouse/shelf-inventory`)}
        />

        <StatCardWithButton
          title="Đơn giao hàng"
          value="10"
          change="+2,815"
          changePercent="+18%"
          icon={Server}
          color="bg-blue-100 text-blue-900"
          action={() => router.push(`/warehouse/refill-stocks`)}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-4 gap-4 mb-4">
        <div className="bg-background rounded-lg col-span-1 h-[50vh] w-full">
          <h1>Dashboard</h1>
        </div>
        <div className="bg-background rounded-lg col-span-3 h-[50vh] w-full">
          alo
        </div>
        <div className="bg-background p-4 rounded-lg lg:col-span-2 xl:col-span-1 2xl:col-span-2 min-h-[50vh]">
          <AreaChartExample />
        </div>
        <div className="bg-background p-4 rounded-lg">
          <MostSellStore />
        </div>
        <div className="bg-background p-4 rounded-lg">
          <PieChartExample />
        </div>
        <div className="bg-background p-4 rounded-lg min-h-[50vh]">
          <FeedbackList />
        </div>
        <div className="bg-background p-4 rounded-lg lg:col-span-2 xl:col-span-1 2xl:col-span-2 min-h-[50vh]">
          <BarChartExample />
        </div>
        <div className="bg-background p-4 rounded-lg">
          <BadFeedBackStore />
        </div>
      </div>
    </div>
  );
}

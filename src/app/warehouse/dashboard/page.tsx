"use client";

import React from "react";
import { useAuth } from "@/src/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { getWarehouseDetailAPI } from "@/src/services/warehouse.service";
import WarehouseBannerInfo from "./components/WarehouseBannerInfo";
import { useRouter } from "next/navigation";
import TotalShipOrderAreaChart from "./components/charts/TotalShipOrderBarChart";
import WarehouseStatCard from "./components/WarehouseStatCard";
import LoadingPageComponent from "@/src/components/LoadingPageComponent";

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

  if (isLoading) {
    return <LoadingPageComponent />;
  }

  return (
    <div className="space-y-6">
      <WarehouseBannerInfo warehouseDetail={warehouseDetail} />

      {/*Statistic card */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <WarehouseStatCard />
      </div>

      <div className="grid grid-cols-1 mb-4">
        <div className="bg-background rounded-lg lg:col-span-4 min-h-[70vh] p-4 border border-gray-100 shadow-sm">
          <TotalShipOrderAreaChart />
        </div>
      </div>
    </div>
  );
}

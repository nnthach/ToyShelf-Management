"use client";

import { ArrowLeft, ArrowRight, Box, Server, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import { Button } from "@/src/styles/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { getWarehouseDetailAPI } from "@/src/services/warehouse.service";
import TotalShipOrderBarChart from "./components/charts/TotalShipOrderBarChart";
import WarehouseBannerInfo from "./components/WarehouseBannerInfo";
import StatCardWithButton from "@/src/components/StatCardWithButton";
import WarehouseStatCard from "./components/WarehouseStatCard";
import LoadingPageComponent from "@/src/components/LoadingPageComponent";

export default function ViewWarehouseDetailPage() {
  const { id: warehouseId } = useParams<{ id: string }>();
  const router = useRouter();

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
      {/*Header */}
      <div className="flex items-center justify-between">
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
      <WarehouseBannerInfo warehouseDetail={warehouseDetail} />

      {/*Statistic card */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <WarehouseStatCard warehouseId={warehouseId} />
      </div>

      {/*Content */}
      <div className="grid grid-cols-1 mb-4">
        <div className="bg-background rounded-lg lg:col-span-4 min-h-[70vh] p-4 border border-gray-100 shadow-sm">
          <TotalShipOrderBarChart />
        </div>
      </div>
    </div>
  );
}

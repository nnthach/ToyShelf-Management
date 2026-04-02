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
        <StatCardWithButton
          title="Đơn hàng"
          value="100"
          change="+10"
          changePercent="+12%"
          icon={Box}
          color="bg-green-100 text-green-900"
        />

        <StatCardWithButton
          title="Kệ Tồn Kho"
          value="10"
          change="+2"
          changePercent="+18%"
          icon={Server}
          color="bg-pink-100 text-pink-900"
        />

        <StatCardWithButton
          title="Hàng Tồn kho"
          value="150"
          change="+20"
          changePercent="+18%"
          icon={Box}
          color="bg-blue-100 text-blue-900"
          action={() =>
            router.push(`/admin/warehouse/${warehouseId}/inventory`)
          }
        />
        <StatCardWithButton
          title="Nhân viên giao hàng"
          value="15"
          change="+0"
          changePercent="+18%"
          icon={User}
          color="bg-yellow-100 text-yellow-900"
        />
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

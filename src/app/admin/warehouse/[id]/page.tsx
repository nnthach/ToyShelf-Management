"use client";

import { ArrowLeft, ArrowRight, Box, Server, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import { Button } from "@/src/styles/components/ui/button";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { getWarehouseDetailAPI } from "@/src/services/warehouse.service";
import TotalShipOrderBarChart from "./components/charts/TotalShipOrderBarChart";
import WarehouseStatCard from "./components/WarehouseStatCard";
import WarehouseBannerInfo from "./components/WarehouseBannerInfo";

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
        <WarehouseStatCard
          title="Đơn hàng"
          value="100"
          change="+10"
          changePercent="+12%"
          icon={Box}
          color="bg-green-100 text-green-900"
        />

        <WarehouseStatCard
          title="Kệ Tồn Kho"
          value="10"
          change="+2"
          changePercent="+18%"
          icon={Server}
          color="bg-pink-100 text-pink-900"
        />

        <WarehouseStatCard
          title="Hàng Tồn kho"
          value="150"
          change="+20"
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
                router.push(`/admin/warehouse/${warehouseId}/inventory`)
              }
            >
              <ArrowRight size={16} />
            </span>
          }
        />
        <WarehouseStatCard
          title="Nhân viên giao hàng"
          value="15"
          change="+0"
          changePercent="+18%"
          icon={User}
          color="bg-yellow-100 text-yellow-900"
        />
      </div>

      {/*Content */}
      <div className="">
        <div className="grid grid-cols-1 mb-4">
          <div className="bg-background shadow-sm rounded-lg col-span-3 h-[70vh] w-full">
            <TotalShipOrderBarChart />
          </div>
        </div>
      </div>
    </div>
  );
}

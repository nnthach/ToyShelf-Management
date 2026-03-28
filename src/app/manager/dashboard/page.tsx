"use client";

import React from "react";
import BarChartExample from "./components/charts/BarChart";
import AreaChartExample from "./components/charts/AreaChart";
import { PieChartExample } from "./components/charts/PieChart";
import { ArrowRight, Box, Server } from "lucide-react";
import { useAuth } from "@/src/hooks/useAuth";
import BannerInfo from "./components/BannerInfo";
import StatCardWithButton from "@/src/components/StatCardWithButton";
import { useRouter } from "next/navigation";

export default function StoreManagerDashboard() {
  const { user, myStore } = useAuth();
  const router = useRouter();

  return (
    <div className="space-y-6">
      {/* Banner thông tin Manager */}
      <BannerInfo />

      {/*Statistic card */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCardWithButton
          title="Hàng tồn kho"
          value="$250,520"
          change="+$30,215"
          changePercent="+12%"
          icon={Box}
          color="bg-green-100 text-green-900"
          action={
            <span
              className={`inline-flex items-center justify-center h-7 w-10 rounded-2xl border 
  border-current bg-green-100 text-green-900
  bg-opacity-30 hover:bg-opacity-50
  transition-all cursor-pointer shadow-sm active:scale-95`}
              onClick={() =>
                router.push(
                  `/manager/inventory?locationId=${myStore?.storeLocationId}`,
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
          icon={Server}
          color="bg-pink-100 text-pink-900"
          action={
            <span
              className={`inline-flex items-center justify-center h-7 w-10 rounded-2xl border 
  border-current bg-pink-100 text-pink-900
  bg-opacity-30 hover:bg-opacity-50
  transition-all cursor-pointer shadow-sm active:scale-95`}
              onClick={() => router.push(`/manager/shelf-inventory`)}
            >
              <ArrowRight size={16} />
            </span>
          }
        />

        <StatCardWithButton
          title="Đơn hàng"
          value="15"
          change="+2,815"
          changePercent="+18%"
          icon={Server}
          color="bg-blue-100 text-blue-900"
          action={
            <span
              className={`inline-flex items-center justify-center h-7 w-10 rounded-2xl border 
  border-current bg-blue-100 text-blue-900
  bg-opacity-30 hover:bg-opacity-50
  transition-all cursor-pointer shadow-sm active:scale-95`}
              onClick={() => router.push(`/manager/orders`)}
            >
              <ArrowRight size={16} />
            </span>
          }
        />

        <StatCardWithButton
          title="Đặt hàng"
          value="15"
          change="+2,815"
          changePercent="+18%"
          icon={Server}
          color="bg-yellow-100 text-yellow-900"
          action={
            <span
              className={`inline-flex items-center justify-center h-7 w-10 rounded-2xl border 
  border-current bg-yellow-100 text-yellow-900
  bg-opacity-30 hover:bg-opacity-50
  transition-all cursor-pointer shadow-sm active:scale-95`}
              onClick={() => router.push(`/manager/refill-stock`)}
            >
              <ArrowRight size={16} />
            </span>
          }
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-4 gap-4 mb-4">
        <div className="bg-background p-4 rounded-lg lg:col-span-2 xl:col-span-1 2xl:col-span-2 min-h-[50vh]">
          <AreaChartExample />
        </div>
        <div className="bg-background p-4 rounded-lg">
          <PieChartExample />
        </div>

        <div className="bg-background p-4 rounded-lg lg:col-span-2 xl:col-span-1 2xl:col-span-2 min-h-[50vh]">
          <BarChartExample />
        </div>
      </div>
    </div>
  );
}

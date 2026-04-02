import React from "react";
import { PieChartExample } from "./components/charts/PieChart";
import { Box, ClipboardList, Star } from "lucide-react";
import StatCard from "@/src/components/StatCard";
import TotalRevenueChart from "./components/charts/TotalRevenueChart";
import TotalOrderChart from "./components/charts/TotalOrderChart";
import TopThreeStore from "./components/TopThreeStore";
import TopThreeProduct from "./components/TopThreeProduct";
import TopThreePartner from "./components/TopThreePartner";
import WarehouseMap from "./components/WarehouseMap";

export default function AdminDashboard() {
  return (
    <div className="space-y-4 mb-4">
      <div className="flex flex-col">
        <h1 className="text-2xl font-bold dark:text-foreground">Tổng quan</h1>
        <p className="text-gray-500 dark:text-gray-200">Tổng quan hệ thống</p>
      </div>

      {/*Statistic card */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Doanh thu"
          value="250,520 VND"
          change="+30,215 VND"
          changePercent="+12%"
          icon={Box}
          color="bg-green-100 text-green-900"
        />

        <StatCard
          title="Đơn hàng"
          value="200"
          change="+25"
          changePercent="+15%"
          icon={Star}
          color="bg-yellow-100 text-yellow-900"
        />
        <StatCard
          title="Đối tác"
          value="53"
          change="+2"
          changePercent="+18%"
          icon={ClipboardList}
          color="bg-blue-100 text-blue-900"
        />
        <StatCard
          title="Cửa hàng"
          value="230"
          change="+2,815"
          changePercent="+18%"
          icon={ClipboardList}
          color="bg-pink-100 text-pink-900"
        />
      </div>

      {/* Sử dụng hệ 4 cột làm chuẩn */}
      <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-4 gap-4">
        {/* HÀNG 1: Tổng = 4 */}
        <div className="bg-background rounded-lg col-span-1 md:col-span-2 2xl:col-span-4 min-h-[500px] p-4 border border-gray-100 shadow-sm">
          <TotalRevenueChart />
        </div>

        {/* HÀNG 2: Tổng 3 + 1 = 4 */}
        <div className="bg-background p-4 rounded-lg col-span-1 md:col-span-2 2xl:col-span-3 min-h-[450px] shadow-sm border border-gray-100">
          <TotalOrderChart />
        </div>
        <div className="bg-background p-4 rounded-lg col-span-1 md:col-span-2 2xl:col-span-1 shadow-sm border border-gray-100">
          <TopThreeStore />
        </div>

        {/* HÀNG 3: Tổng 1 + 1 + 1 + 1 = 4 (Không bao giờ lệch) */}
        <div className="bg-background p-4 rounded-lg col-span-1 md:col-span-1 2xl:col-span-1 shadow-sm border border-gray-100">
          <TopThreeProduct />
        </div>
        <div className="bg-background p-4 rounded-lg col-span-1 md:col-span-1 2xl:col-span-1 shadow-sm border border-gray-100">
          <TopThreePartner />
        </div>
        <div className="bg-background p-4 rounded-lg col-span-1 md:col-span-1 2xl:col-span-1 shadow-sm border border-gray-100">
          <PieChartExample />
        </div>
        <div className="bg-background p-4 rounded-lg col-span-1 md:col-span-1 2xl:col-span-1 shadow-sm border border-gray-100">
          <PieChartExample />
        </div>

        {/* HÀNG 4: Tổng 1 + 3 = 4 */}
        <div className="bg-background rounded-lg col-span-1 md:col-span-1 2xl:col-span-1 h-[50vh] w-full shadow-sm flex items-center justify-center border border-gray-100">
          <h1 className="text-xl font-bold">Dashboard</h1>
        </div>
        <div className="bg-background rounded-lg col-span-1 md:col-span-1 2xl:col-span-3 p-2 h-[50vh] w-full border border-gray-100 shadow-sm">
          <WarehouseMap />
        </div>
      </div>
    </div>
  );
}

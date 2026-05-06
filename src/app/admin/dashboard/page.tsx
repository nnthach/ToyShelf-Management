import React from "react";
import { PieChartExample } from "./components/charts/PieChart";
import TotalRevenueChart from "./components/charts/TotalRevenueChart";
import TotalOrderChart from "./components/charts/TotalOrderChart";
import TopThreeStore from "./components/TopThreeStore";
import TopThreeProduct from "./components/TopThreeProduct";
import TopThreePartner from "./components/TopThreePartner";
import WarehouseMap from "./components/WarehouseMap";
import AdminStatCard from "./components/AdminStatCard";

export default function AdminDashboard() {
  return (
    <div className="space-y-4 mb-4">
      <div className="flex flex-col">
        <h1 className="text-2xl font-bold dark:text-foreground">Tổng quan</h1>
        <p className="text-gray-500 dark:text-gray-200">Tổng quan hệ thống</p>
      </div>

      {/*Statistic card */}
      <AdminStatCard />

      {/* Sử dụng hệ 4 cột làm chuẩn */}
      <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-4 gap-4">
        {/* HÀNG 1: Tổng = 4 */}
        <div className="bg-background rounded-lg col-span-1 md:col-span-2 2xl:col-span-4 min-h-[500px] p-4 border border-gray-100 shadow-sm">
          <TotalRevenueChart />
        </div>

        {/* HÀNG 2: Tổng 3 + 1 = 4 */}
        <div className="bg-background p-4 rounded-lg col-span-1 md:col-span-2 2xl:col-span-3 h-[500px] shadow-sm border border-gray-100">
          <TotalOrderChart />
        </div>
        <div className="bg-background p-4 rounded-lg col-span-1 md:col-span-2 2xl:col-span-1 h-[500px] shadow-sm border border-gray-100">
          <TopThreeStore />
        </div>

        {/* HÀNG 3: Tổng 1 + 1 + 1 + 1 = 4 (Không bao giờ lệch) */}
        <div className="bg-background p-4 rounded-lg col-span-1 md:col-span-1 2xl:col-span-1 shadow-sm border min-h-[520px] border-gray-100">
          <TopThreeProduct />
        </div>
        <div className="bg-background p-4 rounded-lg col-span-1 md:col-span-1 2xl:col-span-1 shadow-sm border min-h-[520px] border-gray-100">
          <TopThreePartner />
        </div>
        <div className="bg-background rounded-lg col-span-1 lg:col-span-2 2xl:col-span-2 p-2 w-full border border-gray-100 shadow-sm">
          <WarehouseMap />
        </div>
      </div>
    </div>
  );
}

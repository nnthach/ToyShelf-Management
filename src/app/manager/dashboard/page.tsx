"use client";

import React from "react";
import { useAuth } from "@/src/hooks/useAuth";
import BannerInfo from "./components/BannerInfo";
import { useRouter } from "next/navigation";
import StoreStatCard from "./components/StoreStatCard";
import LoadingPageComponent from "@/src/components/LoadingPageComponent";
import TotalRevenueChart from "./components/charts/TotalRevenueChart";
import TotalOrderChart from "./components/charts/TotalOrderChart";
import TopThreeProduct from "./components/charts/TopThreeProduct";

export default function StoreManagerDashboard() {
  const { user, myStore } = useAuth();
  const router = useRouter();

  if (!myStore) {
    return <LoadingPageComponent />;
  }

  return (
    <div className="space-y-6">
      {/* Banner thông tin Manager */}
      <BannerInfo />

      {/*Statistic card */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StoreStatCard
          storeId={myStore?.storeId || ""}
          inventoryLocationId={myStore?.storeLocationId || ""}
        />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-4 gap-4 mb-4">
        <div className="bg-background rounded-lg lg:col-span-4 min-h-[70vh] p-4 border border-gray-100 shadow-sm">
          <TotalRevenueChart />
        </div>

        <div className="bg-background p-4 rounded-lg lg:col-span-3 min-h-[60vh] shadow-sm border border-gray-100">
          <TotalOrderChart />
        </div>
        <div className="bg-background p-4 rounded-lg shadow-sm border border-gray-100">
          <TopThreeProduct />
        </div>
      </div>
    </div>
  );
}

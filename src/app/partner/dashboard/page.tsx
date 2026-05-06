"use client";

import React from "react";
import StoreMap from "./components/StoreMap";
import { useAuth } from "@/src/hooks/useAuth";
import PartnerStatCard from "./components/PartnerStatCard";
import TotalRevenueChart from "./components/charts/TotalRevenueChart";
import TotalOrderChart from "./components/charts/TotalOrderChart";
import TopThreeStore from "./components/TopThreeStore";
import TopThreeProduct from "./components/TopThreeProduct";
import PartnerBannerInfo from "./components/PartnerBannerInfo";

export default function PartnerAdminDashboard() {
  const { partner } = useAuth();

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-4">
        <PartnerBannerInfo />
      </div>

      {/*Statistic card */}
      <PartnerStatCard />

      <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-4 gap-4">
        {/*Chart total revenue */}
        <div className="bg-background rounded-lg col-span-1 md:col-span-2 2xl:col-span-4 min-h-[500px] p-4 border border-gray-100 shadow-sm">
          <TotalRevenueChart />
        </div>
        <div className="bg-background p-4 rounded-lg col-span-1 md:col-span-2 2xl:col-span-4 min-h-[500px] shadow-sm border border-gray-100">
          <TotalOrderChart />
        </div>

        <div className="bg-background p-4 rounded-lg col-span-1 md:col-span-1 2xl:col-span-1 min-h-[520px] shadow-sm border border-gray-100">
          <TopThreeStore />
        </div>

        <div className="bg-background p-4 rounded-lg col-span-1 md:col-span-1 2xl:col-span-1 min-h-[520px] shadow-sm border border-gray-100">
          <TopThreeProduct />
        </div>

        <div className="bg-background rounded-lg col-span-2 md:col-span-2 2xl:col-span-2 p-2 min-h-[50vh] w-full border border-gray-100 shadow-sm">
          <StoreMap />
        </div>
      </div>
    </>
  );
}

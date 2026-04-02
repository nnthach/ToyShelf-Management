"use client";

import React from "react";
import StoreMap from "./components/StoreMap";
import { useAuth } from "@/src/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { getPartnerDetailAPI } from "@/src/services/partner.service";
import LoadingPageComponent from "@/src/components/LoadingPageComponent";
import PartnerStatCard from "./components/PartnerStatCard";
import TotalRevenueChart from "./components/charts/TotalRevenueChart";
import TotalOrderChart from "./components/charts/TotalOrderChart";
import TopThreeStore from "./components/TopThreeStore";
import { TargetRevenueChart } from "./components/charts/TargetRevenueChart";
import TopThreeProduct from "./components/TopThreeProduct";
import PartnerBannerInfo from "./components/PartnerBannerInfo";

export default function AdminDashboard() {
  const { partner, isLoading: isAuthLoading } = useAuth();

  const partnerId = partner?.partnerId;

  const { data: partnerDetail, isLoading: isDetailLoading } = useQuery({
    queryKey: ["partner", partnerId],
    queryFn: () => getPartnerDetailAPI(partnerId!),
    select: (res) => res.data,
    enabled: !!partnerId,
  });

  if (isDetailLoading) return <LoadingPageComponent />;

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <PartnerBannerInfo partnerDetail={partnerDetail} />
      </div>

      {/*Statistic card */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <PartnerStatCard />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-4 gap-4 mb-4">
        {/*Chart total revenue */}
        <div className="bg-background rounded-lg lg:col-span-4 min-h-[70vh] p-4 border border-gray-100 shadow-sm">
          <TotalRevenueChart />
        </div>
        <div className="bg-background p-4 rounded-lg lg:col-span-3 min-h-[60vh] shadow-sm border border-gray-100">
          <TotalOrderChart />
        </div>

        <div className="bg-background p-4 rounded-lg shadow-sm border border-gray-100">
          <TopThreeStore />
        </div>
        {/*Chart target value */}
        <div className="bg-background rounded-lg col-span-1 w-full">
          <TargetRevenueChart />
        </div>

        <div className="bg-background p-4 rounded-lg shadow-sm border border-gray-100">
          <TopThreeProduct />
        </div>
        <div className="bg-background p-4 rounded-lg shadow-sm border border-gray-100"></div>
        <div className="bg-background p-4 rounded-lg shadow-sm border border-gray-100"></div>

        <div className="bg-background rounded-lg col-span-1 h-[50vh] w-full shadow-sm">
          <h1>Dashboard</h1>
        </div>
        <div className="bg-background rounded-lg col-span-3 p-2 h-[50vh] w-full border border-gray-100 shadow-sm">
          <StoreMap />
        </div>
      </div>
    </>
  );
}

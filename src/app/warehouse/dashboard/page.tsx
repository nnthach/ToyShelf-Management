import React from "react";
import BarChartExample from "./components/charts/BarChart";
import AreaChartExample from "./components/charts/AreaChart";
import { PieChartExample } from "./components/charts/PieChart";
import MostSellStore from "./components/MostSellStore";
import BadFeedBackStore from "./components/BadFeedbackStore";
import FeedbackList from "./components/FeedbackList";
import StatCard from "@/src/components/StatCard";
import { Box, Server } from "lucide-react";
import Image from "next/image";

export default function AdminDashboard() {
  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        {/* Banner chào*/}
        <div className="relative rounded-xl overflow-hidden shadow-md col-span-3">
          {/* Background image */}
          <Image
            src="/images/banner_admin_hello.jpg"
            alt="Banner"
            fill
            className="object-cover"
          />

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-linear-to-r from-black/90 to-blue-700/70"></div>

          {/* Content */}
          <div className="relative z-10 px-6 py-6 text-white flex items-center justify-between">
            <div className="flex flex-col gap-1 space-y-3">
              {/* Company Name */}
              <h2 className="text-2xl font-bold tracking-wide">
                {/* Xin chào, {partner?.fullName} */}
              </h2>

              {/* Partner Tier */}
              <div className="flex items-center gap-2 text-sm">
                <span className="px-2 py-0.5 rounded-md bg-blue-500/80 text-white text-xs font-medium">
                  {/* {partnerDetail?.partnerTierName} */}
                </span>

                <span className="text-white/70 text-xs">
                  {/* Uư tiên: {partnerDetail?.partnerTierPriority} */}
                </span>
              </div>

              {/* Representative */}
              <p className="text-sm text-white/80">
                {/* Công ty: {partnerDetail?.companyName} */}
              </p>

              {/* Email */}
              {/* <p className="text-sm text-white/60">{partner?.email}</p> */}
            </div>
          </div>
        </div>

        {/*Thông tin cá nhân */}
        <div className="bg-background shadow-sm rounded-lg col-span-1 h-[30vh] w-full">
          <h1>Alo alo</h1>
        </div>
      </div>

      {/*Statistic card */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <StatCard
          title="Sản phẩm"
          value="$250,520"
          change="+$30,215"
          changePercent="+12%"
          icon={Box}
          color="bg-green-100 text-green-900"
        />
        <StatCard
          title="Kệ"
          value="10"
          change="+2,815"
          changePercent="+18%"
          icon={Server}
          color="bg-pink-100 text-pink-900"
        />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-4 gap-4 mb-4">
        <div className="bg-background rounded-lg col-span-1 h-[50vh] w-full">
          <h1>Dashboard</h1>
        </div>
        <div className="bg-background rounded-lg col-span-3 h-[50vh] w-full">
          alo
        </div>
        <div className="bg-background p-4 rounded-lg lg:col-span-2 xl:col-span-1 2xl:col-span-2 min-h-[50vh]">
          <AreaChartExample />
        </div>
        <div className="bg-background p-4 rounded-lg">
          <MostSellStore />
        </div>
        <div className="bg-background p-4 rounded-lg">
          <PieChartExample />
        </div>
        <div className="bg-background p-4 rounded-lg min-h-[50vh]">
          <FeedbackList />
        </div>
        <div className="bg-background p-4 rounded-lg lg:col-span-2 xl:col-span-1 2xl:col-span-2 min-h-[50vh]">
          <BarChartExample />
        </div>
        <div className="bg-background p-4 rounded-lg">
          <BadFeedBackStore />
        </div>
      </div>
    </>
  );
}

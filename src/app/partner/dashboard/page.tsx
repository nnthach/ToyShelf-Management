"use client";

import React from "react";
import BarChartExample from "./components/charts/BarChart";
import AreaChartExample from "./components/charts/AreaChart";
import { PieChartExample } from "./components/charts/PieChart";
import MostSellStore from "./components/MostSellStore";
import BadFeedBackStore from "./components/BadFeedbackStore";
import FeedbackList from "./components/FeedbackList";
import StoreMap from "./components/StoreMap";
import StatCard from "@/src/components/StatCard";
import { Box, Server, Store } from "lucide-react";
import { useAuth } from "@/src/hooks/useAuth";
import Image from "next/image";

export default function AdminDashboard() {
  const { user } = useAuth();

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
          <div className="absolute inset-0 bg-linear-to-r from-black/90  to-blue-700/70"></div>

          {/* Content */}
          <div className="relative z-10 px-6 py-6 text-white flex items-center justify-between">
            {/* BÊN TRÁI */}
            <div className="flex flex-col">
              <h2 className="text-xl font-semibold tracking-wide">
                Xin chào đối tác, {user?.fullName || "Đối tác"}!
              </h2>

              <p className="text-sm text-white/80">
                Người đại diện: Nguyễn Ngọc Thạch
              </p>

              <p className="text-sm text-white/60">nguyenthach@gmail.com</p>
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
          title="Doanh thu"
          value="$250,520"
          change="+$30,215"
          changePercent="+12%"
          icon={Box}
          color="bg-green-100 text-green-900"
        />

        <StatCard
          title="Cửa hàng"
          value="15"
          change="+1,647"
          changePercent="+15%"
          icon={Store}
          color="bg-yellow-100 text-yellow-900"
        />

        <StatCard
          title="Kệ"
          value="10"
          change="+2,815"
          changePercent="+18%"
          icon={Server}
          color="bg-pink-100 text-pink-900"
        />

        <StatCard
          title="Tồn kho"
          value="15"
          change="+2,815"
          changePercent="+18%"
          icon={Box}
          color="bg-blue-100 text-blue-900"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-4 gap-4 mb-4">
        <div className="bg-background rounded-lg col-span-1 h-[50vh] w-full">
          <h1>Dashboard</h1>
        </div>
        <div className="bg-background rounded-lg col-span-3 h-[50vh] w-full">
          <StoreMap />
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

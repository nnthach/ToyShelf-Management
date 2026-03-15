"use client";

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
import { useAuth } from "@/src/hooks/useAuth";

export default function StoreManagerDashboard() {
  const { user, myStore } = useAuth();

  console.log("user", user);
  console.log("myStore", myStore);

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <div className="relative rounded-xl overflow-hidden shadow-lg col-span-3 min-h-[180px] flex items-center">
          {/* Background image với overlay chuyên nghiệp hơn */}
          <Image
            src="/images/banner_admin_hello.jpg"
            alt="Manager Banner"
            fill
            className="object-cover"
          />

          {/* Gradient overlay: Chuyển từ Indigo sang Blue để tạo cảm giác quản lý tin cậy */}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-blue-900/80 to-transparent"></div>

          {/* Content */}
          <div className="relative z-10 px-8 py-6 text-white w-full flex justify-between items-center">
            <div className="space-y-3">
              {/* Lời chào & Tên Manager */}
              <h2 className="text-2xl font-bold tracking-wide">
                Xin chào, {user?.fullName}
              </h2>

              <div className="flex flex-wrap items-center gap-3">
                {/* Email */}
                <span className="text-sm text-white italic">{user?.email}</span>
              </div>

              {/* Tên Cửa hàng đang quản lý */}
              <div className="flex items-center gap-2 pt-2">
                <div>
                  <p className="text-xs text-white/50 uppercase font-bold">
                    Cửa hàng đang quản lý
                  </p>
                  <p className="text-lg font-semibold text-blue-100">
                    {myStore?.storeName || "Chưa xác định cửa hàng"}
                  </p>
                </div>
              </div>
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

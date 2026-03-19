"use client";

import React, { useEffect, useState } from "react";
import BarChartExample from "./components/charts/BarChart";
import AreaChartExample from "./components/charts/AreaChart";
import { PieChartExample } from "./components/charts/PieChart";
import MostSellStore from "./components/MostSellStore";
import BadFeedBackStore from "./components/BadFeedbackStore";
import FeedbackList from "./components/FeedbackList";
import StoreMap from "./components/StoreMap";
import StatCard from "@/src/components/StatCard";
import { Box, CalendarDays, Moon, Server, Store, Sun } from "lucide-react";
import { useAuth } from "@/src/hooks/useAuth";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { getPartnerDetailAPI } from "@/src/services/partner.service";
import LoadingPageComponent from "@/src/components/LoadingPageComponent";

export default function AdminDashboard() {
  const { partner, isLoading: isAuthLoading } = useAuth();

  const partnerId = partner?.partnerId;

  const { data: partnerDetail, isLoading: isDetailLoading } = useQuery({
    queryKey: ["partner", partnerId],
    queryFn: () => getPartnerDetailAPI(partnerId!),
    select: (res) => res.data,
    enabled: !!partnerId,
  });

  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return "Chào buổi sáng!";
    if (hour < 18) return "Chào buổi chiều!";
    return "Chào buổi tối!";
  };

  if (isAuthLoading) return <LoadingPageComponent />;

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
                Xin chào, {partner?.fullName}
              </h2>

              {/* Partner Tier */}
              <div className="flex items-center gap-2 text-sm">
                <span className="px-2 py-0.5 rounded-md bg-blue-500/80 text-white text-xs font-medium">
                  {partnerDetail?.partnerTierName}
                </span>

                <span className="text-white/70 text-xs">
                  Uư tiên: {partnerDetail?.partnerTierPriority}
                </span>
              </div>

              {/* Representative */}
              <p className="text-sm text-white/80">
                Công ty: {partnerDetail?.companyName}
              </p>

              {/* Email */}
              <p className="text-sm text-white/60">{partner?.email}</p>
            </div>
          </div>
        </div>

        {/*Trang trí */}
        <div className="bg-linear-to-br from-white to-blue-50/50 dark:from-zinc-900 dark:to-zinc-800 shadow-sm rounded-xl col-span-1 h-[30vh] w-full flex flex-col p-5 border border-zinc-100 dark:border-zinc-800 relative overflow-hidden">
          {/* Decor background: Hình tròn mờ tạo chiều sâu */}
          <div className="absolute -top-6 -right-6 w-24 h-24 bg-blue-500/5 rounded-full blur-2xl"></div>

          {/* Header: Ngày tháng */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
              <CalendarDays size={18} />
              <span className="text-xs font-semibold uppercase tracking-wider">
                {currentTime.toLocaleDateString("vi-VN", { weekday: "long" })}
              </span>
            </div>
            <div className="text-[10px] text-muted-foreground font-medium">
              {currentTime.toLocaleDateString("vi-VN")}
            </div>
          </div>

          {/* Center: Đồng hồ lớn */}
          <div className="flex-1 flex flex-col justify-center items-center">
            <h3 className="text-3xl font-black text-zinc-800 dark:text-white tracking-tighter">
              {currentTime.toLocaleTimeString("vi-VN", {
                hour: "2-digit",
                minute: "2-digit",
              })}
              <span className="text-sm font-normal text-muted-foreground ml-1">
                {currentTime.getSeconds().toString().padStart(2, "0")}
              </span>
            </h3>
            <p className="text-sm font-medium text-zinc-500 mt-1">
              {getGreeting()}
            </p>
          </div>

          {/* Footer: Thông tin thời tiết "giả lập" hoặc icon decor */}
          <div className="mt-auto pt-4 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              {/* Thay đổi icon theo giờ */}
              {currentTime.getHours() >= 6 && currentTime.getHours() < 18 ? (
                <Sun className="text-orange-400" size={20} />
              ) : (
                <Moon className="text-indigo-400" size={20} />
              )}
              <span className="text-sm font-bold text-zinc-700 dark:text-zinc-300">
                28°C
              </span>
            </div>
            <div className="text-[11px] text-zinc-400 italic">
              TP. Hồ Chí Minh
            </div>
          </div>
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

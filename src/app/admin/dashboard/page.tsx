import React from "react";
import BarChartExample from "./components/charts/BarChart";
import AreaChartExample from "./components/charts/AreaChart";
import { PieChartExample } from "./components/charts/PieChart";
import MostSellStore from "./components/MostSellStore";
import BadFeedBackStore from "./components/BadFeedbackStore";
import FeedbackList from "./components/FeedbackList";
import StoreMap from "./components/StoreMap";
import { Box, ClipboardList, Star } from "lucide-react";
import StatCard from "@/src/components/StatCard";

export default function AdminDashboard() {

  return (
    <>
      <div className="flex flex-col mb-4">
        <h1 className="text-2xl font-bold dark:text-foreground">
          Tổng quan
        </h1>
        <p className="text-gray-500 dark:text-gray-200">Tổng quan hệ thống</p>
      </div>

      {/*Statistic card */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <StatCard
          title="Revenue"
          value="$250,520"
          change="+$30,215"
          changePercent="+12%"
          icon={Box}
          color="bg-green-100 text-green-900"
        />

        <StatCard
          title="Sales"
          value="10,980"
          change="+1,647"
          changePercent="+15%"
          icon={Star}
          color="bg-yellow-100 text-yellow-900"
        />

        <StatCard
          title="Orders"
          value="15,640"
          change="+2,815"
          changePercent="+18%"
          icon={ClipboardList}
          color="bg-pink-100 text-pink-900"
        />

        <StatCard
          title="Partners"
          value="15"
          change="+2,815"
          changePercent="+18%"
          icon={ClipboardList}
          color="bg-blue-100 text-blue-900"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-4 gap-4 mb-4">
        <div className="bg-background rounded-lg col-span-1 h-[50vh] w-full shadow-sm shadow-sm">
          <h1>Dashboard</h1>
        </div>
        <div className="bg-background rounded-lg col-span-3 h-[50vh] w-full shadow-sm">
          <StoreMap />
        </div>
        <div className="bg-background p-4 rounded-lg lg:col-span-2 xl:col-span-1 2xl:col-span-2 min-h-[50vh] shadow-sm">
          <AreaChartExample />
        </div>
        <div className="bg-background p-4 rounded-lg shadow-sm">
          <MostSellStore />
        </div>
        <div className="bg-background p-4 rounded-lg shadow-sm">
          <PieChartExample />
        </div>
        <div className="bg-background p-4 rounded-lg min-h-[50vh] shadow-sm">
          <FeedbackList />
        </div>
        <div className="bg-background p-4 rounded-lg lg:col-span-2 xl:col-span-1 2xl:col-span-2 min-h-[50vh] shadow-sm">
          <BarChartExample />
        </div>
        <div className="bg-background p-4 rounded-lg shadow-sm">
          <BadFeedBackStore />
        </div>
      </div>
    </>
  );
}

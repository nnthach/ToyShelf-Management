import React from "react";
import BarChartExample from "./components/charts/BarChart";
import AreaChartExample from "./components/charts/AreaChart";
import { PieChartExample } from "./components/charts/PieChart";
import MostSellStore from "./components/MostSellStore";
import BadFeedBackStore from "./components/BadFeedbackStore";
import FeedbackList from "./components/FeedbackList";
import StoreMap from "./components/StoreMap";
import { ArrowUpRight } from "lucide-react";

type StatCardProps = {
  title: string;
  value: string;
  change: string;
  changePercent: string;
};

function StatCard({ title, value, change, changePercent }: StatCardProps) {
  return (
    <div className="bg-white rounded-xl border shadow-sm p-5 flex flex-col gap-3 hover:shadow-md transition">
      {/* Header */}
      <div className="flex items-center justify-between text-sm text-gray-500">
        <span className="font-bold text-black">{title}</span>
        <span className="flex items-center gap-1 text-green-600 bg-green-50 px-2 py-0.5 rounded-full text-xs font-medium">
          <ArrowUpRight className="w-3 h-3" />
          {changePercent}
        </span>
      </div>

      {/* Value */}
      <div className="text-2xl font-bold text-gray-900">{value}</div>

      {/* Footer */}
      <div className="text-sm text-gray-500">
        <span className="text-green-600 font-medium">{change}</span> from last
        month
      </div>
    </div>
  );
}
export default function AdminDashboard() {
  return (
    <>
      {/*Statistic card */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <StatCard
          title="Revenue"
          value="$250,520"
          change="+$30,215"
          changePercent="+12%"
        />

        <StatCard
          title="Sales"
          value="10,980"
          change="+1,647"
          changePercent="+15%"
        />

        <StatCard
          title="Orders"
          value="15,640"
          change="+2,815"
          changePercent="+18%"
        />

        <StatCard
          title="Partners"
          value="15"
          change="+2,815"
          changePercent="+18%"
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

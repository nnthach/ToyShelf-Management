import React from "react";
import BarChartExample from "./components/charts/BarChart";
import AreaChartExample from "./components/charts/AreaChart";
import { PieChartExample } from "./components/charts/PieChart";
import MostSellStore from "./components/MostSellStore";
import BadFeedBackStore from "./components/BadFeedbackStore";
import FeedbackList from "./components/FeedbackList";

export default function AdminDashboard() {
  return (
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
  );
}

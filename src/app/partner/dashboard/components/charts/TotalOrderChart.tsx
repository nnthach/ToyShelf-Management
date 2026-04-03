"use client";

import ChartFilter from "@/src/components/ChartFilter";
import { useAuth } from "@/src/hooks/useAuth";
import { useDebounce } from "@/src/hooks/useDebounce";
import { getDashboardPartnerChart } from "@/src/services/dashboard.service";
import { ChartItem } from "@/src/types";
import { ViewType } from "@/src/types/SubType";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import {
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Area,
  AreaChart,
} from "recharts";

interface OrderData {
  label: string;
  orders: number;
}

interface DataSources {
  week: OrderData[];
  month: OrderData[];
  year: OrderData[];
}

interface RevenueParams {
  type: ViewType;
  month?: number;
  year?: number;
}

const DATA_SOURCES: DataSources = {
  week: [
    { label: "Thứ 2", orders: 12 },
    { label: "Thứ 3", orders: 18 },
    { label: "Thứ 4", orders: 10 },
    { label: "Thứ 5", orders: 25 },
    { label: "Thứ 6", orders: 20 },
    { label: "Thứ 7", orders: 35 },
    { label: "CN", orders: 40 },
  ],
  month: [
    { label: "T1", orders: 120 },
    { label: "T2", orders: 98 },
    { label: "T3", orders: 150 },
    { label: "T4", orders: 130 },
    { label: "T5", orders: 180 },
    { label: "T6", orders: 170 },
    { label: "T7", orders: 220 },
    { label: "T8", orders: 200 },
    { label: "T9", orders: 260 },
    { label: "T10", orders: 240 },
    { label: "T11", orders: 300 },
    { label: "T12", orders: 350 },
  ],
  year: [
    { label: "2021", orders: 1200 },
    { label: "2022", orders: 1800 },
    { label: "2023", orders: 2400 },
    { label: "2024", orders: 900 },
  ],
};

const TotalOrderChart = () => {
  const { partner } = useAuth();
  const partnerId = partner?.partnerId;

  const [filters, setFilters] = useState({
    viewType: "month" as ViewType,
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
  });

  const debouncedFilters = useDebounce(filters, 1000);

  const queryParams = {
    viewType: debouncedFilters.viewType,
    year: debouncedFilters.year,
    ...(debouncedFilters.viewType === "month" && {
      month: debouncedFilters.month,
    }),
  };

  const { data: orderChart = [], isLoading } = useQuery({
    queryKey: ["orderChart", queryParams],
    queryFn: () => getDashboardPartnerChart(queryParams, partnerId),
    select: (res) => res.data,
    enabled: !!partnerId,
  });

  const totalOrders = orderChart.reduce(
    (acc: number, curr: { totalOrders: number }) => acc + curr.totalOrders,
    0,
  );

  return (
    <div className="flex flex-col h-full w-full bg-white">
      {/* HEADER */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider">
            Tổng đơn hàng theo{" "}
            {filters.viewType === "week"
              ? "tuần này"
              : filters.viewType === "month"
                ? "tháng này"
                : "năm nay"}
          </h3>

          <p className="text-2xl font-bold text-gray-900 mt-1">
            {totalOrders.toLocaleString()}
            <span className="text-base ml-1">đơn</span>
          </p>
        </div>

        <ChartFilter value={filters} onChange={setFilters} />
      </div>

      {/* CHART */}
      <div className="flex-1 min-h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={orderChart}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366F1" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#f0f0f0"
            />

            <XAxis
              dataKey="dateLabel"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#9CA3AF", fontSize: 12 }}
              dy={10}
              ticks={
                filters.viewType === "month"
                  ? orderChart
                      .filter((_: ChartItem, i: number) =>
                        [0, 2, 5, 8, 11, 14, 17, 20, 23, 26, 29].includes(i),
                      )
                      .map((d: ChartItem) => d.dateLabel)
                  : undefined
              }
            />

            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#9CA3AF", fontSize: 12 }}
            />

            <Tooltip
              contentStyle={{
                borderRadius: "12px",
                border: "none",
                boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
              }}
              formatter={(value: number) => [`${value} đơn`, "Đơn hàng"]}
            />

            <Area
              key={filters.viewType}
              type="monotone"
              dataKey="totalOrders"
              stroke="#6366F1"
              strokeWidth={2.5}
              fill="url(#colorOrders)"
              isAnimationActive={true}
              dot={{ fill: "#6366F1", r: 4, strokeWidth: 0 }}
              activeDot={{ r: 6, fill: "#6366F1", strokeWidth: 0 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TotalOrderChart;

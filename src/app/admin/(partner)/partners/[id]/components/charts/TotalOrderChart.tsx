"use client";

import ChartFilter from "@/src/components/ChartFilter";
import { useDebounce } from "@/src/hooks/useDebounce";
import { ViewType } from "@/src/types/SubType";
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
  const [filters, setFilters] = useState({
    viewType: "month" as ViewType,
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
  });

  const timeFrame = filters.viewType;

  const debouncedFilters = useDebounce(filters, 500);

  const totalOrders = DATA_SOURCES[timeFrame].reduce(
    (acc, curr) => acc + curr.orders,
    0,
  );

  useEffect(() => {
    const fetchData = async () => {
      const { viewType, month, year } = debouncedFilters;

      const params: RevenueParams = { type: viewType };

      if (viewType === "month") {
        params.month = month;
        params.year = year;
      } else if (viewType === "year") {
        params.year = year;
      }

      console.log("Orders API:", params);
    };

    fetchData();
  }, [debouncedFilters]);

  return (
    <div className="flex flex-col h-full w-full bg-white">
      {/* HEADER */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider">
            Tổng đơn hàng theo{" "}
            {timeFrame === "week"
              ? "tuần này"
              : timeFrame === "month"
                ? "tháng"
                : "năm"}
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
            data={DATA_SOURCES[timeFrame]}
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
              dataKey="label"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#9CA3AF", fontSize: 12 }}
              dy={10}
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
              type="monotone"
              dataKey="orders"
              stroke="#6366F1"
              strokeWidth={2.5}
              fill="url(#colorOrders)"
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

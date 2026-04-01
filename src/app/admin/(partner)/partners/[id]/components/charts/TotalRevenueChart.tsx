"use client";

import { useState } from "react";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

interface RevenueData {
  label: string;
  revenue: number;
}

interface DataSources {
  week: RevenueData[];
  month: RevenueData[];
  year: RevenueData[];
}

// 2. Khai báo kiểu dữ liệu cho DATA_SOURCES
const DATA_SOURCES: DataSources = {
  week: [
    { label: "Thứ 2", revenue: 45000 },
    { label: "Thứ 3", revenue: 52000 },
    { label: "Thứ 4", revenue: 38000 },
    { label: "Thứ 5", revenue: 65000 },
    { label: "Thứ 6", revenue: 48000 },
    { label: "Thứ 7", revenue: 85000 },
    { label: "CN", revenue: 92000 },
  ],
  month: [
    { label: "T1", revenue: 420000 },
    { label: "T2", revenue: 380000 },
    { label: "T3", revenue: 510000 },
    { label: "T4", revenue: 490000 },
    { label: "T5", revenue: 620000 },
    { label: "T6", revenue: 580000 },
    { label: "T7", revenue: 840000 },
    { label: "T8", revenue: 790000 },
    { label: "T9", revenue: 910000 },
    { label: "T10", revenue: 850000 },
    { label: "T11", revenue: 1100000 },
    { label: "T12", revenue: 1350000 },
  ],
  year: [
    { label: "2021", revenue: 5400000 },
    { label: "2022", revenue: 7200000 },
    { label: "2023", revenue: 8840000 },
    { label: "2024", revenue: 2100000 },
  ],
};

const TotalRevenueChart = ({ isAnimationActive = true }) => {
  const [timeFrame, setTimeFrame] = useState<keyof DataSources>("month");

  const totalAmount = DATA_SOURCES[timeFrame].reduce(
    (acc, curr) => acc + curr.revenue,
    0,
  );
  return (
    <div className="flex flex-col h-full w-full bg-white">
      {/* HEADER: Tên bên trái - Filter bên phải */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider">
            Tổng doanh thu theo{" "}
            {timeFrame === "week"
              ? "tuần này"
              : timeFrame === "month"
                ? "Tháng"
                : "năm"}
          </h3>
          <p className="text-3xl font-bold text-gray-900 mt-1">
            {totalAmount.toLocaleString()}
            <span className="text-2xl">đ</span>
          </p>
        </div>

        {/* BỘ LỌC FILTER */}
        <div className="flex items-center gap-1 p-1 bg-gray-100 rounded-lg">
          {(["week", "month", "year"] as const).map((type) => {
            const isActive = timeFrame === type;
            return (
              <button
                key={type}
                onClick={() => setTimeFrame(type)}
                className={`
          px-4 py-1.5 text-sm font-medium transition-all duration-200 capitalize
          ${
            isActive
              ? "bg-white text-gray-900 shadow-sm rounded-md"
              : "text-gray-500 hover:text-gray-700"
          }
        `}
              >
                {type === "week" ? "Tuần" : type === "month" ? "Tháng" : "Năm"}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex-1 min-h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={DATA_SOURCES[timeFrame]}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <defs>
              {/* Gradient xanh theo tone màu của ToyShelf */}
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#1E88E5" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#1E88E5" stopOpacity={0} />
              </linearGradient>
            </defs>

            {/* Chỉ kẻ grid ngang cho thoáng mắt */}
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#f0f0f0"
            />

            <XAxis
              dataKey="label" // ĐỔI TỪ "month" THÀNH "label" ĐỂ KHỚP VỚI DATA
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#9CA3AF", fontSize: 12 }}
              dy={10}
            />

            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#9CA3AF", fontSize: 12 }}
              // Format lại để hiển thị đơn vị tiền tệ ngắn gọn (vd: 100k, 1M)
              tickFormatter={(value) => {
                if (value >= 1000000) return `${value / 1000000}M`;
                if (value >= 1000) return `${value / 1000}k`;
                return value;
              }}
            />

            <Tooltip
              contentStyle={{
                borderRadius: "12px",
                border: "none",
                boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
              }}
              // Format lại Tooltip để hiển thị đúng số tiền bạn nhập trong DATA_SOURCES
              formatter={(value: number) => [
                `${value.toLocaleString()}đ`,
                "Doanh thu",
              ]}
            />

            <Area
              key={timeFrame} // Key giúp trigger animation khi đổi data
              type="monotone"
              dataKey="revenue"
              stroke="#1E88E5"
              strokeWidth={3}
              fill="url(#colorRevenue)"
              isAnimationActive={isAnimationActive}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TotalRevenueChart;

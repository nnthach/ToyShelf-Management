"use client";

import ChartFilter from "@/src/components/ChartFilter";
import { useDebounce } from "@/src/hooks/useDebounce";
import { useEffect, useMemo, useState } from "react";
import {
  BarChart,
  Bar,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  AreaChart,
  Area,
  LegendProps,
} from "recharts";

type ViewType = "week" | "month" | "year";

interface ShipmentData {
  label: string;
  productDelivery: number;
  shelfDelivery: number;
  productReturn: number;
  shelfReturn: number;
}

interface Params {
  type: ViewType;
  month?: number;
  year?: number;
}

interface LegendPayloadItem {
  value: string;
  color?: string;
  type?: string;
}

// Định nghĩa interface cho props của hàm content
interface CustomLegendProps {
  payload?: LegendPayloadItem[];
}

// week: 7 ngày, year: 12 tháng — static mock
const WEEK_DATA: ShipmentData[] = [
  {
    label: "Thứ 2",
    productDelivery: 12,
    shelfDelivery: 5,
    productReturn: 3,
    shelfReturn: 1,
  },
  {
    label: "Thứ 3",
    productDelivery: 18,
    shelfDelivery: 8,
    productReturn: 5,
    shelfReturn: 2,
  },
  {
    label: "Thứ 4",
    productDelivery: 10,
    shelfDelivery: 4,
    productReturn: 2,
    shelfReturn: 1,
  },
  {
    label: "Thứ 5",
    productDelivery: 25,
    shelfDelivery: 12,
    productReturn: 6,
    shelfReturn: 3,
  },
  {
    label: "Thứ 6",
    productDelivery: 20,
    shelfDelivery: 9,
    productReturn: 4,
    shelfReturn: 2,
  },
  {
    label: "Thứ 7",
    productDelivery: 35,
    shelfDelivery: 15,
    productReturn: 8,
    shelfReturn: 4,
  },
  {
    label: "CN",
    productDelivery: 40,
    shelfDelivery: 18,
    productReturn: 10,
    shelfReturn: 5,
  },
];

const YEAR_DATA: ShipmentData[] = [
  {
    label: "T1",
    productDelivery: 120,
    shelfDelivery: 50,
    productReturn: 30,
    shelfReturn: 10,
  },
  {
    label: "T2",
    productDelivery: 98,
    shelfDelivery: 42,
    productReturn: 25,
    shelfReturn: 8,
  },
  {
    label: "T3",
    productDelivery: 150,
    shelfDelivery: 65,
    productReturn: 38,
    shelfReturn: 14,
  },
  {
    label: "T4",
    productDelivery: 130,
    shelfDelivery: 58,
    productReturn: 32,
    shelfReturn: 11,
  },
  {
    label: "T5",
    productDelivery: 180,
    shelfDelivery: 75,
    productReturn: 45,
    shelfReturn: 16,
  },
  {
    label: "T6",
    productDelivery: 170,
    shelfDelivery: 70,
    productReturn: 42,
    shelfReturn: 15,
  },
  {
    label: "T7",
    productDelivery: 220,
    shelfDelivery: 90,
    productReturn: 55,
    shelfReturn: 20,
  },
  {
    label: "T8",
    productDelivery: 200,
    shelfDelivery: 85,
    productReturn: 50,
    shelfReturn: 18,
  },
  {
    label: "T9",
    productDelivery: 260,
    shelfDelivery: 110,
    productReturn: 65,
    shelfReturn: 24,
  },
  {
    label: "T10",
    productDelivery: 240,
    shelfDelivery: 100,
    productReturn: 60,
    shelfReturn: 22,
  },
  {
    label: "T11",
    productDelivery: 300,
    shelfDelivery: 125,
    productReturn: 75,
    shelfReturn: 28,
  },
  {
    label: "T12",
    productDelivery: 350,
    shelfDelivery: 145,
    productReturn: 88,
    shelfReturn: 32,
  },
];

const MONTH_DATA: ShipmentData[] = Array.from({ length: 30 }, (_, i) => ({
  label: `${i + 1}`,
  productDelivery: [
    12, 18, 10, 25, 20, 35, 40, 15, 22, 28, 33, 19, 24, 30, 16, 21, 27, 38, 14,
    26, 31, 17, 23, 29, 36, 11, 20, 25, 32, 18,
  ][i],
  shelfDelivery: [
    5, 8, 4, 12, 9, 15, 18, 6, 10, 13, 16, 8, 11, 14, 7, 9, 12, 17, 6, 11, 14,
    7, 10, 13, 16, 5, 9, 11, 14, 8,
  ][i],
  productReturn: [
    3, 5, 2, 6, 4, 8, 10, 3, 5, 7, 9, 4, 6, 8, 3, 5, 7, 10, 3, 6, 8, 4, 6, 7, 9,
    3, 5, 6, 8, 4,
  ][i],
  shelfReturn: [
    1, 2, 1, 3, 2, 4, 5, 1, 2, 3, 4, 2, 3, 4, 1, 2, 3, 5, 1, 3, 4, 2, 3, 3, 4,
    1, 2, 3, 4, 2,
  ][i],
}));

const BARS = [
  { key: "productDelivery", label: "Giao hàng SP", color: "#6366F1" },
  { key: "shelfDelivery", label: "Giao hàng Kệ", color: "#06B6D4" },
  { key: "productReturn", label: "Trả hàng SP", color: "#F59E0B" },
  { key: "shelfReturn", label: "Trả hàng Kệ", color: "#F43F5E" },
];
const AREAS = [
  { key: "productDelivery", label: "Giao hàng SP", color: "#6366F1" },
  { key: "shelfDelivery", label: "Giao hàng Kệ", color: "#06B6D4" },
  { key: "productReturn", label: "Trả hàng SP", color: "#F59E0B" },
  { key: "shelfReturn", label: "Trả hàng Kệ", color: "#F43F5E" },
];

const TotalShipOrderAreaChart = () => {
  const [filters, setFilters] = useState({
    viewType: "month" as ViewType,
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
  });

  const timeFrame = filters.viewType;
  const debouncedFilters = useDebounce(filters, 500);

  const chartData = useMemo(() => {
    if (timeFrame === "week") return WEEK_DATA;
    if (timeFrame === "year") return YEAR_DATA;
    return MONTH_DATA;
  }, [timeFrame]);

  const totalAll = chartData.reduce(
    (acc, curr) =>
      acc +
      curr.productDelivery +
      curr.shelfDelivery +
      curr.productReturn +
      curr.shelfReturn,
    0,
  );

  return (
    <div className="flex flex-col h-full w-full bg-white p-2">
      {/* HEADER */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider">
            Tổng đơn giao hàng{" "}
            {timeFrame === "week"
              ? "tuần này"
              : timeFrame === "month"
                ? "tháng"
                : "năm"}
          </h3>

          <p className="text-2xl font-bold text-gray-900 mt-1">
            {totalAll.toLocaleString()}
            <span className="text-base ml-1">đơn</span>
          </p>
        </div>

        <ChartFilter value={filters} onChange={setFilters} />
      </div>

      {/* CHART */}
      <div className="flex-1 min-h-[350px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <defs>
              {AREAS.map((area) => (
                <linearGradient
                  key={area.key}
                  id={`color${area.key}`}
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="5%" stopColor={area.color} stopOpacity={0.4} />
                  <stop offset="95%" stopColor={area.color} stopOpacity={0} />
                </linearGradient>
              ))}
            </defs>

            <XAxis
              dataKey="label"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#9CA3AF", fontSize: 11 }}
              dy={10}
              interval={timeFrame === "month" ? 1 : 0}
            />

            <Tooltip
              shared={true}
              contentStyle={{
                borderRadius: "12px",
                border: "none",
                boxShadow: "0 10px 15px rgba(0,0,0,0.1)",
              }}
            />

            {AREAS.map((area) => (
              <Area
                key={area.key}
                type="monotone"
                dataKey={area.key}
                name={area.label}
                stroke={area.color}
                strokeWidth={3}
                fillOpacity={1}
                fill={`url(#color${area.key})`}
                // stackId="1" // <--- BỎ DÒNG NÀY nếu muốn so sánh thực tế thằng nào cao hơn nằm trên
              />
            ))}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TotalShipOrderAreaChart;

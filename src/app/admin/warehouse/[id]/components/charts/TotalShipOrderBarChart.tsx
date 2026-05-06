"use client";

import ChartFilter from "@/src/components/ChartFilter";
import { useDebounce } from "@/src/hooks/useDebounce";
import { getDashboardWarehouseChart } from "@/src/services/dashboard.service";
import { ChartItem } from "@/src/types";
import { ViewType } from "@/src/types/SubType";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { ResponsiveContainer, Tooltip, XAxis, AreaChart, Area } from "recharts";

type WarehouseChartItem = {
  date: string | Date;
  label: string;
  dateLabel: string;

  shipmentProduct: number;
  shipmentShelf: number;
  returnProduct: number;
  returnShelf: number;
};

const AREAS = [
  { key: "shipmentProduct", label: "Giao hàng SP", color: "#6366F1" },
  { key: "shipmentShelf", label: "Giao hàng Kệ", color: "#06B6D4" },
  { key: "returnProduct", label: "Trả hàng SP", color: "#F59E0B" },
  { key: "returnShelf", label: "Trả hàng Kệ", color: "#F43F5E" },
];

const TotalShipOrderAreaChart = ({ warehouseId }: { warehouseId: string }) => {
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

  const { data: warehouseChart = [] } = useQuery({
    queryKey: ["warehouseChart", queryParams],
    queryFn: () => getDashboardWarehouseChart(queryParams, warehouseId),
    select: (res) => {
      return res.data.dailyStats.map((item: WarehouseChartItem) => {
        const date = new Date(item.date);

        return {
          ...item,

          dateLabel: date.toLocaleDateString("vi-VN"),

          label:
            debouncedFilters.viewType === "month"
              ? date.getDate().toString()
              : debouncedFilters.viewType === "week"
                ? date.toLocaleDateString("vi-VN", { weekday: "short" })
                : `T${Math.ceil(date.getDate() / 7)}`,
        };
      });
    },
    enabled: !!warehouseId,
  });

  const totalAll = warehouseChart?.reduce(
    (sum: number, item: WarehouseChartItem) => {
      return (
        sum +
        item.shipmentProduct +
        item.shipmentShelf +
        item.returnProduct +
        item.returnShelf
      );
    },
    0,
  );

  return (
    <div className="flex flex-col h-full w-full bg-white p-2">
      {/* HEADER */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider">
            Tổng đơn giao hàng{" "}
            {filters.viewType === "week"
              ? "tuần này"
              : filters.viewType === "month"
                ? "tháng này"
                : "năm nay"}
          </h3>

          <p className="text-2xl font-bold text-gray-900 mt-1">
            {totalAll ?? 0}
            <span className="text-base ml-1"> đơn</span>
          </p>
        </div>

        <ChartFilter value={filters} onChange={setFilters} />
      </div>

      {/* CHART */}
      <div className="flex-1 min-h-[350px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={warehouseChart}
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
              ticks={
                filters.viewType === "month"
                  ? warehouseChart
                      .filter((_: ChartItem, i: number) =>
                        [0, 2, 5, 8, 11, 14, 17, 20, 23, 26, 29].includes(i),
                      )
                      .map((d: ChartItem) => d.dateLabel)
                  : undefined
              }
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

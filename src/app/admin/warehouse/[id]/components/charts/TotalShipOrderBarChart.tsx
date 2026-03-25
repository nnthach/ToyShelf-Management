"use client";

import {
  BarChart,
  Legend,
  XAxis,
  YAxis,
  Tooltip,
  Bar,
  ResponsiveContainer,
} from "recharts";

// #region Sample data
const data = [
  {
    name: "Jan",
    RefillStock: 4000,
    RefillShelf: 2400,
  },
  {
    name: "Feb",
    RefillStock: 3000,
    RefillShelf: 1398,
  },
  {
    name: "Mar",
    RefillStock: 2000,
    RefillShelf: 9800,
  },
  {
    name: "Apr",
    RefillStock: 2780,
    RefillShelf: 3908,
  },
  {
    name: "Jun",
    RefillStock: 1890,
    RefillShelf: 4800,
  },
  {
    name: "Jul",
    RefillStock: 2390,
    RefillShelf: 3800,
  },
  {
    name: "Aug",
    RefillStock: 3490,
    RefillShelf: 4300,
  },
];

// #endregion
const TotalShipOrderBarChart = ({ isAnimationActive = true }) => (
  <div className="flex flex-col h-full">
    <h1 className="font-bold w-full m-4 text-lg">Thống kế số lượng đơn hàng</h1>
    <div className="flex-1 m-4 mt-0">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 10, right: 0, left: 2, bottom: 0 }}
        >
          <XAxis dataKey="name" axisLine={false} tickLine={false} />
          <YAxis axisLine={false} tickLine={false} />
          <Tooltip />
          <Legend />
          <Bar
            dataKey="RefillStock"
            fill="blue"
            isAnimationActive={isAnimationActive}
            name="Nhập hàng"
          />
          <Bar
            dataKey="RefillShelf"
            fill="lightblue"
            isAnimationActive={isAnimationActive}
            name="Nhập kệ"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  </div>
);

export default TotalShipOrderBarChart;

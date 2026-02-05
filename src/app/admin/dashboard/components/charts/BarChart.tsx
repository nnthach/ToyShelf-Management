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
    Membership: 4000,
    QRScan: 2400,
  },
  {
    name: "Feb",
    Membership: 3000,
    QRScan: 1398,
  },
  {
    name: "Mar",
    Membership: 2000,
    QRScan: 9800,
  },
  {
    name: "Apr",
    Membership: 2780,
    QRScan: 3908,
  },
  {
    name: "Jun",
    Membership: 1890,
    QRScan: 4800,
  },
  {
    name: "Jul",
    Membership: 2390,
    QRScan: 3800,
  },
  {
    name: "Aug",
    Membership: 3490,
    QRScan: 4300,
  },
];

// #endregion
const BarChartExample = ({ isAnimationActive = true }) => (
  <div className="flex flex-col h-full">
    <p className="font-bold text-lg w-full mb-4">Total Revenue</p>
    <div className="flex-1">
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
            dataKey="Membership"
            fill="blue"
            isAnimationActive={isAnimationActive}
          />
          <Bar
            dataKey="QRScan"
            fill="orange"
            isAnimationActive={isAnimationActive}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  </div>
);

export default BarChartExample;

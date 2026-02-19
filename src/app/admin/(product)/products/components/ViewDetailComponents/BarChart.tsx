"use client";

import {
  BarChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Bar,
  ResponsiveContainer,
  Cell,
} from "recharts";

const data = [
  { name: "Jan", total: 6400 },
  { name: "Feb", total: 4398 },
  { name: "Mar", total: 11800 },
  { name: "Apr", total: 6688 },
  { name: "Jun", total: 6690 },
  { name: "Jul", total: 6190 },
  { name: "Aug", total: 7790 },
];

const COLORS = [
  "#2563eb", // blue
  "#22c55e", // green
  "#f97316", // orange
  "#a855f7", // purple
  "#06b6d4", // cyan
  "#eab308", // yellow
  "#ef4444", // red
];

const BarChartExample = ({ isAnimationActive = true }) => (
  <div className="flex flex-col h-full">
    <p className="font-semibold text-lg mb-4">Total Products Sold</p>

    <div className="flex-1">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <XAxis dataKey="name" axisLine={false} tickLine={false} />
          <YAxis axisLine={false} tickLine={false} />
          <Tooltip />

          <Bar
            dataKey="total"
            radius={[6, 6, 0, 0]}
            isAnimationActive={isAnimationActive}
          >
            {data.map((_, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  </div>
);

export default BarChartExample;

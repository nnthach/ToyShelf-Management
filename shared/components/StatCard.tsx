import { ArrowUpRight } from "lucide-react";

type StatCardProps = {
  title: string;
  value: string;
  change: string;
  changePercent: string;
  color?: string | null;
  icon: React.ComponentType<{ className?: string }>;
};

function StatCard({
  title,
  value,
  change,
  changePercent,
  icon: Icon,
  color,
}: StatCardProps) {
  const safeColor = color ?? "bg-gray-100 text-gray-500";
  const [bgColor, textColor] = safeColor.split(" ");

  return (
    <div className="bg-white rounded-xl border shadow-sm p-5 flex flex-col gap-3 hover:shadow-md transition">
      {/* Header */}
      <div className="flex items-center justify-between text-sm text-gray-500">
        <div className="flex items-center gap-2">
          <div
            className={`p-2 rounded-xl ${bgColor} backdrop-blur-sm flex items-center justify-center`}
          >
            <Icon className={`w-6 h-6 ${textColor}`} />
          </div>
          <span className="font-bold text-black">{title}</span>
        </div>
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

export default StatCard;

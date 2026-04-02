import { ArrowRight, ArrowUpRight } from "lucide-react";

type StatCardWithButtonProps = {
  title: string;
  value: string;
  change: string;
  changePercent: string;
  color?: string | null;
  icon: React.ComponentType<{ className?: string }>;
  action?: () => void;
};

function StatCardWithButton({
  title,
  value,
  change,
  changePercent,
  icon: Icon,
  color,
  action,
}: StatCardWithButtonProps) {
  const safeColor = color ?? "bg-gray-100 text-gray-500";
  const [bgColor, textColor] = safeColor.split(" ");

  return (
    <div className="bg-white rounded-xl border shadow-sm p-5 flex flex-col gap-3 hover:shadow-md transition">
      {/* Header */}
      <div className="flex items-center justify-between text-sm text-gray-500">
        <div className="flex items-center gap-2">
          <div className={`p-2 rounded-xl ${bgColor}`}>
            <Icon className={`w-6 h-6 ${textColor}`} />
          </div>
          <span className="font-bold text-black">{title}</span>
        </div>

        <span className="flex items-center gap-1 text-green-600 bg-green-50 px-2 py-0.5 rounded-full text-xs font-medium">
          <ArrowUpRight className="w-3 h-3" />
          {changePercent}
        </span>
      </div>

      <div className="text-2xl font-bold text-gray-900">{value}</div>

      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-500">
          <span className="text-green-600 font-medium">{change}</span> so với
          tháng trước
        </div>

        {action && (
          <span
            className={`inline-flex items-center justify-center h-6 w-7 rounded-2xl ${bgColor} ${textColor}
    bg-opacity-30 hover:bg-opacity-50
    transition-all cursor-pointer shadow-sm active:scale-95`}
            onClick={action} // ✅ gọi trực tiếp
          >
            <ArrowRight size={18} className={`${textColor}`} />
          </span>
        )}
      </div>
    </div>
  );
}
export default StatCardWithButton;

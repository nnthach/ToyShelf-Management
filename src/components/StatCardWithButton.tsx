import { ArrowRight } from "lucide-react";

type StatCardWithButtonProps = {
  title: string;
  value: string;
  color?: string | null;
  icon: React.ComponentType<{ className?: string }>;
  action?: () => void;
};

function StatCardWithButton({
  title,
  value,
  icon: Icon,
  color,
  action,
}: StatCardWithButtonProps) {
  const safeColor = color ?? "bg-gray-500 text-gray-500";
  // Tách lấy phần gốc màu (ví dụ: "yellow" từ "bg-yellow-100")
  const colorName = safeColor.split(" ")[0].split("-")[1] || "gray";
  const textColor = safeColor.split(" ")[1] || "text-gray-500";

  return (
    <div className="group relative bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex flex-col gap-4 hover:shadow-lg transition-all duration-300 overflow-hidden">
      {/* Thanh viền màu nằm dưới cùng */}
      <div
        className={`absolute bottom-0 left-0 right-0 h-1.5 bg-${colorName}-500 shadow-[0_-4px_10px_rgba(0,0,0,0.05)]`}
      />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Icon với nền nhẹ cùng tông */}
          <div className={`p-2 rounded-lg bg-${colorName}-50`}>
            <Icon className={`w-5 h-5 text-${colorName}-600`} />
          </div>
          <span className="font-bold text-gray-700 text-sm">{title}</span>
        </div>
      </div>

      {/* Body */}
      <div className="flex items-center justify-between mt-1">
        <div>
          <div className="text-2xl font-black text-gray-900 tracking-tight">
            {value}
          </div>
          <p className="text-[10px] text-gray-400 font-medium uppercase mt-1">
            Cập nhật liên tục
          </p>
        </div>

        {action && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              action();
            }}
            className={`flex items-center justify-center h-8 w-8 rounded-full border 
            bg-${colorName}-300 text-${colorName}-500
            transition-all duration-300 shadow-sm active:scale-90`}
          >
            <ArrowRight size={16} />
          </button>
        )}
      </div>
    </div>
  );
}

export default StatCardWithButton;

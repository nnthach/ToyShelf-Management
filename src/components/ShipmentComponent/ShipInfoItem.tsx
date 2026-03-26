import { cn } from "@/src/styles/lib/utils";
import { memo, ReactNode } from "react";

function ShipInfoItem({
  label,
  value,
  icon,
  isStatus = false,
}: {
  label: string;
  value: ReactNode;
  icon?: ReactNode;
  isStatus?: boolean;
}) {
  return (
    <div className="space-y-1">
      <p className="text-[10px] font-bold text-muted-foreground uppercase flex items-center gap-1">
        {icon} {label}
      </p>
      <p
        className={cn(
          "text-sm font-bold px-2.5 py-1 rounded-lg w-fit transition-all",
          isStatus
            ? "bg-emerald-100 text-emerald-800 border border-emerald-200 shadow-sm"
            : "text-slate-700 bg-slate-50 border border-transparent",
        )}
      >
        {value || "---"}
      </p>
    </div>
  );
}

export default memo(ShipInfoItem);

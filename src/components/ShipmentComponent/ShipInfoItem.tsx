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
        className={`text-sm font-semibold truncate ${isStatus ? "text-blue-600" : "text-slate-700"}`}
      >
        {value || "---"}
      </p>
    </div>
  );
}

export default memo(ShipInfoItem);

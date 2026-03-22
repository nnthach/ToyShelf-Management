import { formatDateTime } from "@/src/utils/format";
import { memo } from "react";

function ShipTimeNode({ label, time }: { label: string; time?: string }) {
  return (
    <div
      className={`p-2 rounded-lg border text-center ${time ? "bg-white border-green-200" : "bg-slate-50 border-slate-100 opacity-60"}`}
    >
      <p className="text-[9px] uppercase font-bold text-muted-foreground">
        {label}
      </p>
      <p className="text-[11px] font-bold mt-1">
        {time ? formatDateTime(time).full : "---"}
      </p>
    </div>
  );
}

export default memo(ShipTimeNode);

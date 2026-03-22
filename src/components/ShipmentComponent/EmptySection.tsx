import { Clock } from "lucide-react";
import { memo } from "react";

function EmptySection({ message }: { message: string }) {
  return (
    <div className="py-6 border border-dashed rounded-xl flex flex-col items-center justify-center bg-slate-50/50">
      <Clock className="h-5 w-5 text-slate-300 mb-2" />
      <p className="text-xs text-slate-400 italic">{message}</p>
    </div>
  );
}

export default memo(EmptySection);

import { memo } from "react";
import { QueryParams } from "../types/SubType";
import { XCircle } from "lucide-react";

interface FilterStatCardProps {
  query: QueryParams;
  updateQuery: (params: Partial<QueryParams>) => void;
  isFiltered: boolean;
  resetDates: () => void;
}

function FilterStatCard({
  query,
  updateQuery,
  isFiltered,
  resetDates,
}: FilterStatCardProps) {
  const inputClassName =
    "bg-gray-100 text-sm font-medium rounded-md px-2 py-1 outline-none border-none focus:ring-1 focus:ring-gray-300";
  return (
    <div className="flex flex-wrap items-center gap-4 mb-4">
      <div className="flex items-center gap-2">
        <span className="text-xs font-semibold text-gray-500 uppercase">
          Từ:
        </span>
        <input
          type="date"
          value={query.fromDate}
          onChange={(e) => updateQuery({ fromDate: e.target.value })}
          className={inputClassName}
        />
      </div>

      <div className="flex items-center gap-2">
        <span className="text-xs font-semibold text-gray-500 uppercase">
          Đến:
        </span>
        <input
          type="date"
          value={query.toDate}
          onChange={(e) => updateQuery({ toDate: e.target.value })}
          className={inputClassName}
        />
      </div>

      {/* Nút Reset - Chỉ hiện khi có thay đổi */}
      {isFiltered && (
        <button
          onClick={resetDates}
          className="flex items-center gap-1 text-xs font-medium text-gray-400 hover:text-red-500 transition-colors"
          title="Đặt lại về mặc định"
        >
          <XCircle size={14} />
          Xóa lọc
        </button>
      )}
    </div>
  );
}

export default memo(FilterStatCard);

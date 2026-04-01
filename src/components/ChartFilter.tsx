import React from "react";

export type ViewType = "week" | "month" | "year";

type FilterValue = {
  viewType: ViewType;
  month: number;
  year: number;
};

type Props = {
  value: FilterValue;
  onChange: (val: FilterValue) => void;
  showYear?: boolean;
  showMonth?: boolean;
};

const ChartFilter: React.FC<Props> = ({
  value,
  onChange,
  showYear = true,
  showMonth = true,
}) => {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => currentYear - i);
  return (
    <div className="flex items-center gap-2 p-1 rounded-lg">
      {/* View Type */}
      <select
        value={value.viewType}
        onChange={(e) => {
          const newType = e.target.value as ViewType;
          const now = new Date();

          onChange({
            viewType: newType,
            month: now.getMonth() + 1,
            year: now.getFullYear(),
          });
        }}
        className="bg-gray-100 text-sm font-medium rounded-md px-2 py-1 outline-none"
      >
        <option value="week">Theo Tuần</option>
        <option value="month">Theo Tháng</option>
        <option value="year">Theo Năm</option>
      </select>

      {/* Month */}
      {showMonth && value.viewType === "month" && (
        <select
          value={value.month}
          onChange={(e) =>
            onChange({ ...value, month: parseInt(e.target.value) })
          }
          className="bg-gray-100 text-sm font-medium rounded-md px-2 py-1 outline-none"
        >
          {Array.from({ length: 12 }, (_, i) => (
            <option key={i + 1} value={i + 1}>
              Tháng {i + 1}
            </option>
          ))}
        </select>
      )}

      {/* Year */}
      {showYear &&
        (value.viewType === "month" || value.viewType === "year") && (
          <select
            value={value.year}
            onChange={(e) =>
              onChange({ ...value, year: parseInt(e.target.value) })
            }
            className="bg-gray-100 text-sm font-medium rounded-md px-2 py-1 outline-none"
          >
            {years.map((y) => (
              <option key={y} value={y}>
                Năm {y}
              </option>
            ))}
          </select>
        )}
    </div>
  );
};

export default ChartFilter;

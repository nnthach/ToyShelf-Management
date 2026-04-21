import { useMemo } from "react";
import useQueryParams from "./useQueryParams";
import { useDebounce } from "./useDebounce";

export const useFilterStatCard = () => {
  // Helper lấy định dạng YYYY-MM-DD địa phương
  const getLocalDateFormat = (date: Date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  };

  // default current month
  const { firstDayOfMonth, lastDayOfMonth } = useMemo(() => {
    const now = new Date();
    return {
      firstDayOfMonth: getLocalDateFormat(
        new Date(now.getFullYear(), now.getMonth(), 1),
      ),
      lastDayOfMonth: getLocalDateFormat(
        new Date(now.getFullYear(), now.getMonth() + 1, 0),
      ),
    };
  }, []);

  const { query, updateQuery } = useQueryParams({
    fromDate: firstDayOfMonth,
    toDate: lastDayOfMonth,
  });

  const debouncedQuery = useDebounce(query, 1000);

  const isFiltered =
    query.fromDate !== firstDayOfMonth || query.toDate !== lastDayOfMonth;

  // format to date time
  const apiFormattedDates = useMemo(
    () => ({
      fromDate: debouncedQuery.fromDate
        ? new Date(`${debouncedQuery.fromDate}T00:00:00Z`).toISOString()
        : undefined,
      toDate: debouncedQuery.toDate
        ? new Date(`${debouncedQuery.toDate}T23:59:59Z`).toISOString()
        : undefined,
    }),
    [debouncedQuery.fromDate, debouncedQuery.toDate],
  );

  const resetDates = () => {
    updateQuery({
      fromDate: firstDayOfMonth,
      toDate: lastDayOfMonth,
    });
  };

  return {
    query,
    updateQuery,
    isFiltered,
    resetDates,
    apiFormattedDates,
    firstDayOfMonth,
    lastDayOfMonth,
  };
};

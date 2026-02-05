import { useState } from "react";

export function useFilterSearchBar<T extends object>(initialState: T) {
  const [filters, setFilters] = useState<T>(initialState);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;

    setFilters((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
    }));
  };

  const resetFilter = () => {
    setFilters(initialState);
  };

  return { filters, setFilters, handleChange, resetFilter };
}

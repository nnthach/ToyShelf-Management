import { useState } from "react";

const useQueryParams = <T>(initial: T) => {
  const [query, setQuery] = useState(initial);

  const updateQuery = (newQuery: Partial<T>) => {
    setQuery((prev) => ({
      ...prev,
      ...newQuery,
    }));
  };

  const resetQuery = () => {
    setQuery(initial);
  };
  return { query, updateQuery, resetQuery };
};

export default useQueryParams;

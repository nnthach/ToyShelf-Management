// import { useCallback, useState } from "react";

// const useQueryParams = <T>(initial: T) => {
//   const [query, setQuery] = useState(initial);

//   const updateQuery = useCallback((params: Partial<T>) => {
//     setQuery((prev) => ({
//       ...prev,
//       ...params,
//     }));
//   }, []);

//   const resetQuery = () => {
//     setQuery(initial);
//   };
//   return { query, updateQuery, resetQuery };
// };

// export default useQueryParams;

"use client";

import { useCallback, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const useQueryParams = <T extends object>(initial: T) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  //  derive từ URL
  const query = useMemo(() => {
    const newQuery = { ...initial };

    (Object.keys(initial) as Array<keyof T>).forEach((key) => {
      const value = searchParams.get(key as string);

      if (value !== null) {
        const initialValue = initial[key];

        if (typeof initialValue === "number") {
          newQuery[key] = Number(value) as T[typeof key];
        } else if (typeof initialValue === "boolean") {
          newQuery[key] = (value === "true") as T[typeof key];
        } else {
          newQuery[key] = value as T[typeof key];
        }
      }
    });

    return newQuery;
  }, [searchParams, initial]);

  // update URL
  const updateQuery = useCallback(
    (params: Partial<T>) => {
      const search = new URLSearchParams(searchParams.toString());

      Object.entries(params).forEach(([key, value]) => {
        if (value === undefined || value === "") {
          search.delete(key);
        } else {
          search.set(key, String(value));
        }
      });

      router.replace(`?${search.toString()}`);
    },
    [router, searchParams],
  );

  // reset
  const resetQuery = useCallback(() => {
    router.replace("?");
  }, [router]);

  return { query, updateQuery, resetQuery };
};

export default useQueryParams;

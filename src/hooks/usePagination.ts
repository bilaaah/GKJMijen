import { useState, useMemo } from 'react';

interface UsePaginationOptions {
  initialPage?: number;
  initialPageSize?: number;
}

export function usePagination(options: UsePaginationOptions = {}) {
  const { initialPage = 1, initialPageSize = 10 } = options;
  const [page, setPage] = useState<number>(initialPage);
  const [pageSize, setPageSize] = useState<number>(initialPageSize);

  const nextPage = () => setPage((prev) => prev + 1);
  const prevPage = () => setPage((prev) => Math.max(1, prev - 1));
  const goToPage = (newPage: number) => setPage(newPage);
  const resetPage = () => setPage(1);

  return useMemo(
    () => ({
      page,
      pageSize,
      setPage,
      setPageSize,
      nextPage,
      prevPage,
      goToPage,
      resetPage,
    }),
    [page, pageSize]
  );
}

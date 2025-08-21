import { useState, useCallback } from 'react';

const usePagination = ({ initialPage = 1, itemsPerPage = 10, onDataFetch }) => {
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(
    async (params = {}) => {
      if (!onDataFetch) return;

      try {
        setLoading(true);
        setError(null);

        const requestParams = {
          page: currentPage,
          limit: itemsPerPage,
          ...params,
        };

        const response = await onDataFetch(requestParams);

        if (response.data?.meta) {
          setTotalPages(response.data.meta.last_page);
          setTotalItems(response.data.meta.total);
        }

        return response;
      } catch (err) {
        setError(err.message || 'Erro ao carregar dados');
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [currentPage, itemsPerPage, onDataFetch]
  );

  const handlePageChange = useCallback(
    (page) => {
      if (page !== currentPage && page >= 1 && page <= totalPages) {
        setCurrentPage(page);
      }
    },
    [currentPage, totalPages]
  );

  const checkAndFixEmptyPage = useCallback(
    (itemsCount) => {
      if (itemsCount === 0 && currentPage > 1) {
        const newPage = Math.max(1, currentPage - 1);
        setCurrentPage(newPage);
        return newPage;
      }
      return currentPage;
    },
    [currentPage]
  );

  const handleSearch = useCallback(
    (searchParams) => {
      setCurrentPage(1);
      return fetchData(searchParams);
    },
    [fetchData]
  );

  const handleSort = useCallback(
    (sortParams, resetPage = true) => {
      if (resetPage) {
        setCurrentPage(1);
      }
      return fetchData(sortParams);
    },
    [fetchData]
  );

  const resetPagination = useCallback(() => {
    setCurrentPage(initialPage);
    setTotalPages(1);
    setTotalItems(0);
    setError(null);
  }, [initialPage]);

  const goToFirstPage = useCallback(() => {
    handlePageChange(1);
  }, [handlePageChange]);

  const goToLastPage = useCallback(() => {
    handlePageChange(totalPages);
  }, [handlePageChange, totalPages]);

  return {
    currentPage,
    totalPages,
    totalItems,
    loading,
    error,

    fetchData,
    handlePageChange,
    handleSearch,
    handleSort,
    checkAndFixEmptyPage,

    resetPagination,
    goToFirstPage,
    goToLastPage,

    setCurrentPage,
    setTotalPages,
    setTotalItems,
    setLoading,
    setError,
  };
};

export default usePagination;

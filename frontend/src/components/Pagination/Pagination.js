import './Pagination.scss';

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  disabled = false,
  maxPagesToShow = 5,
}) => {
  if (totalPages <= 1) return null;

  const handlePageChange = (page) => {
    if (disabled || page === currentPage || page < 1 || page > totalPages) {
      return;
    }
    onPageChange(page);
  };

  const getVisiblePages = () => {
    const pages = [];
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return { pages, startPage, endPage };
  };

  const { pages, startPage, endPage } = getVisiblePages();

  return (
    <div className="pagination">
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={disabled || currentPage === 1}
        className="btn btn-sm btn-secondary"
      >
        Anterior
      </button>

      {startPage > 1 && (
        <>
          <button
            onClick={() => handlePageChange(1)}
            disabled={disabled}
            className="btn btn-sm btn-secondary"
          >
            1
          </button>
          {startPage > 2 && <span className="pagination-ellipsis">...</span>}
        </>
      )}

      {pages.map((page) => (
        <button
          key={page}
          onClick={() => handlePageChange(page)}
          disabled={disabled}
          className={`btn btn-sm ${currentPage === page ? 'btn-primary' : 'btn-secondary'}`}
        >
          {page}
        </button>
      ))}

      {endPage < totalPages && (
        <>
          {endPage < totalPages - 1 && (
            <span className="pagination-ellipsis">...</span>
          )}
          <button
            onClick={() => handlePageChange(totalPages)}
            disabled={disabled}
            className="btn btn-sm btn-secondary"
          >
            {totalPages}
          </button>
        </>
      )}

      <button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={disabled || currentPage === totalPages}
        className="btn btn-sm btn-secondary"
      >
        Próxima
      </button>
    </div>
  );
};

export default Pagination;

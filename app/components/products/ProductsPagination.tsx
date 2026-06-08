'use client';

interface ProductsPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function ProductsPagination({ currentPage, totalPages, onPageChange }: ProductsPaginationProps) {
  const pages = [];
  const maxVisible = 5;
  let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
  const endPage = Math.min(totalPages, startPage + maxVisible - 1);

  if (endPage - startPage + 1 < maxVisible) {
    startPage = Math.max(1, endPage - maxVisible + 1);
  }

  for (let i = startPage; i <= endPage; i++) pages.push(i);

  return (
    <div className="flex justify-center items-center gap-2 mt-12">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
      >
        Previous
      </button>

      {startPage > 1 && (
        <>
          <button onClick={() => onPageChange(1)} className="px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors">1</button>
          {startPage > 2 && <span className="px-2">...</span>}
        </>
      )}

      {pages.map(page => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`px-3 py-2 rounded-lg transition-colors ${currentPage === page ? 'bg-blue-600 text-white' : 'hover:bg-gray-50'}`}
        >
          {page}
        </button>
      ))}

      {endPage < totalPages && (
        <>
          {endPage < totalPages - 1 && <span className="px-2">...</span>}
          <button onClick={() => onPageChange(totalPages)} className="px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors">
            {totalPages}
          </button>
        </>
      )}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
      >
        Next
      </button>
    </div>
  );
}
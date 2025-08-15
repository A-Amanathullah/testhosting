import React from 'react';

const Pagination = ({ page, setPage, totalPages }) => {
  if (totalPages <= 1) return null;
  return (
    <div className="flex justify-center items-center gap-2 mt-4">
      <button
        onClick={() => setPage(page - 1)}
        disabled={page === 1}
        className="px-3 py-1 rounded-lg bg-gray-100 border border-gray-300 text-gray-600 font-medium hover:bg-gray-200 disabled:opacity-50 transition shadow-sm"
        aria-label="Previous Page"
      >
        <span className="inline-block align-middle">&#8592;</span> Prev
      </button>
      {Array.from({ length: totalPages }, (_, i) => (
        <button
          key={i + 1}
          onClick={() => setPage(i + 1)}
          className={`px-3 py-1 rounded-lg border font-semibold transition shadow-sm ${page === i + 1 ? 'bg-blue-600 text-white border-blue-600 shadow' : 'bg-white text-gray-700 border-gray-300 hover:bg-blue-50'}`}
          aria-current={page === i + 1 ? 'page' : undefined}
        >
          {i + 1}
        </button>
      ))}
      <button
        onClick={() => setPage(page + 1)}
        disabled={page === totalPages}
        className="px-3 py-1 rounded-lg bg-gray-100 border border-gray-300 text-gray-600 font-medium hover:bg-gray-200 disabled:opacity-50 transition shadow-sm"
        aria-label="Next Page"
      >
        Next <span className="inline-block align-middle">&#8594;</span>
      </button>
    </div>
  );
};

export default Pagination;

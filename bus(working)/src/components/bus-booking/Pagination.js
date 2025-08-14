import React from 'react';

const Pagination = ({ page, setPage, totalPages }) => {
  if (totalPages <= 1) return null;
  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    pages.push(i);
  }
  return (
    <nav className="inline-flex rounded-md shadow-sm" aria-label="Pagination">
      {pages.map((p) => (
        <button
          key={p}
          onClick={() => setPage(p)}
          className={`px-3 py-1 mx-1 rounded-md border text-sm font-medium focus:outline-none transition-colors duration-150 ${
            p === page
              ? 'bg-blue-600 text-white border-blue-600'
              : 'bg-white text-blue-700 border-gray-300 hover:bg-blue-50'
          }`}
        >
          {p}
        </button>
      ))}
    </nav>
  );
};

export default Pagination;

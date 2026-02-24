import React from 'react';

const Pagination = () => (
  <div className="mt-12 flex justify-center items-center gap-2">
    <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
      <span className="material-icons-outlined text-sm">chevron_left</span>
    </button>
    <button className="w-10 h-10 flex items-center justify-center rounded-lg bg-primary text-white font-semibold shadow-glow">
      1
    </button>
    <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
      2
    </button>
    <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
      3
    </button>
    <span className="text-gray-400 px-2">...</span>
    <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
      <span className="material-icons-outlined text-sm">chevron_right</span>
    </button>
  </div>
);

export default Pagination;

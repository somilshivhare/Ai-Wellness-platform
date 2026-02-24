import React from 'react';

const SearchFilters = () => (
  <div className="bg-surface-light dark:bg-surface-dark p-4 rounded-2xl shadow-soft dark:shadow-none border border-gray-100 dark:border-gray-700 max-w-5xl mx-auto relative z-20">
    <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
      <div className="md:col-span-4 relative group">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <span className="material-icons-outlined text-gray-400 group-focus-within:text-primary transition-colors">
            search
          </span>
        </div>
        <input
          className="block w-full pl-10 pr-3 py-3 border-none ring-1 ring-gray-200 dark:ring-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-primary focus:bg-white dark:focus:bg-gray-800 transition-all"
          placeholder="Search by name or keyword..."
          type="text"
        />
      </div>
      <div className="md:col-span-3 relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <span className="material-icons-outlined text-gray-400">psychology</span>
        </div>
        <select className="block w-full pl-10 pr-10 py-3 border-none ring-1 ring-gray-200 dark:ring-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary appearance-none cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
          <option>Specialization</option>
          <option>Anxiety &amp; Stress</option>
          <option>Depression</option>
          <option>Career Counseling</option>
          <option>Family Therapy</option>
        </select>
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
          <span className="material-icons-outlined text-gray-400 text-sm">expand_more</span>
        </div>
      </div>
      <div className="md:col-span-2 relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <span className="material-icons-outlined text-gray-400">event_available</span>
        </div>
        <select className="block w-full pl-10 pr-8 py-3 border-none ring-1 ring-gray-200 dark:ring-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary appearance-none cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
          <option>Availability</option>
          <option>Today</option>
          <option>This Week</option>
          <option>Weekends</option>
        </select>
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
          <span className="material-icons-outlined text-gray-400 text-sm">expand_more</span>
        </div>
      </div>
      <div className="md:col-span-2 relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <span className="material-icons-outlined text-gray-400">language</span>
        </div>
        <select className="block w-full pl-10 pr-8 py-3 border-none ring-1 ring-gray-200 dark:ring-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary appearance-none cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
          <option>English</option>
          <option>Spanish</option>
          <option>French</option>
          <option>Mandarin</option>
        </select>
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
          <span className="material-icons-outlined text-gray-400 text-sm">expand_more</span>
        </div>
      </div>
      <div className="md:col-span-1">
        <button className="w-full h-full bg-primary hover:bg-blue-700 text-white rounded-xl flex items-center justify-center transition-colors shadow-glow">
          <span className="material-icons-outlined">arrow_forward</span>
        </button>
      </div>
    </div>
    <div className="mt-4 flex flex-wrap gap-2">
      <span className="text-xs font-semibold text-subtext-light dark:text-subtext-dark uppercase tracking-wide mr-2 py-1">
        Popular:
      </span>
      <button className="px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 text-primary dark:text-blue-300 text-xs font-medium border border-blue-100 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-800 transition-colors">
        CBT
      </button>
      <button className="px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 text-primary dark:text-blue-300 text-xs font-medium border border-blue-100 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-800 transition-colors">
        Trauma Informed
      </button>
      <button className="px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 text-primary dark:text-blue-300 text-xs font-medium border border-blue-100 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-800 transition-colors">
        Couples
      </button>
    </div>
  </div>
);

export default SearchFilters;

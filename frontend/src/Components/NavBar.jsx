import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = ({ toggleDark }) => (
  <nav className="fixed w-full z-50 bg-surface-light/90 dark:bg-surface-dark/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center h-20">
        <div className="flex items-center gap-2">
          <span className="material-icons-outlined text-primary text-3xl">
            psychology
          </span>
          <span className="font-bold text-xl tracking-tight text-slate-900 dark:text-white">
            MindBridge
          </span>
        </div>
        <div className="hidden md:flex space-x-8">
          <Link
            className="text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-primary transition-colors font-medium"
            to="/"
          >
            Home
          </Link>
          <Link
            className="text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-primary transition-colors font-medium"
            to="/find"
          >
            Find a Therapist
          </Link>
          <Link
            className="text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-primary transition-colors font-medium"
            to="#"
          >
            Assessments
          </Link>
          <Link
            className="text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-primary transition-colors font-medium"
            to="/contact"
          >
            Contact Us
          </Link>
        </div>
        <div className="flex items-center space-x-4">
          <Link
            to="/signup"
            className="bg-primary hover:bg-blue-700 text-white px-5 py-2.5 rounded-full font-medium transition-all shadow-sm hover:shadow-md"
          >
            Get Started
          </Link>
          <button
            onClick={toggleDark}
            className="p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white"
          >
            <span className="material-icons-outlined">dark_mode</span>
          </button>
        </div>
      </div>
    </div>
  </nav>
);

export default Navbar;

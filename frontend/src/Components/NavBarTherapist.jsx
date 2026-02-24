import React from 'react';
import { Link } from 'react-router-dom';

const NavBarTherapist = () => (
  <nav className="sticky top-0 z-50 bg-surface-light/80 dark:bg-surface-dark/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-800">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between h-20 items-center">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary text-white font-bold text-xl">
            C
          </div>
          <span className="font-bold text-xl tracking-tight text-gray-900 dark:text-white">
            MindBridge
          </span>
        </div>
        <div className="hidden md:flex space-x-8 items-center">
          <Link
            className="text-subtext-light dark:text-subtext-dark hover:text-primary dark:hover:text-blue-400 font-medium transition-colors"
            to="/"
          >
            Home
          </Link>
          <Link
            className="text-primary dark:text-blue-400 font-semibold transition-colors"
            to="/find"
          >
            Therapists
          </Link>
          <a
            className="text-subtext-light dark:text-subtext-dark hover:text-primary dark:hover:text-blue-400 font-medium transition-colors"
            href="#"
          >
            Services
          </a>
          <a
            className="text-subtext-light dark:text-subtext-dark hover:text-primary dark:hover:text-blue-400 font-medium transition-colors"
            href="#"
          >
            Blog
          </a>
        </div>
        <div className="flex items-center gap-4">
          <button className="p-2 rounded-full text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <span className="material-icons-outlined">notifications</span>
          </button>
          <Link
            className="hidden md:flex bg-primary hover:bg-blue-700 text-white px-5 py-2.5 rounded-full font-medium transition-all shadow-glow"
            to="/signup"
          >
            Get Started
          </Link>
        </div>
      </div>
    </div>
  </nav>
);

export default NavBarTherapist;

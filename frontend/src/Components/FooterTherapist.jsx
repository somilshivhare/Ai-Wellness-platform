import React from 'react';

const FooterTherapist = () => (
  <footer className="bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 mt-16 pt-16 pb-8">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
        <div className="col-span-1 md:col-span-1">
          <div className="flex items-center gap-2 mb-4">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-white font-bold text-sm">
              C
            </div>
            <span className="font-bold text-lg text-gray-900 dark:text-white">
              CureNast
            </span>
          </div>
          <p className="text-sm text-subtext-light dark:text-subtext-dark mb-4">
            Making mental healthcare accessible, comfortable, and effective through
            technology and compassion.
          </p>
          <div className="flex gap-4">
            <a className="text-gray-400 hover:text-primary transition-colors" href="#">
              <i className="fab fa-twitter"></i>
            </a>
            <div className="w-5 h-5 bg-gray-200 dark:bg-gray-700 rounded-sm"></div>
            <div className="w-5 h-5 bg_gray-200 dark:bg-gray-700 rounded-sm"></div>
            <div className="w-5 h-5 bg-gray-200 dark:bg-gray-700 rounded-sm"></div>
          </div>
        </div>
        <div>
          <h4 className="font-bold text-gray-900 dark:text-white mb-4">Platform</h4>
          <ul className="space-y-2 text-sm text-subtext-light dark:text-subtext-dark">
            <li><a className="hover:text-primary transition-colors" href="#">Browse Therapists</a></li>
            <li><a className="hover:text-primary transition-colors" href="#">How it Works</a></li>
            <li><a className="hover:text-primary transition-colors" href="#">Pricing</a></li>
            <li><a className="hover:text-primary transition-colors" href="#">For Employers</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-gray-900 dark:text-white mb-4">Company</h4>
          <ul className="space-y-2 text-sm text-subtext-light dark:text-subtext-dark">
            <li><a className="hover:text-primary transition-colors" href="#">About Us</a></li>
            <li><a className="hover:text-primary transition-colors" href="#">Careers</a></li>
            <li><a className="hover:text-primary transition-colors" href="#">Blog</a></li>
            <li><a className="hover:text-primary transition-colors" href="#">Contact</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-gray-900 dark:text-white mb-4">Resources</h4>
          <ul className="space-y-2 text-sm text-subtext-light dark:text-subtext-dark">
            <li><a className="hover:text-primary transition-colors" href="#">Help Center</a></li>
            <li><a className="hover:text-primary transition-colors" href="#">Crisis Support</a></li>
            <li><a className="hover:text-primary transition-colors" href="#">Privacy Policy</a></li>
            <li><a className="hover:text-primary transition-colors" href="#">Terms of Service</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-gray-100 dark:border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-subtext-light dark:text-subtext-dark">
        <p>© 2024 CureNast Inc. All rights reserved.</p>
        <div className="flex gap-4 mt-4 md:mt-0">
          <span>Designed with care.</span>
        </div>
      </div>
    </div>
  </footer>
);

export default FooterTherapist;

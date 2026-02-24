import React from 'react';

const Footer = () => (
  <footer className="bg-surface-light dark:bg-surface-dark border-t border-slate-200 dark:border-slate-800 pt-16 pb-8">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-12">
        <div className="col-span-2 lg:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <span className="material-icons-outlined text-primary text-3xl">psychology</span>
            <span className="font-bold text-xl tracking-tight text-slate-900 dark:text-white">MindBridge</span>
          </div>
          <p className="text-slate-500 dark:text-slate-400 max-w-xs mb-6">
            Empowering minds through technology and compassionate care. We are dedicated to making mental health accessible to everyone.
          </p>
          <div className="flex space-x-4">
            <a className="text-slate-400 hover:text-primary transition-colors" href="#"><span className="material-icons-outlined">facebook</span></a>
            <a className="text-slate-400 hover:text-primary transition-colors" href="#"><span className="material-icons-outlined">share</span></a> 
            <a className="text-slate-400 hover:text-primary transition-colors" href="#"><span className="material-icons-outlined">camera_alt</span></a> 
            <a className="text-slate-400 hover:text-primary transition-colors" href="#"><span className="material-icons-outlined">work</span></a> 
          </div>
        </div>
        <div>
          <h4 className="font-bold text-slate-900 dark:text-white mb-4">Platform</h4>
          <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
            <li><a className="hover:text-primary transition-colors" href="/">Home</a></li>
            <li><a className="hover:text-primary transition-colors" href="/find">Find a Therapist</a></li>
            <li><a classity="hover:text-primary transition-colors" href="#">Assessments</a></li>
            <li><a className="hover:text-primary transition-colors" href="/contact">Contact Us</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-slate-900 dark:text-white mb-4">Company</h4>
          <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
            <li><a className="hover:text-primary transition-colors" href="#">About Us</a></li>
            <li><a className="hover:text-primary transition-colors" href="#">Careers</a></li>
            <li><a className="hover:text-primary transition-colors" href="#">Blog</a></li>
            <li><a className="hover:text-primary transition-colors" href="#">Contact</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-slate-900 dark:text-white mb-4">Resources</h4>
          <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
            <li><a className="hover:text-primary transition-colors" href="#">Crisis Support</a></li>
            <li><a className="hover:text-primary transition-colors" href="#">Help Center</a></li>
            <li><a className="hover:text-primary transition-colors" href="#">Privacy Policy</a></li>
            <li><a className="hover:text-primary transition-colors" href="#">Terms of Service</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-slate-200 dark:border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-sm text-slate-500 dark:text-slate-500">© 2026 MindBridge Health Inc. All rights reserved.</p>
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span className="w-2 h-2 rounded-full bg-green-500"></span>
          <span>Systems Operational</span>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
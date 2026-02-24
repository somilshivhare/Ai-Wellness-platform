import React from 'react';
import { Link } from 'react-router-dom';

const Specialists = () => (
  <section className="py-24 bg-white dark:bg-surface-dark">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-end mb-12">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Meet our specialists</h2>
          <p className="text-slate-600 dark:text-slate-400">Highly qualified experts ready to guide you.</p>
        </div>
        <Link className="hidden md:flex items-center gap-1 text-primary hover:text-blue-700 font-medium transition-colors" to="/find">
          View all therapists <span className="material-icons-outlined text-sm">arrow_forward</span>
        </Link>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* card 1 */}
        <div className="bg-white dark:bg-surface-dark rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all border border-slate-100 dark:border-slate-700 group">
          <div className="h-48 overflow-hidden">
            <img alt="Dr. Samuel Kim" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB2_lpN40Rjn5Cfq5M0jdXOOJIVI7Du_CoYRZli-Efu1U_54BzjbajZrVBqcxyXyYgeH2vKkhrCvXXr8HMokgWYWMt1oNqFws-W7r1W1GP2plcaoNDNVkmUCz_D-RQSdlKzaq7d5KyPtdOYPAOi_JWkidvoklnQ8QcmBffH06TlQKJK3911ThaKHr9BPt3XifNCUEkd7ElXXBNLHTyfIt50MD7SZ3R6Yptiyordgqszi1742z7DniXja5DBgchn8MIT2mZ7e-T37xk" />
          </div>
          <div className="p-6">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Dr. Samuel Kim</h3>
            <p className="text-primary text-sm font-medium mb-3">Clinical Psychologist</p>
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs px-2 py-1 rounded">Anxiety</span>
              <span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs px-2 py-1 rounded">Depression</span>
            </div>
            <Link to="/find" className="w-full py-2 rounded-lg border border-primary text-primary hover:bg-primary hover:text-white transition-colors text-sm font-medium flex items-center justify-center">View Profile</Link>
          </div>
        </div>
        {/* card 2 */}
        <div className="bg-white dark:bg-surface-dark rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all border border-slate-100 dark:border-slate-700 group">
          <div className="h-48 overflow-hidden">
            <img alt="Dr. Emily Davis" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBFeW1aKsmtdnLLp9rYFxbDbQi_bpUUVedCjKJch4O06PWw6oI5mwBM2fkTll5T2gQMKjzeFoLWEES1ne8WvYWOXP0-ljQrNlLD2iyz02fvqBCQTzHvuv0ajUjD9ulLTA70cjAiH8k2LZv_GMbU6IxbycWYasBQUb0XmdAc7oVV-cOjpDXmxT1wfgd3G0f4ONzOLcdEQ5Rtn6KqeKBkvZmuy_07xtCJEJjH12JjSXKkpZjLN-G3ljfj7VBkecrKORRlFvfgJT-dVHg" />
          </div>
          <div className="p-6">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Dr. Emily Davis</h3>
            <p className="text-primary text-sm font-medium mb-3">Therapist, LMFT</p>
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs px-2 py-1 rounded">Family</span>
              <span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs px-2 py-1 rounded">Stress</span>
            </div>
            <Link to="/find" className="w-full py-2 rounded-lg border border-primary text-primary hover:bg-primary hover:text-white transition-colors text-sm font-medium flex items-center justify-center">View Profile</Link>
          </div>
        </div>
        {/* card 3 */}
        <div className="bg-white dark:bg-surface-dark rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all border border-slate-100 dark:border-slate-700 group">
          <div className="h-48 overflow-hidden">
            <img alt="Dr. Alex Chen" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC1sArNoh2wg-8XgTavmqg2hx4_A2Za2g6C6U8esJkdIPDV1LoLQAgqJq0Y5DbEklleNVDvkUf_oj5Ng8JR6alFNMWQVgRCA2CqREYf4nS7FJLZzAwlgtlHG4CmWye6FGLBwjzUACR6YjshNimQ9nZW0l2HfKT9m9ok1d_mlkBOTYvC3iitRArFV5X_N7bhAyeKshT4cRRFLk9qI5dwEdc7X1NMdquclv_dCR6CiDqJTPZ1jW-lYkwE15MVKpGnfXp15gqwUVSjb3k" />
          </div>
          <div className="p-6">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Dr. Alex Chen</h3>
            <p className="text-primary text-sm font-medium mb-3">Psychiatrist</p>
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs px-2 py-1 rounded">ADHD</span>
              <span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs px-2 py-1 rounded">Medication</span>
            </div>
            <Link to="/find" className="w-full py-2 rounded-lg border border-primary text-primary hover:bg-primary hover:text-white transition-colors text-sm font-medium flex items-center justify-center">View Profile</Link>
          </div>
        </div>
        {/* card 4 */}
        <div className="bg-white dark:bg-surface-dark rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all border border-slate-100 dark:border-slate-700 group">
          <div className="h-48 overflow-hidden">
            <img alt="Sarah Johnson" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAMoJRW5WRwruQ9KLYae4gAaKMx2GbY0Yp0qMCaAKL3lk3trQUIs04a0vQPUXoTrKAEiF3tf5M6WGZx3ErnJsz3JZvLapc2GqzcYnTj1JDMchPhxxbZw3yPMeqcHmh-64TUX9aXhSdjP1JOTUqcOR3aLNz0PDCJ6nsDyMUx3YXRPxbgQr8Ln2INUGJg8A1NqyEsXAmwGgBn-h6PPII4LI5D7RtLrtIDEJmIC1rmK-sT4oM8vXY9CuSe25XaqIUE7VPt-dERwdQOKXQ" />
          </div>
          <div className="p-6">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Sarah Johnson</h3>
            <p className="text-primary text-sm font-medium mb-3">Counselor, LPC</p>
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs px-2 py-1 rounded">Trauma</span>
              <span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs px-2 py-1 rounded">Grief</span>
            </div>
            <Link to="/find" className="w-full py-2 rounded-lg border border-primary text-primary hover:bg-primary hover:text-white transition-colors text-sm font-medium flex items-center justify-center">View Profile</Link>
          </div>
        </div>
      </div>
      <div className="mt-8 text-center md:hidden">
        <Link className="inline-flex items-center gap-1 text-primary hover:text-blue-700 font-medium transition-colors" to="/find">
          View all therapists <span className="material-icons-outlined text-sm">arrow_forward</span>
        </Link>
      </div>
    </div>
  </section>
);

export default Specialists;
import React from 'react';

const Stats = () => (
  <section className="border-y border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900/50">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
        <div>
          <div className="text-3xl font-bold text-slate-900 dark:text-white mb-1">
            24/7
          </div>
          <div className="text-sm text-slate-500 dark:text-slate-400 font-medium">
            AI Availability
          </div>
        </div>
        <div>
          <div className="text-3xl font-bold text-slate-900 dark:text-white mb-1">
            500+
          </div>
          <div className="text-sm text-slate-500 dark:text-slate-400 font-medium">
            Licensed Therapists
          </div>
        </div>
        <div>
          <div className="text-3xl font-bold text-slate-900 dark:text-white mb-1">
            98%
          </div>
          <div className="text-sm text-slate-500 dark:text-slate-400 font-medium">
            Satisfaction Rate
          </div>
        </div>
        <div>
          <div className="text-3xl font-bold text-slate-900 dark:text-white mb-1">
            Secure
          </div>
          <div className="text-sm text-slate-500 dark:text-slate-400 font-medium">
            HIPAA Compliant
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default Stats;

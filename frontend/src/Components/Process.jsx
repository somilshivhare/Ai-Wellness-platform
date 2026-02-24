import React from 'react';

const Process = () => (
  <section className="py-24 bg-surface-light dark:bg-background-dark relative">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <span className="text-primary font-semibold text-sm tracking-wider uppercase mb-2 block">
          The Process
        </span>
        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
          Science-backed support in three steps
        </h2>
        <p className="text-slate-600 dark:text-slate-300 text-lg">
          We've simplified the journey to mental wellness, making it accessible, structured, and deeply personal.
        </p>
      </div>
      <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
        <div className="bg-white dark:bg-surface-dark rounded-2xl p-8 border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow relative group">
          <div className="absolute top-0 right-0 mt-6 mr-6 text-slate-100 dark:text-slate-800 font-bold text-8xl -z-0 opacity-50 select-none group-hover:text-blue-50 dark:group-hover:text-slate-700 transition-colors">
            1
          </div>
          <div className="relative z-10">
            <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center text-primary mb-6">
              <span className="material-icons-outlined text-2xl">chat_bubble</span>
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">AI Initial Chat & Summary</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              Engage in a confidential conversation with our AI to articulate your feelings and immediate needs. It will also provide a clear summary of your discussion to share with therapists or experts.
            </p>
          </div>
        </div>
        <div className="bg-white dark:bg-surface-dark rounded-2xl p-8 border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow relative group">
          <div className="absolute top-0 right-0 mt-6 mr-6 text-slate-100 dark:text-slate-800 font-bold text-8xl -z-0 opacity-50 select-none group-hover:text-blue-50 dark:group-hover:text-slate-700 transition-colors">
            2
          </div>
          <div className="relative z-10">
            <div className="w-14 h-14 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-6">
              <span className="material-icons-outlined text-2xl">assignment</span>
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Guided Assessment</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              Complete a clinically-validated assessment to help us build your personalized mental health profile.
            </p>
          </div>
        </div>
        <div className="bg-white dark:bg-surface-dark rounded-2xl p-8 border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow relative group">
          <div className="absolute top-0 right-0 mt-6 mr-6 text-slate-100 dark:text-slate-800 font-bold text-8xl -z-0 opacity-50 select-none group-hover:text-blue-50 dark:group-hover:text-slate-700 transition-colors">
            3
          </div>
          <div className="relative z-10">
            <div className="w-14 h-14 bg-teal-100 dark:bg-teal-900/30 rounded-xl flex items-center justify-center text-teal-600 dark:text-teal-400 mb-6">
              <span className="material-icons-outlined text-2xl">insights</span>
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Personalized Insights</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              Receive actionable insights and get matched with the perfect therapist for your specific journey.
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default Process;

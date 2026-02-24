import React from "react";
import { Link } from "react-router-dom";

const Hero = () => (
  <section className="pt-32 pb-20 lg:pt-40 lg:pb-28 overflow-hidden relative">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        
        {/* LEFT CONTENT */}
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800 mb-6">
            <span className="flex h-2 w-2 rounded-full bg-primary"></span>
            <span className="text-sm font-medium text-primary">
              New: AI-Powered Daily Check-ins
            </span>
          </div>

          <h1 className="text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 dark:text-white mb-6 leading-tight">
            Your Path to <span className="text-primary">Mental Clarity</span>, Powered by AI &amp; Care.
          </h1>

          <p className="text-lg text-slate-600 dark:text-slate-300 mb-8 leading-relaxed max-w-lg">
            MindBridge combines advanced AI emotional analysis with professional human therapy to provide structured support when you need it most.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              to="/signup"
              className="bg-primary hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
            >
              Start Free Assessment
              <span className="material-icons-outlined">arrow_forward</span>
            </Link>

            <Link
              to="/find"
              className="bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 px-8 py-4 rounded-xl font-semibold text-lg transition-all flex items-center justify-center gap-2"
            >
              <span className="material-icons-outlined">calendar_month</span>
              Book a Therapist
            </Link>
          </div>

          <div className="mt-8 flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
            <div className="flex -space-x-2">
              <img
                alt="User avatar"
                className="inline-block h-8 w-8 rounded-full ring-2 ring-white dark:ring-slate-900"
                src="https://i.pravatar.cc/100?img=1"
              />
              <img
                alt="User avatar"
                className="inline-block h-8 w-8 rounded-full ring-2 ring-white dark:ring-slate-900"
                src="https://i.pravatar.cc/100?img=2"
              />
              <img
                alt="User avatar"
                className="inline-block h-8 w-8 rounded-full ring-2 ring-white dark:ring-slate-900"
                src="https://i.pravatar.cc/100?img=3"
              />
            </div>
            <p>Trusted by 10,000+ users</p>
          </div>
        </div>

        {/* RIGHT PREVIEW */}
        <div className="relative lg:block hidden">
          <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-tr from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-900 p-8 border border-slate-100 dark:border-slate-700">
            
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-primary/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 bg-blue-400/10 rounded-full blur-3xl"></div>

            {/* AI Message */}
            <div className="bg-surface-light dark:bg-surface-dark rounded-xl p-6 shadow-sm border border-slate-100 dark:border-slate-700 mb-6 max-w-sm ml-auto">
              <div className="flex items-center gap-3 mb-3">
                <div className="h-8 w-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400">
                  <span className="material-icons-outlined text-sm">
                    smart_toy
                  </span>
                </div>
                <span className="text-sm font-semibold text-slate-900 dark:text-white">
                  MindBridge AI
                </span>
              </div>
              <p className="text-slate-600 dark:text-slate-300 text-sm">
                I noticed you've been feeling anxious in the evenings. Would you like to try a guided breathing exercise?
              </p>
            </div>

            {/* User Message */}
            <div className="bg-primary text-white rounded-xl p-6 shadow-lg mb-6 max-w-sm mr-auto">
              <div className="flex items-center gap-3 mb-3">
                <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center text-white">
                  <span className="material-icons-outlined text-sm">
                    person
                  </span>
                </div>
                <span className="text-sm font-semibold text-white">You</span>
              </div>
              <p className="text-white/90 text-sm">
                That would be really helpful right now. Thank you.
              </p>
            </div>

            {/* Upcoming Session Card */}
            <div className="bg-surface-light dark:bg-surface-dark rounded-xl p-4 shadow-sm border border-slate-100 dark:border-slate-700 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  alt="Doctor"
                  className="w-12 h-12 rounded-full object-cover"
                  src="https://i.pravatar.cc/100?img=12"
                />
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    Dr. Sarah Chen
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Next Session: Tomorrow, 2 PM
                  </p>
                </div>
              </div>
              <button className="p-2 text-primary hover:bg-blue-50 dark:hover:bg-slate-700 rounded-full transition-colors">
                <span className="material-icons-outlined">videocam</span>
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  </section>
);

export default Hero;
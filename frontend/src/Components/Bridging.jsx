import React from 'react';

const Bridging = () => (
  <section className="py-24 bg-white dark:bg-surface-dark">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid lg:grid-cols-2 gap-16 items-center">
        <div className="order-2 lg:order-1 relative">
          <img
            alt="Therapist talking to patient"
            className="rounded-2xl shadow-xl w-full object-cover h-[500px]"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDKpKvFmiKImiAt4cO8PFjZqwbX5hvVIN8NNp-rApiM3XUAfzOBcdYzf8VwokhFYxA80z6YdbMgOLMqtCBtqdwjvcvQrMukjeVglVjq4zGyEl0ck7Rf_YaErM_tj5ld6LRSMnJlTjCfjlzB328EnxgF0ltcRcySoo-cJjynKb3NlBxbioUv0D2hDX0oIDxw-P-HCk3CcleKKhekaIPvM34RDFSqbK7XoIHNEcEma_LG71N4S22aaGgQqShq4r0adH5HTwGBe4ypzj8"
          />
          <div className="absolute -bottom-8 -right-8 bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-100 dark:border-slate-700 max-w-xs hidden md:block">
            <div className="flex items-center gap-2 mb-2">
              <span className="material-icons-outlined text-yellow-500">star</span>
              <span className="material-icons-outlined text-yellow-500">star</span>
              <span className="material-icons-outlined text-yellow-500">star</span>
              <span className="material-icons-outlined text-yellow-500">star</span>
              <span className="material-icons-outlined text-yellow-500">star</span>
            </div>
            <p className="text-slate-800 dark:text-slate-200 text-sm font-medium italic">
              "MindBridge helped me find a therapist who actually understands my background. It's been life-changing."
            </p>
            <p className="text-slate-500 dark:text-slate-400 text-xs mt-3">
              - James R., Product Manager
            </p>
          </div>
        </div>
        <div className="order-1 lg:order-2">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-6">
            Bridging the gap between technology and empathy
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-300 mb-8">
            We believe that mental healthcare shouldn't be a one-size-fits-all solution. Our platform adapts to your unique needs.
          </p>
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="flex-shrink-0 mt-1">
                <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-primary">
                  <span className="material-icons-outlined">verified_user</span>
                </div>
              </div>
              <div>
                <h4 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">Safe &amp; Confidential</h4>
                <p className="text-slate-600 dark:text-slate-400">Your privacy is our priority. All sessions and data are encrypted with enterprise-grade security.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 mt-1">
                <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400">
                  <span className="material-icons-outlined">psychology_alt</span>
                </div>
              </div>
              <div>
                <h4 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">Cognitive Behavioral AI</h4>
                <p className="text-slate-600 dark:text-slate-400">Our AI tools are built on CBT principles to help you reframe negative thoughts in real-time.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 mt-1">
                <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-orange-600 dark:text-orange-400">
                  <span className="material-icons-outlined">event_available</span>
                </div>
              </div>
              <div>
                <h4 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">Flexible Scheduling</h4>
                <p className="text-slate-600 dark:text-slate-400">Book sessions that fit your life. Early morning, late night, or weekends—we are here.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default Bridging;

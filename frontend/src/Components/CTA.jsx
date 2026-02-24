import React from 'react';
import { Link } from 'react-router-dom';

const CTA = () => (
  <section className="py-20 relative overflow-hidden">
    <div className="absolute inset-0 bg-primary dark:bg-blue-900">
      <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-black/10 rounded-full blur-3xl" />
    </div>
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
      <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Start your journey to better mental health today.</h2>
      <p className="text-blue-100 text-lg md:text-xl mb-10 max-w-2xl mx-auto">
        No waiting lists. No confusing processes. Just immediate support and clear guidance, right when you need it.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link className="bg-white text-primary hover:bg-blue-50 px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-lg" to="/signup">
          Start Free Assessment
        </Link>
        <Link className="bg-blue-600 text-white border border-blue-400 hover:bg-blue-700 px-8 py-4 rounded-xl font-bold text-lg transition-all" to="#">
          Talk to Sales
        </Link>
      </div>
    </div>
  </section>
);

export default CTA;
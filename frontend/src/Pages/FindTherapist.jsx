import React from 'react';
import NavBar from '../Components/NavBar';
import SearchFilters from '../Components/SearchFilters';
import TherapistCard from '../Components/TherapistCard';
import Pagination from '../Components/Pagination';
import Footer from '../Components/Footer';

// sample data (could come from API later)
const therapists = [
  {
    id: 1,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDFRgNnjteDP0mVtcYyz2wfbWOYGgCLTvChpwos2okiIw9q2tuJr2602pO4BLPzybIKdUUgjIvIUCh4COY4YRfsyV87RCHy67Lp7h96L1C6sPFFuR9sa9zZAQ4MRTBPvaXL_NPaCoj0bq8Yab1mqy66EcpRzf0AoJ2buwlYt8itm_kp7gLJf4qM7oWv9GmvyUnwTOvVdEGCDOMwi7sfRV3RVKxYifc1YwDuW4qvUnoJoNicTKH4pXoJY4ssnZ7qFbpktcACxvZ_q4A',
    name: 'Dr. Sarah Jenkins',
    title: 'Psy.D, Clinical Psychologist',
    tags: ['Anxiety', 'Burnout', 'CBT'],
    availability: 'Available Today',
    price: 150,
    type: 'Video',
    rating: '4.9',
  },
  {
    id: 2,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBHJQHVotsDJOlrsDOfHxG-N-EpFjxlxWbKn2LNeHJJc9nZBRtwHEQE2jLuXilXE73MuLCq5zhBIrRV2XZj5agq00OEr3ME-BDuRBrvVYDxYJvwT_lZT78NUskM0n7uW0KwT4QxpfKgEYIX8or_QEl9Sx5y-I6-B1Jl5ArRKPturXNSh7LKHpOvCjWJNUYcC8Fxqk0WEfD_oiR5Qr9ytlo-ab-41P_ju52CciQVh0KGvmLAcWJ6jt0ikM6AJ77V0nkj9jCwmSiV2Qg',
    name: 'Mark Thompson',
    title: 'LCSW, Therapist',
    tags: ['Relationships', 'Family', "Men's Issues"],
    availability: null,
    price: 120,
    type: 'In-Person',
    rating: '4.8',
  },
  {
    id: 3,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDZDb2-S6k0_oH6zbk0jsIqHb_K3x2xdVrlZnqQtCqKryELYQFxHsObl62hcteOR4TxCiCnPmQ7LTwJtc4GIbja8Fno0cRDVR9LV2CLfsk0PrlD64mB5JLeq4BkuHznfnIkuoR-iOt-tY-VheEEc2LuxWscQtNl1xV2Zt4d6Hv2uKNlE4oIPQkWJY6Y5eXDay-cvCJo0EUEUw83HKksYJN9Q-S4dD4lwrFTBaLSO869q9moHKTWbI7R9tIQKPbueNA01AyonKTp3ns',
    name: 'Dr. Emily Chen',
    title: 'MD, Psychiatrist',
    tags: ['Medication', 'ADHD', 'Depression'],
    availability: null,
    price: 220,
    type: 'Video',
    rating: '5.0',
    specialLabel: 'Instant Match',
  },
];

const FindTherapist = () => (
  <>
    <NavBar />

    <header className="relative pt-16 pb-12 overflow-hidden bg-white dark:bg-white">
      <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-blue-100/50 to-transparent dark:from-blue-900/20 dark:to-transparent pointer-events-none"></div>
      <div className="absolute -top-24 -left-24 w-64 h-64 bg-blue-200/30 dark:bg-blue-800/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800 mb-6">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
          <span className="text-xs font-semibold text-primary dark:text-blue-300 uppercase tracking-wider">
            AI-Matches Available
          </span>
        </div>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tight text-gray-900 dark:text-gray-900">
          Find the right care,
          <br />
          <span className="gradient-text">naturally tailored to you.</span>
        </h1>
        <p className="text-lg text-gray-900 dark:text-gray-900 max-w-2xl mx-auto mb-10">
          Connect with licensed therapists specialized in your unique needs. Use our advanced filters to find a professional who truly listens.
        </p>
        <SearchFilters />
      </div>
    </header>

    <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full bg-white dark:bg-white">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Recommended Therapists</h2>
        <div className="flex gap-2">
          <span className="text-sm text-subtext-light dark:text-subtext-dark">Sort by:</span>
          <select className="text-sm font-medium bg-transparent border-none p-0 pr-4 text-primary dark:text-blue-400 focus:ring-0 cursor-pointer">
            <option>Relevance</option>
            <option>Rating</option>
            <option>Price: Low to High</option>
          </select>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {therapists.map((t) => (
          <TherapistCard key={t.id} {...t} />
        ))}
      </div>
      <Pagination />
    </main>

    <Footer />
  </>
);

export default FindTherapist;

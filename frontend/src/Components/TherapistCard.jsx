import React from 'react';
import { Link } from 'react-router-dom';

const TherapistCard = ({
  image,
  name,
  title,
  tags,
  availability,
  price,
  type,
  rating,
  specialLabel,
}) => (
  <div className="bg-surface-light dark:bg-surface-dark rounded-2xl border border-gray-100 dark:border-gray-700 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full group overflow-hidden">
    <div className="relative h-48 bg-gray-100 dark:bg-gray-800">
      <img
        alt={name}
        className="w-full h-full object-cover object-top opacity-90 group-hover:opacity-100 transition-opacity"
        src={image}
      />
      {rating && (
        <div className="absolute top-3 right-3 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center gap-1 shadow-sm">
          <span className="material-icons-outlined text-yellow-500 text-sm">
            star
          </span>
          <span className="text-xs font-bold text-gray-900 dark:text-white">
            {rating}
          </span>
        </div>
      )}
      {availability && (
        <div className="absolute bottom-3 left-3 bg-green-100 dark:bg-green-900/60 text-green-700 dark:text-green-300 text-xs font-bold px-2 py-1 rounded-md flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
          {availability}
        </div>
      )}
      {specialLabel && (
        <div className="absolute bottom-3 left-3 bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 text-xs font-bold px-2 py-1 rounded-md flex items-center gap-1">
          <span className="material-icons-outlined text-[10px]">bolt</span>
          {specialLabel}
        </div>
      )}
    </div>
    <div className="p-5 flex flex-col flex-grow">
      <div className="mb-4">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">
          {name}
        </h3>
        <p className="text-sm text-primary dark:text-blue-400 font-medium">
          {title}
        </p>
      </div>
      <div className="flex flex-wrap gap-2 mb-4">
        {tags.map((t) => (
          <span
            key={t}
            className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-xs px-2 py-1 rounded-md"
          >
            {t}
          </span>
        ))}
      </div>
      {/** description omitted for brevity **/}
      <div className="mt-auto flex flex-col gap-3">
        <div className="flex items-center justify-between text-xs text-subtext-light dark:text-subtext-dark mb-1">
          <span className="flex items-center gap-1">
            <span className="material-icons-outlined text-sm">
              {type === 'video' ? 'videocam' : 'location_on'}
            </span>{' '}
            {type}
          </span>
          <span className="font-semibold text-gray-900 dark:text-white">
            ${price}
            <span className="font-normal text-subtext-light dark:text-subtext-dark">
              /session
            </span>
          </span>
        </div>
        <div className="flex gap-3">
          <button className="flex-1 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            Profile
          </button>
          <button className="flex-1 py-2.5 rounded-xl bg-primary text-white font-medium text-sm hover:bg-blue-700 transition-colors shadow-glow">
            Book Now
          </button>
        </div>
      </div>
    </div>
  </div>
);

export default TherapistCard;

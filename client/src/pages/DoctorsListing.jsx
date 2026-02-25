import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Star, MapPin, Award, Clock, Zap } from 'lucide-react';
import Layout from '../components/Layout';
import { doctorAPI } from '../services/api';

export default function DoctorsListing() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [specialization, setSpecialization] = useState('');

  const specializations = [
    'All Specializations',
    'Clinical Psychologist',
    'Psychiatrist',
    'Therapist',
    'Counselor',
    'Life Coach',
  ];

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await doctorAPI.getAllDoctors({
          specialization: specialization || undefined,
        });
        setDoctors(response.data);
      } catch (error) {
        console.error('Failed to fetch doctors:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, [specialization]);

  if (loading) {
    return (
      <Layout>
        <div className="section bg-gradient-to-br from-neutral-50 to-neutral-100">
          <div className="container-max flex flex-col items-center justify-center py-24">
            <div className="spinner border-4 border-neutral-200 border-t-primary-main"></div>
            <p className="text-neutral-600 mt-4 font-medium">Loading therapists...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Header */}
      <section className="section-lg bg-gradient-to-br from-primary-main via-primary-light to-primary-dark">
        <div className="container-max">
          <div className="space-y-4 text-white">
            <h1 className="text-5xl md:text-6xl font-display font-bold leading-tight">
              Find Your Perfect Therapist
            </h1>
            <p className="text-xl text-white/90 max-w-2xl">
              Connect with licensed mental health professionals who specialize in your needs. Our vetted network of therapists is ready to support your wellness journey.
            </p>
          </div>
        </div>
      </section>

      {/* Filters & Results */}
      <section className="section bg-neutral-50">
        <div className="container-max">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar Filters */}
            <div className="lg:col-span-1">
              <div className="card-nohover sticky top-32">
                <h3 className="text-lg font-semibold text-neutral-900 mb-6">Filters</h3>

                {/* Specialization Filter */}
                <div className="space-y-3">
                  <label className="form-label text-sm">Specialization</label>
                  <div className="space-y-2">
                    {specializations.map((spec) => (
                      <button
                        key={spec}
                        onClick={() => setSpecialization(spec === 'All Specializations' ? '' : spec)}
                        className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-all duration-base border ${
                          (spec === 'All Specializations' && !specialization) ||
                          specialization === spec
                            ? 'bg-primary-main text-white border-primary-main'
                            : 'text-neutral-700 border-neutral-200 hover:border-primary-main/50 bg-white'
                        }`}
                      >
                        {spec}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Clear Filters */}
                {specialization && (
                  <button
                    onClick={() => setSpecialization('')}
                    className="w-full mt-6 py-2 text-primary-main font-medium hover:bg-primary-main/5 rounded-lg transition-all duration-base"
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            </div>

            {/* Results Grid */}
            <div className="lg:col-span-3">
              {doctors.length === 0 ? (
                <div className="card-nohover text-center py-16">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-neutral-100 mb-6">
                    <MapPin size={32} className="text-neutral-400" />
                  </div>
                  <h3 className="text-2xl font-semibold text-neutral-900 mb-2">No therapists found</h3>
                  <p className="text-neutral-600">Try adjusting your filters or explore other specializations.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-sm font-medium text-neutral-600 mb-6">
                    Showing {doctors.length} therapist{doctors.length !== 1 ? 's' : ''}
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {doctors.map((doctor) => (
                      <Link
                        key={doctor._id}
                        to={`/doctor/${doctor._id}`}
                        className="group card hover-lift overflow-hidden"
                      >
                        {/* Header Image */}
                        <div className="h-40 bg-gradient-to-br from-primary-main/20 to-primary-light/20 relative overflow-hidden mb-6">
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary-main to-primary-light flex items-center justify-center shadow-lg">
                              <Award size={48} className="text-white" />
                            </div>
                          </div>
                        </div>

                        {/* Content */}
                        <div className="space-y-4">
                          {/* Name & Title */}
                          <div>
                            <h3 className="text-xl font-semibold text-neutral-900 group-hover:text-primary-main transition-colors duration-base">
                              {doctor.userId?.fullName}
                            </h3>
                            <p className="text-primary-main font-medium text-sm mt-1">{doctor.specialization}</p>
                          </div>

                          {/* Bio */}
                          {doctor.bio && (
                            <p className="text-neutral-600 text-sm leading-relaxed line-clamp-2">
                              {doctor.bio}
                            </p>
                          )}

                          {/* Stats */}
                          <div className="grid grid-cols-3 gap-4 py-4 border-t border-b border-neutral-200">
                            <div className="flex flex-col items-center">
                              <Clock size={18} className="text-primary-main mb-2" />
                              <span className="text-sm font-semibold text-neutral-900">
                                {doctor.experience}y
                              </span>
                              <span className="text-xs text-neutral-500">Experience</span>
                            </div>
                            <div className="flex flex-col items-center">
                              <Star size={18} className="text-yellow-400 fill-yellow-400 mb-2" />
                              <span className="text-sm font-semibold text-neutral-900">
                                {doctor.rating || 'N/A'}
                              </span>
                              <span className="text-xs text-neutral-500">Rating</span>
                            </div>
                            <div className="flex flex-col items-center">
                              <Zap size={18} className="text-primary-main mb-2" />
                              <span className="text-sm font-semibold text-neutral-900">
                                ${doctor.hourlyRate}
                              </span>
                              <span className="text-xs text-neutral-500">/hour</span>
                            </div>
                          </div>

                          {/* Languages */}
                          {doctor.languages && doctor.languages.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                              {doctor.languages.slice(0, 3).map((lang, idx) => (
                                <span
                                  key={idx}
                                  className="badge badge-primary text-xs"
                                >
                                  {lang}
                                </span>
                              ))}
                            </div>
                          )}

                          {/* CTA Button */}
                          <button className="btn-primary w-full py-3 font-semibold mt-4">
                            View Profile
                          </button>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}

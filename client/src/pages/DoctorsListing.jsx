import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Star, MapPin, Award, Clock, Zap, RefreshCw } from 'lucide-react';
import Layout from '../components/Layout';
import { doctorAPI, appointmentAPI } from '../services/api';

export default function DoctorsListing() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [specialization, setSpecialization] = useState('');
  const location = useLocation();
  const [doctorCount, setDoctorCount] = useState(0);
  const [bookingDoctor, setBookingDoctor] = useState(null);
  const navigate = useNavigate();
  const [bookingForm, setBookingForm] = useState({
    appointmentDate: '',
    consultationType: 'video',
    notes: '',
  });
  const [bookingLoading, setBookingLoading] = useState(false);

  const specializations = [
    'All Specializations',
    'Clinical Psychologist',
    'Psychiatrist',
    'Therapist',
    'Counselor',
    'Life Coach',
  ];

  const fetchDoctors = async () => {
    try {
      const response = await doctorAPI.getAllDoctors({
        specialization: specialization || undefined,
        // include unverified doctors for immediate visibility (could remove in production)
        includeUnverified: true,
      });
      setDoctors(response.data);
      // also fetch count to display
      const countRes = await doctorAPI.getDoctorCount({ includeUnverified: true });
      setDoctorCount(countRes.data.count || 0);
    } catch (error) {
      console.error('Failed to fetch doctors:', error);
    } finally {
      setLoading(false);
    }
  };

  // parse query param on mount
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const spec = params.get('specialization');
    if (spec) setSpecialization(spec);
  }, [location.search]);

  useEffect(() => {
    fetchDoctors();
    const interval = setInterval(fetchDoctors, 20000);
    return () => clearInterval(interval);
  }, [specialization]);

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    if (!bookingDoctor) return;
    setBookingLoading(true);
    try {
      await appointmentAPI.create({
        doctorId: bookingDoctor._id,
        ...bookingForm,
      });
      // refresh list or show success
      setBookingDoctor(null);
      setBookingForm({ appointmentDate: '', consultationType: 'video', notes: '' });
      alert('Appointment booked successfully');
      navigate('/appointments');
    } catch (err) {
      console.error('Booking failed', err);
      alert('Unable to book appointment');
    } finally {
      setBookingLoading(false);
    }
  };

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
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <p className="text-sm font-medium text-neutral-600">
                        Showing {doctors.length} therapist{doctors.length !== 1 ? 's' : ''}
                      </p>
                      <p className="text-xs text-neutral-500">Total in system: {doctorCount}</p>
                    </div>
                    <button
                      onClick={() => setLoading(true) || fetchDoctors()}
                      className="p-2 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg"
                      title="Refresh list"
                    >
                      <RefreshCw />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {doctors.map((doctor) => (
                      <Link
                        key={doctor._id}
                        to={`/doctor/${doctor._id}`}
                        className="group card hover-lift overflow-hidden"
                      >
                        {/* Header / avatar area (fixed height so cards align) */}
                        <div className="relative mb-6 h-40 flex items-center justify-center">
                          {doctor.userId?.profileImage ? (
                            <img
                              src={doctor.userId.profileImage}
                              alt={doctor.userId.fullName}
                              className="w-24 h-24 rounded-full mx-auto object-cover shadow-lg"
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-primary-main/20 to-primary-light/20 flex items-center justify-center">
                              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary-main to-primary-light flex items-center justify-center shadow-lg">
                                <Award size={48} className="text-white" />
                              </div>
                            </div>
                          )}
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
                          <div className="space-y-2">
                      <button
                        className="btn-primary w-full py-3 font-semibold mt-4"
                        onClick={() => setBookingDoctor(doctor)}
                      >
                        Book Appointment
                      </button>
                      <p className="block text-center text-sm text-primary-main font-medium mt-1">
                        View Profile
                      </p>
                    </div>
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

      {/* Booking modal */}
      {bookingDoctor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
            <button
              onClick={() => setBookingDoctor(null)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
            <h2 className="text-2xl font-semibold mb-4">Book with {bookingDoctor.userId?.fullName}</h2>
            <form onSubmit={handleBookingSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date & Time</label>
                {/* quick pick buttons */}
                <div className="flex gap-2 mb-2">
                  <button
                    type="button"
                    className="text-xs text-indigo-600 hover:underline"
                    onClick={() => {
                      const now = new Date();
                      const formatted = `${now.getFullYear()}-${(now.getMonth()+1)
                        .toString()
                        .padStart(2,'0')}-${now.getDate().toString().padStart(2,'0')}T${now
                        .getHours()
                        .toString()
                        .padStart(2,'0')}:${now
                        .getMinutes()
                        .toString()
                        .padStart(2,'0')}`;
                      setBookingForm({ ...bookingForm, appointmentDate: formatted });
                    }}
                  >
                    Today
                  </button>
                  <button
                    type="button"
                    className="text-xs text-indigo-600 hover:underline"
                    onClick={() => {
                      const tomorrow = new Date();
                      tomorrow.setDate(tomorrow.getDate() + 1);
                      const formatted = `${tomorrow.getFullYear()}-${(tomorrow.getMonth()+1)
                        .toString()
                        .padStart(2,'0')}-${tomorrow.getDate().toString().padStart(2,'0')}T${tomorrow
                        .getHours()
                        .toString()
                        .padStart(2,'0')}:${tomorrow
                        .getMinutes()
                        .toString()
                        .padStart(2,'0')}`;
                      setBookingForm({ ...bookingForm, appointmentDate: formatted });
                    }}
                  >
                    Tomorrow
                  </button>
                </div>
                <input
                  type="datetime-local"
                  required
                  min={
                    `${new Date().getFullYear()}-${(new Date().getMonth()+1)
                      .toString()
                      .padStart(2,'0')}-${new Date()
                      .getDate()
                      .toString()
                      .padStart(2,'0')}T${new Date()
                      .getHours()
                      .toString()
                      .padStart(2,'0')}:${new Date()
                      .getMinutes()
                      .toString()
                      .padStart(2,'0')}`
                  }
                  value={bookingForm.appointmentDate}
                  onChange={(e) => setBookingForm({...bookingForm, appointmentDate: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <select
                  value={bookingForm.consultationType}
                  onChange={(e) => setBookingForm({...bookingForm, consultationType: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="video">Video</option>
                  <option value="chat">Chat</option>
                  <option value="phone">Phone</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea
                  value={bookingForm.notes}
                  onChange={(e) => setBookingForm({...bookingForm, notes: e.target.value})}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <button
                type="submit"
                disabled={bookingLoading}
                className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50"
              >
                {bookingLoading ? 'Booking...' : 'Confirm'}
              </button>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
}

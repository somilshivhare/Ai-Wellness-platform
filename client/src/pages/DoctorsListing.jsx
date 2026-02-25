import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Star, MapPin } from 'lucide-react';
import Layout from '../components/Layout';
import { doctorAPI } from '../services/api';

export default function DoctorsListing() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [specialization, setSpecialization] = useState('');

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
        <div className="max-w-7xl mx-auto px-4 py-12 text-center">
          <p className="text-gray-600">Loading therapists...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Find Your Therapist</h1>

        <div className="mb-8">
          <select
            value={specialization}
            onChange={(e) => setSpecialization(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg"
          >
            <option value="">All Specializations</option>
            <option value="Clinical Psychologist">Clinical Psychologist</option>
            <option value="Psychiatrist">Psychiatrist</option>
            <option value="Therapist">Therapist</option>
            <option value="Counselor">Counselor</option>
            <option value="Life Coach">Life Coach</option>
          </select>
        </div>

        {doctors.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">No therapists found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {doctors.map((doctor) => (
              <Link
                key={doctor._id}
                to={`/doctor/${doctor._id}`}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition overflow-hidden"
              >
                <div className="h-48 bg-gradient-to-r from-indigo-400 to-purple-400"></div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {doctor.userId?.fullName}
                  </h3>
                  <p className="text-indigo-600 font-medium mb-2">{doctor.specialization}</p>
                  <p className="text-gray-600 text-sm mb-4">{doctor.experience} years experience</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Star size={16} className="text-yellow-400 fill-current" />
                      <span className="text-sm font-medium">{doctor.rating}</span>
                    </div>
                    <span className="text-indigo-600 font-semibold">${doctor.hourlyRate}/hr</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}

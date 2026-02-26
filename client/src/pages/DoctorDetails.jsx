import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, MapPin, Clock } from 'lucide-react';
import Layout from '../components/Layout';
import { doctorAPI } from '../services/api';

export default function DoctorDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const response = await doctorAPI.getDoctorById(id);
        setDoctor(response.data);
      } catch (error) {
        console.error('Failed to fetch doctor:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctor();
  }, [id]);

  if (loading) return <Layout><div className="text-center py-12">Loading...</div></Layout>;
  if (!doctor) return <Layout><div className="text-center py-12">Doctor not found</div></Layout>;

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="h-64 bg-gradient-to-r from-indigo-400 to-purple-400 relative">
            {doctor.userId?.profileImage && (
              <img
                src={doctor.userId.profileImage}
                alt={doctor.userId.fullName}
                className="w-32 h-32 rounded-full border-4 border-white absolute -bottom-16 left-1/2 transform -translate-x-1/2 object-cover"
              />
            )}
          </div>
          
          <div className="p-8 mt-16">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              {doctor.userId?.fullName}
            </h1>
            <p className="text-2xl text-indigo-600 font-medium mb-4">{doctor.specialization}</p>
            
            <div className="flex gap-6 mb-8">
              <div className="flex items-center gap-2">
                <Star className="text-yellow-400 fill-current" />
                <span className="text-lg font-medium">{doctor.rating} rating</span>
              </div>
              <div className="text-gray-600">{doctor.experience} years experience</div>
              <div className="text-2xl font-bold text-indigo-600">${doctor.hourlyRate}/hr</div>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">About</h2>
              <p className="text-gray-600 leading-relaxed">{doctor.bio || 'No bio available'}</p>
            </div>

            {doctor.qualifications?.length > 0 && (
              <div className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Qualifications</h2>
                <ul className="list-disc list-inside space-y-2 text-gray-600">
                  {doctor.qualifications.map((qual, i) => (
                    <li key={i}>{qual}</li>
                  ))}
                </ul>
              </div>
            )}

            {doctor.languages?.length > 0 && (
              <div className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Languages</h2>
                <p className="text-gray-600">{doctor.languages.join(', ')}</p>
              </div>
            )}

            <div className="flex gap-4">
              <button
                onClick={() => navigate(`/booking/${doctor._id}`)}
                className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-indigo-700 hover:to-purple-700 transition"
              >
                Book Appointment
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

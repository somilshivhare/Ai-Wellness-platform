import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { appointmentAPI, doctorAPI, chatAPI } from '../services/api';
import { useAuthStore } from '../store/authStore';
import { formatAppointmentDate } from '../utils/date';
import { Trash2 } from 'lucide-react';

export default function Conversations() {
  const { user } = useAuthStore();
  const [convos, setConvos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        if (user?.role === 'patient') {
          const res = await appointmentAPI.getPatientAppointments();
          setConvos(res.data);
        } else if (user?.role === 'doctor') {
          const res = await doctorAPI.getAppointments();
          setConvos(res.data);
        }
      } catch (err) {
        console.error('Failed to load conversations:', err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [user]);

  if (loading) {
    return (
      <Layout>
        <div className="text-center py-12">Loading conversations...</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8">Your Conversations</h1>
        {convos.length === 0 ? (
          <p className="text-gray-600">No conversations available.</p>
        ) : (
          <div className="space-y-4">
            {convos.map((apt) => (
              <div key={apt._id} className="bg-white shadow rounded-lg p-4 flex justify-between items-center">
                <div>
                  <p className="font-semibold">
                    {user.role === 'patient'
                      ? `With Dr. ${apt.doctorId?.userId?.fullName}`
                      : `Patient: ${apt.patientId?.userId?.fullName}`}
                  </p>
                  <p className="text-sm text-gray-600">
                    {formatAppointmentDate(apt.appointmentDate)}
                  </p>
                </div>
                <div className="flex gap-2 items-center">
                  {/* clickable join buttons */}
                  {apt.consultationType === 'chat' && (
                    <Link
                      to={`/chat/${apt._id}`}
                      className="px-3 py-1 bg-purple-600 text-white rounded-lg text-xs hover:bg-purple-700"
                    >
                      Chat
                    </Link>
                  )}
                  {apt.consultationType === 'video' && (
                    <Link
                      to={`/video/${apt._id}`}
                      className="px-3 py-1 bg-blue-600 text-white rounded-lg text-xs hover:bg-blue-700"
                    >
                      Video
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      if (
                        !window.confirm(
                          `Clear ${apt.consultationType} session for this appointment?`
                        )
                      )
                        return;
                      (async () => {
                        try {
                          if (apt.consultationType === 'chat') {
                            await chatAPI.clearChat(apt._id);
                          } else if (apt.consultationType === 'video') {
                            await appointmentAPI.clearVideoSession(apt._id);
                          }
                          // refresh list
                          setConvos((prev) => prev.filter((item) => item._id !== apt._id));
                        } catch (err) {
                          console.error('failed to clear', err);
                          alert('Could not clear session');
                        }
                      })();
                    }}
                    title="Clear session"
                    className="p-2 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}

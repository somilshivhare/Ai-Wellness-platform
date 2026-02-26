import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MessageSquare, Video, RefreshCw, Trash2 } from 'lucide-react';
import Layout from '../components/Layout';
import { appointmentAPI, chatAPI } from '../services/api';
import { formatAppointmentDate } from '../utils/date';

export default function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const response = await appointmentAPI.getPatientAppointments();
      setAppointments(response.data);
    } catch (error) {
      console.error('Failed to fetch appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Your Appointments</h1>
          <button
            onClick={fetchAppointments}
            className="p-2 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg"
            title="Refresh list"
          >
            <RefreshCw />
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          {loading ? (
            <p className="text-gray-600">Loading appointments...</p>
          ) : appointments.length === 0 ? (
            <p className="text-gray-600 text-center py-8">No appointments yet</p>
          ) : (
            <div className="space-y-4">
              {appointments.map((apt) => (
                <div
                  key={apt._id}
                  className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {apt.doctorId?.userId?.fullName || 'Doctor'}
                      </h3>
                      <p className="text-gray-600 text-sm">
                        {formatAppointmentDate(apt.appointmentDate)}
                      </p>
                      <span
                        className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-medium ${
                          apt.status === 'completed'
                            ? 'bg-green-100 text-green-800'
                            : apt.status === 'cancelled'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {apt.status}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      {apt.consultationType === 'video' && (
                        <Link
                          to={`/video/${apt._id}`}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
                        >
                          <Video size={18} />
                        </Link>
                      )}
                      {apt.consultationType === 'chat' && (
                        <Link
                          to={`/chat/${apt._id}`}
                          className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm hover:bg-purple-700"
                        >
                          <MessageSquare size={18} />
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
                              // example of deleting appointment (unrelated to session clear):
                              // await appointmentAPI.delete(apt._id);
                              fetchAppointments();
                            } catch (err) {
                              console.error('failed to clear', err);
                              alert('Could not clear session');
                            }
                          })();
                        }}
                        title="Clear session"
                        className="p-2 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

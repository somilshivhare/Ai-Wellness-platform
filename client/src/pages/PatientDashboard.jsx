import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MessageSquare, Video, Trash2 } from 'lucide-react';
import Layout from '../components/Layout';
import { appointmentAPI, doctorAPI, patientAPI, chatAPI } from '../services/api';
import { formatAppointmentDate } from '../utils/date';

export default function PatientDashboard() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [doctorCount, setDoctorCount] = useState(0);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await appointmentAPI.getPatientAppointments();
        setAppointments(response.data);
      } catch (error) {
        console.error('Failed to fetch appointments:', error);
      } finally {
        setLoading(false);
      }
    };

    const fetchDoctorCount = async () => {
      try {
        const res = await doctorAPI.getDoctorCount({ includeUnverified: true });
        setDoctorCount(res.data.count || 0);
      } catch (err) {
        console.error('Failed to fetch doctor count', err);
      }
    };

    const fetchDashboard = async () => {
      try {
        const res = await patientAPI.getDashboard();
        setNotifications(res.data.notifications || []);
        // optionally could use res.data.stats.upcomingAppointments
      } catch (err) {
        console.error('Failed to fetch patient dashboard', err);
      }
    };

    fetchAppointments();
    fetchDoctorCount();
    fetchDashboard();
  }, []);

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Your Dashboard</h1>

        {notifications && notifications.length > 0 && (
          <div className="mb-8">
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
              <p className="font-semibold text-yellow-800">
                You have {notifications.length} new notification{notifications.length !== 1 ? 's' : ''}:
              </p>
              <ul className="mt-2 list-disc list-inside text-yellow-700 text-sm">
                {notifications.map((n) => (
                  <li key={n._id}>{n.message}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Link
            to="/doctors"
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition cursor-pointer"
          >
            <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
              <Calendar className="text-indigo-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Find Doctors</h3>
            <p className="text-gray-600 text-sm">Browse and book appointments ({doctorCount} total)</p>
          </Link>

          <Link
            to="/assessment"
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition cursor-pointer"
          >
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <MessageSquare className="text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Assessment</h3>
            <p className="text-gray-600 text-sm">Complete your wellness check</p>
          </Link>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center mb-4">
              <Calendar className="text-pink-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Total Appointments</h3>
            <p className="text-gray-600 text-sm">{appointments.length} appointments</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Appointments</h2>
          
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
                        {apt.doctorId?.userId?.fullName}
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
                      {/* clear button */}
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

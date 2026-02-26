import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Users, CheckCircle, Trash2 } from 'lucide-react';
import Layout from '../components/Layout';
import { doctorAPI, chatAPI, appointmentAPI } from '../services/api';
import { formatAppointmentDate } from '../utils/date';

export default function DoctorDashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await doctorAPI.getDashboard();
        setDashboard(response.data);
      } catch (error) {
        console.error('Failed to fetch dashboard:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
    // poll every 20 seconds for new appointments/notifications
    const interval = setInterval(fetchDashboard, 20000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return <Layout><div className="text-center py-12">Loading dashboard...</div></Layout>;
  }

  if (!dashboard) {
    return <Layout><div className="text-center py-12">Failed to load dashboard</div></Layout>;
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Doctor Dashboard</h1>

        {dashboard.notifications && dashboard.notifications.length > 0 && (
          <div className="mb-8">
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
              <p className="font-semibold text-yellow-800">You have {dashboard.notifications.length} new appointment notification{dashboard.notifications.length !== 1 ? 's' : ''}:</p>
              <ul className="mt-2 list-disc list-inside text-yellow-700 text-sm">
                {dashboard.notifications.map((n) => (
                  <li key={n._id}>{n.message}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
              <Calendar className="text-indigo-600" />
            </div>
            <h3 className="text-sm font-medium text-gray-600 mb-2">Total Appointments</h3>
            <p className="text-3xl font-bold text-gray-900">{dashboard.stats.totalAppointments}</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <CheckCircle className="text-green-600" />
            </div>
            <h3 className="text-sm font-medium text-gray-600 mb-2">Completed</h3>
            <p className="text-3xl font-bold text-gray-900">{dashboard.stats.completedAppointments}</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <Users className="text-blue-600" />
            </div>
            <h3 className="text-sm font-medium text-gray-600 mb-2">Upcoming</h3>
            <p className="text-3xl font-bold text-gray-900">{dashboard.stats.upcomingAppointments}</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mb-4">
              <Users className="text-teal-600" />
            </div>
            <h3 className="text-sm font-medium text-gray-600 mb-2">Total Patients</h3>
            <p className="text-3xl font-bold text-gray-900">{dashboard.stats.totalPatients || 0}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Appointments</h2>
          
          {dashboard.recentAppointments.length === 0 ? (
            <p className="text-gray-600 text-center py-8">No appointments</p>
          ) : (
            <div className="space-y-4">
              {dashboard.recentAppointments.map((apt) => (
                <div
                  key={apt._id}
                  className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {apt.patientId?.userId?.fullName}
                      </h3>
                      <p className="text-gray-600 text-sm">
                        {formatAppointmentDate(apt.appointmentDate)}
                      </p>
                      {apt.notes && (
                        <p className="text-gray-600 text-sm mt-1 italic">
                          "{apt.notes}"
                        </p>
                      )}
                      <span className="inline-block mt-2 px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-full font-medium">
                        {apt.consultationType}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {apt.consultationType === 'video' && (
                        <Link
                          to={`/video/${apt._id}`}
                          className="px-3 py-1 bg-blue-600 text-white rounded-lg text-xs hover:bg-blue-700"
                        >
                          Video
                        </Link>
                      )}
                      {apt.consultationType === 'chat' && (
                        <Link
                          to={`/chat/${apt._id}`}
                          className="px-3 py-1 bg-purple-600 text-white rounded-lg text-xs hover:bg-purple-700"
                        >
                          Chat
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
                              // refresh dashboard
                              const resp = await doctorAPI.getDashboard();
                              setDashboard(resp.data);
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
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          apt.status === 'completed'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {apt.status}
                      </span>
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

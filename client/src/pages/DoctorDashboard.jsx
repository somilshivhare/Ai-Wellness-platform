import { useState, useEffect } from 'react';
import { Calendar, Users, CheckCircle } from 'lucide-react';
import Layout from '../components/Layout';
import { doctorAPI } from '../services/api';

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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
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
                        {new Date(apt.appointmentDate).toLocaleString()}
                      </p>
                      <span className="inline-block mt-2 px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-full font-medium">
                        {apt.consultationType}
                      </span>
                    </div>
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
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

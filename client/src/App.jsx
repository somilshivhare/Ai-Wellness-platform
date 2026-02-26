import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAuthStore } from './store/authStore';
import { authAPI } from './services/api';

// Pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Assessment from './pages/Assessment';
import DoctorsListing from './pages/DoctorsListing';
import DoctorDetails from './pages/DoctorDetails';
import Booking from './pages/Booking';
import Appointments from './pages/Appointments';
import Chat from './pages/Chat';
import VideoCall from './pages/VideoCall';
import PatientDashboard from './pages/PatientDashboard';
import DoctorDashboard from './pages/DoctorDashboard';
import DoctorProfile from './pages/DoctorProfile';
import Contact from './pages/Contact';
import Conversations from './pages/Conversations';

// Hooks
const ProtectedRoute = ({ children, requiredRole }) => {
  const { user } = useAuthStore();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default function App() {
  const { user, setUser, setToken, token } = useAuthStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const checkAuth = async () => {
      try {
        if (token) {
          const response = await authAPI.getMe();
          setUser(response.data.user);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        setToken(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading MindBridge...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route
          path="/"
          element={
            // if user already logged in, send them to their dashboard instead
            user ? (
              <Navigate
                to={user.role === 'doctor' ? '/doctor-dashboard' : '/dashboard'}
                replace
              />
            ) : (
              <Landing />
            )
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/contact" element={<Contact />} />

        {/* Patient Routes */}
        <Route
          path="/assessment"
          element={
            <ProtectedRoute requiredRole="patient">
              <Assessment />
            </ProtectedRoute>
          }
        />
        <Route
          path="/doctors"
          element={
            <ProtectedRoute requiredRole="patient">
              <DoctorsListing />
            </ProtectedRoute>
          }
        />
        <Route
          path="/doctor/:id"
          element={
            <ProtectedRoute requiredRole="patient">
              <DoctorDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/booking/:doctorId"
          element={
            <ProtectedRoute requiredRole="patient">
              <Booking />
            </ProtectedRoute>
          }
        />
        <Route
          path="/appointments"
          element={
            <ProtectedRoute requiredRole="patient">
              <Appointments />
            </ProtectedRoute>
          }
        />
        <Route
          path="/chat/:appointmentId"
          element={
            <ProtectedRoute>
              <Chat />
            </ProtectedRoute>
          }
        />
        <Route
          path="/video/:appointmentId"
          element={
            <ProtectedRoute>
              <VideoCall />
            </ProtectedRoute>
          }
        />
        <Route
          path="/conversations"
          element={
            <ProtectedRoute>
              <Conversations />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute requiredRole="patient">
              <PatientDashboard />
            </ProtectedRoute>
          }
        />

        {/* Doctor Routes */}
        <Route
          path="/doctor-dashboard"
          element={
            <ProtectedRoute requiredRole="doctor">
              <DoctorDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/doctor-profile"
          element={
            <ProtectedRoute requiredRole="doctor">
              <DoctorProfile />
            </ProtectedRoute>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, LogOut, User } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

export default function Layout({ children }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isPatient = user?.role === 'patient';
  const isDoctor = user?.role === 'doctor';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">MB</span>
              </div>
              <span className="font-bold text-gray-900">MindBridge</span>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-1">
              {!user ? (
                <>
                  <Link
                    to="/login"
                    className="px-4 py-2 text-gray-700 hover:text-indigo-600 transition"
                  >
                    Login
                  </Link>
                  <Link
                    to="/contact"
                    className="px-4 py-2 text-gray-700 hover:text-indigo-600 transition"
                  >
                    Contact
                  </Link>
                </>
              ) : (
                <>
                  {isPatient && (
                    <>
                      <Link
                        to="/doctors"
                        className="px-4 py-2 text-gray-700 hover:text-indigo-600 transition"
                      >
                        Find Doctors
                      </Link>
                      <Link
                        to="/dashboard"
                        className="px-4 py-2 text-gray-700 hover:text-indigo-600 transition"
                      >
                        Dashboard
                      </Link>
                    </>
                  )}
                  {isDoctor && (
                    <>
                      <Link
                        to="/doctor-dashboard"
                        className="px-4 py-2 text-gray-700 hover:text-indigo-600 transition"
                      >
                        Dashboard
                      </Link>
                      <Link
                        to="/doctor-profile"
                        className="px-4 py-2 text-gray-700 hover:text-indigo-600 transition"
                      >
                        Profile
                      </Link>
                    </>
                  )}
                  <div className="flex items-center space-x-3 border-l pl-4">
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">{user?.fullName}</p>
                      <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="p-2 text-gray-500 hover:text-red-600 transition"
                      title="Logout"
                    >
                      <LogOut size={20} />
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden pb-4 space-y-2">
              {!user ? (
                <>
                  <Link
                    to="/login"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded"
                  >
                    Login
                  </Link>
                  <Link
                    to="/contact"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded"
                  >
                    Contact
                  </Link>
                </>
              ) : (
                <>
                  {isPatient && (
                    <>
                      <Link
                        to="/doctors"
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded"
                      >
                        Find Doctors
                      </Link>
                      <Link
                        to="/dashboard"
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded"
                      >
                        Dashboard
                      </Link>
                    </>
                  )}
                  {isDoctor && (
                    <>
                      <Link
                        to="/doctor-dashboard"
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded"
                      >
                        Dashboard
                      </Link>
                      <Link
                        to="/doctor-profile"
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded"
                      >
                        Profile
                      </Link>
                    </>
                  )}
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 rounded flex items-center"
                  >
                    <LogOut size={18} className="mr-2" />
                    Logout
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-bold text-white mb-4">MindBridge AI</h3>
              <p className="text-sm">Your path to mental wellness, powered by AI.</p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Services</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition">Therapy</a></li>
                <li><a href="#" className="hover:text-white transition">Counseling</a></li>
                <li><a href="#" className="hover:text-white transition">Assessment</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/contact" className="hover:text-white transition">Contact</Link></li>
                <li><a href="#" className="hover:text-white transition">Privacy</a></li>
                <li><a href="#" className="hover:text-white transition">Terms</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Resources</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition">Blog</a></li>
                <li><a href="#" className="hover:text-white transition">FAQ</a></li>
                <li><a href="#" className="hover:text-white transition">Support</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-sm">
            <p>&copy; 2024 MindBridge AI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

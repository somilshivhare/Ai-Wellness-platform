import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, LogOut, User, Heart } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

export default function Layout({ children }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
    setUserMenuOpen(false);
  };

  const isPatient = user?.role === 'patient';
  const isDoctor = user?.role === 'doctor';

  const navItems = user ? (
    isPatient ? [
      { label: 'Find Doctors', path: '/doctors' },
      { label: 'Appointments', path: '/appointments' },
      { label: 'Assessment', path: '/assessment' },
      { label: 'Conversations', path: '/conversations' },
      { label: 'Dashboard', path: '/dashboard' },
    ] : [
      { label: 'Dashboard', path: '/doctor-dashboard' },
      { label: 'Conversations', path: '/conversations' },
      { label: 'Profile', path: '/doctor-profile' },
    ]
  ) : [
    { label: 'Contact', path: '/contact' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Premium Navigation */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-neutral-200">
        <div className="container-max">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-main to-primary-light rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-base">
                <Heart size={22} className="text-white fill-white" />
              </div>
              <div className="flex flex-col">
                <span className="font-display font-bold text-neutral-900 text-lg leading-none">MindBridge</span>
                <span className="text-xs text-primary-main font-semibold">Wellness</span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className="px-4 py-2 text-neutral-700 hover:text-primary-main font-medium transition-colors duration-base rounded-lg hover:bg-primary-main/5"
                >
                  {item.label}
                </Link>
              ))}
              {!user && (
                <Link
                  to="/login"
                  className="px-4 py-2 text-neutral-700 hover:text-primary-main font-medium transition-colors duration-base rounded-lg hover:bg-primary-main/5"
                >
                  Login
                </Link>
              )}
            </div>

            {/* User Menu or CTA */}
            <div className="hidden md:flex items-center gap-4">
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen((o) => !o)}
                    className="flex items-center gap-3 pl-4 border-l border-neutral-200"
                  >
                    <div className="text-right">
                      <p className="text-sm font-semibold text-neutral-900">{user?.fullName}</p>
                      <p className="text-xs text-neutral-500 capitalize">{user?.role}</p>
                    </div>
                    <LogOut size={20} className="text-neutral-500" />
                  </button>
                  {userMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg py-1 z-10">
                      <Link
                        to={isDoctor ? '/doctor-profile' : '/profile'}
                        className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        My Profile
                      </Link>
                      <p className="px-4 py-2 text-sm text-neutral-700">
                        <a href={`mailto:${user?.email}`} className="underline">
                          {user?.email}
                        </a>
                      </p>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link to="/login" className="btn-primary">
                  Get Started
                </Link>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 text-neutral-700 hover:bg-neutral-100 rounded-lg transition-colors duration-base"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden pb-4 animate-slideDown border-t border-neutral-200">
              <div className="flex flex-col gap-2 py-4">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className="px-4 py-3 text-neutral-700 hover:bg-primary-main/5 hover:text-primary-main rounded-lg font-medium transition-all duration-base"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
                {!user && (
                  <Link
                    to="/login"
                    className="px-4 py-3 text-neutral-700 hover:bg-primary-main/5 hover:text-primary-main rounded-lg font-medium transition-all duration-base"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                )}
                {user && (
                  <>
                    <Link
                      to={isDoctor ? '/doctor-profile' : '/profile'}
                      className="px-4 py-2 text-sm text-neutral-700 border-b border-neutral-200 hover:bg-neutral-100 rounded-lg"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      My Profile
                    </Link>
                    <div className="px-4 py-2 text-sm text-neutral-700">
                      <a href={`mailto:${user.email}`} className="underline">
                        {user.email}
                      </a>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg font-medium transition-all duration-base flex items-center gap-2"
                    >
                      <LogOut size={18} />
                      Logout
                    </button>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1">{children}</main>

      {/* Modern Footer */}
      <footer className="bg-gradient-to-b from-neutral-50 to-neutral-100 border-t border-neutral-200 mt-20 md:mt-32">
        <div className="container-max py-16 md:py-20">
          {/* Main Footer Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
            {/* Brand */}
            <div className="space-y-4">
              <Link to="/" className="flex items-center gap-3 group mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-primary-main to-primary-light rounded-xl flex items-center justify-center shadow-lg">
                  <Heart size={22} className="text-white fill-white" />
                </div>
                <span className="font-display font-bold text-neutral-900">MindBridge</span>
              </Link>
              <p className="text-neutral-600 text-sm leading-relaxed">
                Your trusted companion for mental wellness. Connect with licensed therapists and take control of your mental health.
              </p>
            </div>

            {/* Services */}
            <div>
              <h4 className="font-semibold text-neutral-900 mb-6">Services</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-neutral-600 hover:text-primary-main transition-colors duration-base text-sm font-medium">Therapy Sessions</a></li>
                <li><a href="#" className="text-neutral-600 hover:text-primary-main transition-colors duration-base text-sm font-medium">Counseling</a></li>
                <li><a href="#" className="text-neutral-600 hover:text-primary-main transition-colors duration-base text-sm font-medium">Wellness Assessment</a></li>
                <li><a href="#" className="text-neutral-600 hover:text-primary-main transition-colors duration-base text-sm font-medium">Video Consultations</a></li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="font-semibold text-neutral-900 mb-6">Company</h4>
              <ul className="space-y-3">
                <li><Link to="/contact" className="text-neutral-600 hover:text-primary-main transition-colors duration-base text-sm font-medium">Contact Us</Link></li>
                <li><a href="#" className="text-neutral-600 hover:text-primary-main transition-colors duration-base text-sm font-medium">Privacy Policy</a></li>
                <li><a href="#" className="text-neutral-600 hover:text-primary-main transition-colors duration-base text-sm font-medium">Terms of Service</a></li>
                <li><a href="#" className="text-neutral-600 hover:text-primary-main transition-colors duration-base text-sm font-medium">FAQ</a></li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h4 className="font-semibold text-neutral-900 mb-6">Resources</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-neutral-600 hover:text-primary-main transition-colors duration-base text-sm font-medium">Mental Health Blog</a></li>
                <li><a href="#" className="text-neutral-600 hover:text-primary-main transition-colors duration-base text-sm font-medium">Support Center</a></li>
                <li><a href="#" className="text-neutral-600 hover:text-primary-main transition-colors duration-base text-sm font-medium">Crisis Hotline</a></li>
                <li><a href="#" className="text-neutral-600 hover:text-primary-main transition-colors duration-base text-sm font-medium">Community Forum</a></li>
              </ul>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-neutral-300 my-8"></div>

          {/* Bottom Footer */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 text-sm text-neutral-600">
            <p>&copy; 2026 MindBridge AI. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-primary-main transition-colors duration-base font-medium">Security</a>
              <a href="#" className="hover:text-primary-main transition-colors duration-base font-medium">Accessibility</a>
              <a href="#" className="hover:text-primary-main transition-colors duration-base font-medium">Support</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

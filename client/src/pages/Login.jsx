import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, User, Heart, Eye, EyeOff } from 'lucide-react';
import Layout from '../components/Layout';
import { authAPI } from '../services/api';
import { useAuthStore } from '../store/authStore';

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState('patient');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    phone: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear validation error for this field
    if (validationErrors[name]) {
      setValidationErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };


  const validateForm = () => {
    const errors = {};

    if (isLogin) {
      if (!formData.email.trim()) errors.email = 'Email is required';
      if (!formData.password) errors.password = 'Password is required';
    } else {
      if (!formData.fullName.trim()) errors.fullName = 'Full name is required';
      if (!formData.email.trim()) errors.email = 'Email is required';
      if (!formData.email.includes('@')) errors.email = 'Invalid email format';
      if (!formData.phone.trim()) errors.phone = 'Phone number is required';
      if (!formData.password) errors.password = 'Password is required';
      if (formData.password.length < 6) errors.password = 'Password must be at least 6 characters';
      if (!formData.confirmPassword) errors.confirmPassword = 'Please confirm your password';
      if (formData.password !== formData.confirmPassword) {
        errors.password = 'Passwords do not match';
        errors.confirmPassword = 'Passwords do not match';
      }
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      if (isLogin) {
        // Login
        const response = await authAPI.login({
          email: formData.email,
          password: formData.password,
        });
        setAuth(response.data.user, response.data.token);
        navigate(response.data.user.role === 'doctor' ? '/doctor-dashboard' : '/dashboard');
      } else {
        // Signup
        const response = await authAPI.signup({
          email: formData.email,
          password: formData.password,
          fullName: formData.fullName,
          phone: formData.phone,
          role: role,
        });
        setAuth(response.data.user, response.data.token);
        navigate(role === 'doctor' ? '/doctor-profile' : '/assessment');
      }
    } catch (err) {
      // server may send { message } or { message, error }
      setError(
        err.response?.data?.message || err.response?.data?.error || 'An error occurred'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-[calc(100vh-80px)] bg-white flex">
        {/* Branding Side - Left */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary-main via-primary-light to-primary-dark flex-col items-center justify-center px-12 py-16">
          <div className="text-center space-y-8 max-w-lg">
            <div className="space-y-4">
              <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mx-auto shadow-xl">
                <Heart size={48} className="text-white fill-white" />
              </div>
              <h2 className="text-5xl font-display font-bold text-white leading-tight">
                Your Mental Wellness Starts Here
              </h2>
              <p className="text-lg text-white/80 leading-relaxed">
                Connect with licensed therapists, receive personalized assessments, and take control of your mental health journey.
              </p>
            </div>

            {/* Features List */}
            <div className="space-y-4 pt-8">
              <div className="flex items-center gap-4 text-white/90">
                <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                  <Mail size={24} />
                </div>
                <div className="text-left">
                  <p className="font-semibold">Secure & Private</p>
                  <p className="text-sm text-white/70">Your data is protected with encryption</p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-white/90">
                <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                  <User size={24} />
                </div>
                <div className="text-left">
                  <p className="font-semibold">Licensed Professionals</p>
                  <p className="text-sm text-white/70">Verified therapists and counselors</p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-white/90">
                <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                  <Lock size={24} />
                </div>
                <div className="text-left">
                  <p className="font-semibold">Available 24/7</p>
                  <p className="text-sm text-white/70">Support whenever you need it</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Form Side - Right */}
        <div className="w-full lg:w-1/2 flex flex-col items-center justify-center px-6 md:px-12 py-12 md:py-0">
          <div className="w-full max-w-md space-y-8 animate-slideUp">
            {/* Header */}
            <div className="text-center space-y-2">
              <h1 className="text-3xl md:text-4xl font-display font-bold text-neutral-900">
                {isLogin ? 'Welcome Back' : 'Join MindBridge'}
              </h1>
              <p className="text-neutral-600">
                {isLogin
                  ? 'Sign in to access your account'
                  : 'Start your wellness journey today'}
              </p>
            </div>

            {/* Tab Toggle */}
            <div className="inline-flex gap-2 bg-neutral-100 p-1.5 rounded-xl w-full">
              <button
                onClick={() => setIsLogin(true)}
                className={`flex-1 py-2.5 px-4 rounded-lg font-semibold transition-all duration-base ${
                  isLogin
                    ? 'bg-white text-primary-main shadow-md'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => setIsLogin(false)}
                className={`flex-1 py-2.5 px-4 rounded-lg font-semibold transition-all duration-base ${
                  !isLogin
                    ? 'bg-white text-primary-main shadow-md'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                Sign Up
              </button>
            </div>

            {/* Role Selection (Signup only) */}
            {!isLogin && (
              <div className="space-y-3 p-5 bg-primary-main/5 rounded-2xl border border-primary-main/10">
                <label className="block text-sm font-semibold text-neutral-900">
                  Who are you?
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setRole('patient')}
                    className={`py-3 px-4 rounded-xl font-semibold transition-all duration-base border-2 flex items-center justify-center gap-2 ${
                      role === 'patient'
                        ? 'border-primary-main bg-primary-main/10 text-primary-main'
                        : 'border-neutral-200 text-neutral-700 hover:border-primary-main/30'
                    }`}
                  >
                    <User size={18} />
                    <span>Patient</span>
                  </button>
                  <button
                    onClick={() => setRole('doctor')}
                    className={`py-3 px-4 rounded-xl font-semibold transition-all duration-base border-2 flex items-center justify-center gap-2 ${
                      role === 'doctor'
                        ? 'border-primary-main bg-primary-main/10 text-primary-main'
                        : 'border-neutral-200 text-neutral-700 hover:border-primary-main/30'
                    }`}
                  >
                    <Heart size={18} />
                    <span>Therapist</span>
                  </button>
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded-lg">
                <p className="text-red-700 font-medium text-sm">{error}</p>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Full Name (Signup only) */}
              {!isLogin && (
                <>
                  <div className="form-group">
                    <label className="form-label">Full Name</label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      placeholder="John Doe"
                      className={`form-input ${validationErrors.fullName ? 'border-red-500' : ''}`}
                    />
                    {validationErrors.fullName && (
                      <p className="text-red-500 text-sm mt-1">{validationErrors.fullName}</p>
                    )}
                  </div>

                </>
              )}

              {/* Email */}
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-4 text-neutral-400" size={20} />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    className={`form-input pl-12 ${validationErrors.email ? 'border-red-500' : ''}`}
                  />
                </div>
                {validationErrors.email && (
                  <p className="text-red-500 text-sm mt-1">{validationErrors.email}</p>
                )}
              </div>

              {/* Phone (Signup only) */}
              {!isLogin && (
                <div className="form-group">
                  <label className="form-label">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+1 (555) 000-0000"
                    className={`form-input ${validationErrors.phone ? 'border-red-500' : ''}`}
                  />
                  {validationErrors.phone && (
                    <p className="text-red-500 text-sm mt-1">{validationErrors.phone}</p>
                  )}
                </div>
              )}

              {/* Password */}
              <div className="form-group">
                <label className="form-label">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-4 text-neutral-400" size={20} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    minLength={6}
                    placeholder="••••••••"
                    className={`form-input pl-12 pr-12 ${validationErrors.password ? 'border-red-500' : ''}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-4 text-neutral-400 hover:text-neutral-600"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {validationErrors.password && (
                  <p className="text-red-500 text-sm mt-1">{validationErrors.password}</p>
                )}
              </div>

              {/* Confirm Password (Signup only) */}
              {!isLogin && (
                <div className="form-group">
                  <label className="form-label">Confirm Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-4 text-neutral-400" size={20} />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      minLength={6}
                      placeholder="••••••••"
                      className={`form-input pl-12 pr-12 ${validationErrors.confirmPassword ? 'border-red-500' : ''}`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-4 text-neutral-400 hover:text-neutral-600"
                    >
                      {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  {validationErrors.confirmPassword && (
                    <p className="text-red-500 text-sm mt-1">{validationErrors.confirmPassword}</p>
                  )}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full py-3 text-base font-semibold disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="spinner border-2 border-white border-t-transparent w-5 h-5" />
                ) : isLogin ? (
                  'Sign In'
                ) : (
                  'Create Account'
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-neutral-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-3 bg-white text-neutral-600">or</span>
              </div>
            </div>

            {/* Toggle */}
            <p className="text-center text-neutral-600">
              {isLogin ? "Don't have an account? " : 'Already have an account? '}
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-primary-main font-semibold hover:underline transition-all duration-base"
              >
                {isLogin ? 'Sign up' : 'Sign in'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}

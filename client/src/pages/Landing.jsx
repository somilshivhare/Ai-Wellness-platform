import { Link } from 'react-router-dom';
import { Heart, Zap, Shield, Users, ArrowRight, CheckCircle, TrendingUp } from 'lucide-react';
import Layout from '../components/Layout';

export default function Landing() {
  const features = [
    {
      icon: Heart,
      title: 'Mental Health Support',
      description: 'Access licensed therapists and counselors whenever you need support.',
    },
    {
      icon: Zap,
      title: 'Instant Assessments',
      description: 'Get personalized wellness assessments powered by AI.',
    },
    {
      icon: Shield,
      title: '100% Private & Secure',
      description: 'Your conversations are encrypted and completely confidential.',
    },
    {
      icon: Users,
      title: 'Expert Network',
      description: 'Connect with verified mental health professionals.',
    },
  ];

  const benefits = [
    'Licensed therapists and counselors',
    'Video, phone, and chat consultations',
    'Personalized wellness plans',
    'AI-powered mental health assessments',
    'Flexible scheduling',
    '24/7 availability',
  ];

  const testimonials = [
    {
      name: 'Sarah Chen',
      role: 'Patient',
      content: 'MindBridge completely changed how I manage my anxiety. The therapists are amazing and the platform is so easy to use.',
      avatar: '👩‍⚕️',
    },
    {
      name: 'Dr. Michael Johnson',
      role: 'Therapist',
      content: 'As a mental health professional, I appreciate the secure platform and the ability to help patients more flexibly.',
      avatar: '👨‍⚕️',
    },
    {
      name: 'Emma Williams',
      role: 'Patient',
      content: 'Finally found a way to get the support I need without the stigma. The booking process is seamless!',
      avatar: '👩‍💼',
    },
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="section-hero bg-gradient-to-br from-white via-primary-main/5 to-white">
        <div className="container-max">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Left Content */}
            <div className="space-y-8 animate-slideUp">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-main/10 text-primary-main rounded-full border border-primary-main/20">
                  <Zap size={18} />
                  <span className="text-sm font-semibold">Your Mental Wellness Starts Here</span>
                </div>
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-bold text-neutral-900 leading-tight">
                  Care for Your <span className="gradient-text">Mental Health</span>
                </h1>
                <p className="text-xl text-neutral-600 leading-relaxed max-w-lg">
                  Connect with licensed therapists, get personalized wellness assessments, and take control of your mental health journey with MindBridge AI.
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link to="/login" className="btn-primary py-4 px-8 text-lg font-semibold flex items-center justify-center gap-2 group">
                  Get Started
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <button className="btn-outline py-4 px-8 text-lg font-semibold">
                  Learn More
                </button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 pt-12">
                <div>
                  <p className="text-3xl font-display font-bold text-primary-main">10K+</p>
                  <p className="text-neutral-600 text-sm font-medium mt-1">Active Users</p>
                </div>
                <div>
                  <p className="text-3xl font-display font-bold text-primary-main">500+</p>
                  <p className="text-neutral-600 text-sm font-medium mt-1">Therapists</p>
                </div>
                <div>
                  <p className="text-3xl font-display font-bold text-primary-main">24/7</p>
                  <p className="text-neutral-600 text-sm font-medium mt-1">Available</p>
                </div>
              </div>
            </div>

            {/* Right Visual */}
            <div className="hidden lg:flex items-center justify-center">
              <div className="relative w-full aspect-square max-w-md">
                {/* Animated Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary-main/20 to-primary-light/20 rounded-3xl blur-3xl animate-pulse"></div>
                <div className="absolute inset-0 bg-gradient-to-tr from-primary-light/20 to-transparent rounded-3xl blur-2xl"></div>

                {/* Card */}
                <div className="relative bg-white rounded-3xl p-8 shadow-2xl border border-neutral-100 h-full flex flex-col justify-center">
                  <div className="space-y-6">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-primary-main/10 flex items-center justify-center">
                        <Heart size={24} className="text-primary-main" />
                      </div>
                      <div>
                        <p className="font-semibold text-neutral-900">Your Wellness</p>
                        <p className="text-xs text-neutral-500">Personalized care</p>
                      </div>
                    </div>
                    <div className="space-y-3 py-4 border-t border-b border-neutral-100">
                      <div className="flex items-center gap-2">
                        <CheckCircle size={18} className="text-green-500" />
                        <span className="text-sm text-neutral-600">Complete assessment</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle size={18} className="text-green-500" />
                        <span className="text-sm text-neutral-600">Book therapist</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle size={18} className="text-green-500" />
                        <span className="text-sm text-neutral-600">Start sessions</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-2">
                      <span className="text-xs text-neutral-500">Secure & Private</span>
                      <Shield size={18} className="text-primary-main" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section bg-white">
        <div className="container-max">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl md:text-5xl font-display font-bold text-neutral-900">
              Why Choose MindBridge?
            </h2>
            <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
              Comprehensive mental health support designed for your wellness journey
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <div key={idx} className="card hover-lift">
                  <div className="w-14 h-14 rounded-2xl bg-primary-main/10 flex items-center justify-center mb-6">
                    <Icon size={28} className="text-primary-main" />
                  </div>
                  <h3 className="text-xl font-semibold text-neutral-900 mb-3">{feature.title}</h3>
                  <p className="text-neutral-600 leading-relaxed">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="section bg-gradient-to-br from-neutral-50 to-neutral-100">
        <div className="container-max">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Image */}
            <div className="hidden lg:flex items-center justify-center">
              <div className="relative w-full max-w-md">
                <div className="bg-gradient-to-br from-primary-main/20 to-primary-light/20 rounded-3xl p-12 aspect-square flex items-center justify-center">
                  <TrendingUp size={120} className="text-primary-main/30" />
                </div>
              </div>
            </div>

            {/* Right Content */}
            <div className="space-y-8">
              <div className="space-y-4">
                <h2 className="text-4xl md:text-5xl font-display font-bold text-neutral-900">
                  Complete Mental Health Care
                </h2>
                <p className="text-lg text-neutral-600 leading-relaxed">
                  Everything you need for your wellness journey in one comprehensive platform.
                </p>
              </div>

              <div className="space-y-4">
                {benefits.map((benefit, idx) => (
                  <div key={idx} className="flex items-center gap-4 p-4 bg-white rounded-xl border border-neutral-200 hover:border-primary-main/50 transition-all duration-base">
                    <CheckCircle size={24} className="text-primary-main flex-shrink-0" />
                    <span className="font-medium text-neutral-900">{benefit}</span>
                  </div>
                ))}
              </div>

              <Link to="/login" className="btn-primary py-4 px-8 text-lg font-semibold w-fit mt-4">
                Start Your Journey
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="section bg-white">
        <div className="container-max">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl md:text-5xl font-display font-bold text-neutral-900">
              Loved by Our Community
            </h2>
            <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
              Real stories from real people who transformed their mental health
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, idx) => (
              <div key={idx} className="card">
                <div className="flex items-center gap-4 mb-6">
                  <div className="text-4xl">{testimonial.avatar}</div>
                  <div>
                    <p className="font-semibold text-neutral-900">{testimonial.name}</p>
                    <p className="text-sm text-neutral-500">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-neutral-600 leading-relaxed italic">"{testimonial.content}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section bg-gradient-to-r from-primary-main to-primary-light">
        <div className="container-max">
          <div className="text-center space-y-8 py-12">
            <div className="space-y-4">
              <h2 className="text-4xl md:text-5xl font-display font-bold text-white">
                Ready to Transform Your Mental Health?
              </h2>
              <p className="text-xl text-white/90 max-w-2xl mx-auto">
                Join thousands of people taking control of their wellness today.
              </p>
            </div>

            <Link to="/login" className="inline-flex btn-primary bg-white text-primary-main hover:bg-neutral-50 py-4 px-8 text-lg font-semibold gap-2 group">
              Get Started Now
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}

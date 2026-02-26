import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { doctorAPI, authAPI } from '../services/api';

export default function DoctorProfile() {
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    profileImage: '',
    specialization: 'Clinical Psychologist',
    license: '',
    experience: 0,
    bio: '',
    qualifications: [],
    hourlyRate: 0,
    languages: [],
  });
  const [preview, setPreview] = useState('');
  const [loading, setLoading] = useState(false);
  // start in summary mode; only show form when user clicks edit
  const [editing, setEditing] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await doctorAPI.updateProfile(formData);
      alert('Profile updated successfully');
      setEditing(false);
    } catch (error) {
      console.error('Update failed:', error);
    } finally {
      setLoading(false);
    }
  };

  // load existing profile once component mounts
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const res = await authAPI.getMe();
        const { user, profile } = res.data;
        setFormData((prev) => ({
          ...prev,
          fullName: user.fullName || '',
          phone: user.phone || '',
          profileImage: user.profileImage || '',
          specialization: profile?.specialization || prev.specialization,
          license: profile?.license || '',
          experience: profile?.experience || 0,
          bio: profile?.bio || '',
          qualifications: profile?.qualifications || [],
          hourlyRate: profile?.hourlyRate || 0,
          languages: profile?.languages || [],
        }));
        setPreview(user.profileImage || '');
      } catch (err) {
        console.error('Failed to load profile', err);
      }
    };

    loadProfile();
  }, []);

  return (
    <Layout>
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            {editing ? 'Update Your Profile' : 'Your Profile'}
          </h1>

          {editing ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <button
                type="button"
                onClick={() => {
                  setFormData({
                    ...formData,
                    fullName: 'Dr. Jane Doe',
                    phone: '123-456-7890',
                    specialization: 'Psychiatrist',
                    license: 'ABC123456',
                    experience: 5,
                    hourlyRate: 150,
                    bio: 'Experienced psychiatrist specializing in mood disorders and anxiety.',
                    qualifications: ['MD Psychiatry', 'PhD Clinical Psychology'],
                    languages: ['English', 'Spanish'],
                  });
                }}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
              >
                Load Sample Data
              </button>
              {/* profile image upload */}
              <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Profile Picture
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      setFormData({...formData, profileImage: reader.result});
                      setPreview(reader.result);
                    };
                    reader.readAsDataURL(file);
                  }
                }}
                className="w-full"
              />
              {preview && (
                <img
                  src={preview}
                  alt="preview"
                  className="w-24 h-24 rounded-full mt-2 object-cover"
                />
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Specialization
              </label>
              <select
                value={formData.specialization}
                onChange={(e) => setFormData({...formData, specialization: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              >
                <option>Clinical Psychologist</option>
                <option>Psychiatrist</option>
                <option>Therapist</option>
                <option>Counselor</option>
                <option>Life Coach</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hourly Rate ($)
              </label>
              <input
                type="number"
                value={formData.hourlyRate}
                onChange={(e) => setFormData({...formData, hourlyRate: parseInt(e.target.value)})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bio
              </label>
              <textarea
                value={formData.bio}
                onChange={(e) => setFormData({...formData, bio: e.target.value})}
                rows="4"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              ></textarea>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Qualifications (comma-separated)
              </label>
              <input
                type="text"
                value={formData.qualifications.join(', ')}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    qualifications: e.target.value
                      .split(',')
                      .map((s) => s.trim())
                      .filter(Boolean),
                  })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Languages (comma-separated)
              </label>
              <input
                type="text"
                value={formData.languages.join(', ')}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    languages: e.target.value
                      .split(',')
                      .map((s) => s.trim())
                      .filter(Boolean),
                  })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 disabled:opacity-50"
            >
              {loading ? 'Updating...' : 'Update Profile'}
            </button>
            </form>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                {preview && (
                  <img
                    src={preview}
                    alt="profile"
                    className="w-24 h-24 rounded-full object-cover"
                  />
                )}
                <div>
                  <h2 className="text-xl font-semibold">{formData.fullName}</h2>
                  <p className="text-sm text-gray-600">{formData.specialization}</p>
                </div>
              </div>
              <p><strong>Phone:</strong> {formData.phone}</p>
              <p><strong>Experience:</strong> {formData.experience} {formData.experience === 1 ? 'year' : 'years'}</p>
              <p><strong>Hourly rate:</strong> ${formData.hourlyRate}</p>
              {formData.qualifications && formData.qualifications.length > 0 && (
                <p><strong>Qualifications:</strong> {formData.qualifications.join(', ')}</p>
              )}
              {formData.languages && formData.languages.length > 0 && (
                <p><strong>Languages:</strong> {formData.languages.join(', ')}</p>
              )}
              <p><strong>Bio:</strong> {formData.bio}</p>
              <button
                onClick={() => setEditing(true)}
                className="btn-primary py-2 px-4"
              >
                Edit Profile
              </button>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

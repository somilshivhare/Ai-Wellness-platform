import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Layout from '../components/Layout';
import { appointmentAPI } from '../services/api';

export default function Booking() {
  const { doctorId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    appointmentDate: '',
    consultationType: 'video',
    notes: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await appointmentAPI.create({
        doctorId,
        ...formData,
      });
      // after booking go straight to appointments list where user can see the new entry
      navigate('/appointments');
    } catch (error) {
      console.error('Booking failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Book Appointment</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Appointment Date & Time
              </label>
              <div className="flex gap-2 mb-2">
                <button
                  type="button"
                  className="text-xs text-indigo-600 hover:underline"
                  onClick={() => {
                    const now = new Date();
                    const formatted = `${now.getFullYear()}-${(now.getMonth()+1)
                      .toString()
                      .padStart(2,'0')}-${now.getDate().toString().padStart(2,'0')}T${now
                      .getHours()
                      .toString()
                      .padStart(2,'0')}:${now
                      .getMinutes()
                      .toString()
                      .padStart(2,'0')}`;
                    setFormData({ ...formData, appointmentDate: formatted });
                  }}
                >
                  Today
                </button>
                <button
                  type="button"
                  className="text-xs text-indigo-600 hover:underline"
                  onClick={() => {
                    const tomorrow = new Date();
                    tomorrow.setDate(tomorrow.getDate() + 1);
                    const formatted = `${tomorrow.getFullYear()}-${(tomorrow.getMonth()+1)
                      .toString()
                      .padStart(2,'0')}-${tomorrow.getDate().toString().padStart(2,'0')}T${tomorrow
                      .getHours()
                      .toString()
                      .padStart(2,'0')}:${tomorrow
                      .getMinutes()
                      .toString()
                      .padStart(2,'0')}`;
                    setFormData({ ...formData, appointmentDate: formatted });
                  }}
                >
                  Tomorrow
                </button>
              </div>
              <input
                type="datetime-local"
                required
                min={
                  `${new Date().getFullYear()}-${(new Date().getMonth()+1)
                    .toString()
                    .padStart(2,'0')}-${new Date()
                    .getDate()
                    .toString()
                    .padStart(2,'0')}T${new Date()
                    .getHours()
                    .toString()
                    .padStart(2,'0')}:${new Date()
                    .getMinutes()
                    .toString()
                    .padStart(2,'0')}`
                }
                value={formData.appointmentDate}
                onChange={(e) => setFormData({...formData, appointmentDate: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Consultation Type
              </label>
              <select
                value={formData.consultationType}
                onChange={(e) => setFormData({...formData, consultationType: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              >
                <option value="video">Video Call</option>
                <option value="chat">Text Chat</option>
                <option value="phone">Phone Call</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Additional Notes
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({...formData, notes: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                rows="4"
                placeholder="Tell the therapist what you'd like to discuss..."
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50"
            >
              {loading ? 'Booking...' : 'Confirm Booking'}
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
}

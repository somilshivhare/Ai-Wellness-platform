import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { assessmentAPI } from '../services/api';

export default function Assessment() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    stressLevel: 5,
    sleepQuality: 5,
    sleepHours: 7,
    anxietyLevel: 5,
    mood: 'neutral',
    mainConcerns: [],
    exerciseFrequency: 'sometimes',
    dietQuality: 'good',
    socialConnections: 'moderate',
    workLifeBalance: 5,
    suicidalThoughts: false,
    harmfulBehavior: false,
    substanceUse: false,
  });
  const navigate = useNavigate();

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await assessmentAPI.create(formData);
      navigate('/doctors');
    } catch (error) {
      console.error('Assessment failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Wellness Assessment</h1>
          <p className="text-gray-600 mb-8">Step {step} of 3</p>

          <div className="space-y-6">
            {step === 1 && (
              <>
                <h2 className="text-xl font-semibold text-gray-900">How are you feeling?</h2>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Stress Level (1-10)
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={formData.stressLevel}
                    onChange={(e) => handleChange('stressLevel', parseInt(e.target.value))}
                    className="w-full"
                  />
                  <p className="text-right text-gray-600">{formData.stressLevel}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sleep Quality (1-10)
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={formData.sleepQuality}
                    onChange={(e) => handleChange('sleepQuality', parseInt(e.target.value))}
                    className="w-full"
                  />
                  <p className="text-right text-gray-600">{formData.sleepQuality}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Anxiety Level (1-10)
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={formData.anxietyLevel}
                    onChange={(e) => handleChange('anxietyLevel', parseInt(e.target.value))}
                    className="w-full"
                  />
                  <p className="text-right text-gray-600">{formData.anxietyLevel}</p>
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <h2 className="text-xl font-semibold text-gray-900">Your lifestyle</h2>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    How is your mood?
                  </label>
                  <select
                    value={formData.mood}
                    onChange={(e) => handleChange('mood', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="very_sad">Very Sad</option>
                    <option value="sad">Sad</option>
                    <option value="neutral">Neutral</option>
                    <option value="happy">Happy</option>
                    <option value="very_happy">Very Happy</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Exercise Frequency
                  </label>
                  <select
                    value={formData.exerciseFrequency}
                    onChange={(e) => handleChange('exerciseFrequency', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="never">Never</option>
                    <option value="rarely">Rarely</option>
                    <option value="sometimes">Sometimes</option>
                    <option value="regularly">Regularly</option>
                    <option value="daily">Daily</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Work-Life Balance (1-10)
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={formData.workLifeBalance}
                    onChange={(e) => handleChange('workLifeBalance', parseInt(e.target.value))}
                    className="w-full"
                  />
                  <p className="text-right text-gray-600">{formData.workLifeBalance}</p>
                </div>
              </>
            )}

            {step === 3 && (
              <>
                <h2 className="text-xl font-semibold text-gray-900">Important Information</h2>
                
                <div className="space-y-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.suicidalThoughts}
                      onChange={(e) => handleChange('suicidalThoughts', e.target.checked)}
                      className="mr-3"
                    />
                    <span className="text-gray-700">I have had thoughts of harming myself</span>
                  </label>

                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.harmfulBehavior}
                      onChange={(e) => handleChange('harmfulBehavior', e.target.checked)}
                      className="mr-3"
                    />
                    <span className="text-gray-700">I engage in harmful behavior</span>
                  </label>

                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.substanceUse}
                      onChange={(e) => handleChange('substanceUse', e.target.checked)}
                      className="mr-3"
                    />
                    <span className="text-gray-700">I struggle with substance use</span>
                  </label>
                </div>
              </>
            )}
          </div>

          <div className="flex gap-4 mt-8">
            <button
              onClick={() => setStep(Math.max(1, step - 1))}
              disabled={step === 1}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              Back
            </button>
            {step < 3 ? (
              <button
                onClick={() => setStep(step + 1)}
                className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700"
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 disabled:opacity-50"
              >
                {loading ? 'Submitting...' : 'Complete Assessment'}
              </button>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}

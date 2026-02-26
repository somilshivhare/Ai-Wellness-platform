import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { assessmentAPI } from '../services/api';

export default function Assessment() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    // default name for demonstration; user may override
    patientName: 'Shimla',
    age: '',
    gender: 'female',
    // leave desiredSpecialization blank, recommendation will be computed later
    desiredSpecialization: '',

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
      // backend will recommend specialization based on answers
      const spec = response.data.recommendedSpecialization;
      navigate(`/doctors?specialization=${encodeURIComponent(spec)}`);
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
          <p className="text-gray-600 mb-8">Step {step} of 4</p>

          <div className="space-y-6">
            {step === 1 && (
              <>
                <h2 className="text-xl font-semibold text-gray-900">About You</h2>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={formData.patientName}
                    onChange={(e) => handleChange('patientName', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Age
                    </label>
                    <input
                      type="number"
                      value={formData.age}
                      onChange={(e) => handleChange('age', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Gender
                    </label>
                    <select
                      value={formData.gender}
                      onChange={(e) => handleChange('gender', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    >
                      <option value="female">Female</option>
                      <option value="male">Male</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>


                <hr className="my-6" />

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
            {step === 4 && (
              <>
                <h2 className="text-xl font-semibold text-gray-900">Additional Details</h2>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sleep Hours per Night
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="24"
                    value={formData.sleepHours}
                    onChange={(e) => handleChange('sleepHours', parseInt(e.target.value))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Diet Quality
                  </label>
                  <select
                    value={formData.dietQuality}
                    onChange={(e) => handleChange('dietQuality', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="poor">Poor</option>
                    <option value="fair">Fair</option>
                    <option value="good">Good</option>
                    <option value="excellent">Excellent</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Social Connections
                  </label>
                  <select
                    value={formData.socialConnections}
                    onChange={(e) => handleChange('socialConnections', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="none">None</option>
                    <option value="few">A few</option>
                    <option value="moderate">Moderate</option>
                    <option value="many">Many</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Main Concerns
                  </label>
                  <textarea
                    value={formData.mainConcerns.join(', ')}
                    onChange={(e) => handleChange('mainConcerns', e.target.value.split(',').map(s => s.trim()))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    placeholder="separate with commas"
                  />
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
            {step < 4 ? (
              <button
                onClick={() => {
                  // if first step and name empty, auto populate for demonstration
                  if (step === 1 && !formData.patientName.trim()) {
                    handleChange('patientName', 'Shimla');
                  }
                  setStep(step + 1);
                }}
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

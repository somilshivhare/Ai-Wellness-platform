import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Download } from 'lucide-react';
import Layout from '../components/Layout';
import { chatAPI } from '../services/api';

export default function ChatSummary() {
  const { chatSessionId } = useParams();
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const response = await chatAPI.getSummary(chatSessionId);
        setSummary(response.data.summary);
      } catch (error) {
        console.error('Failed to fetch summary:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, [chatSessionId]);

  const generateSummary = async () => {
    setGenerating(true);
    try {
      const response = await chatAPI.generateSummary(chatSessionId);
      setSummary(response.data.summary);
    } catch (error) {
      console.error('Failed to generate summary:', error);
    } finally {
      setGenerating(false);
    }
  };

  const downloadSummary = () => {
    const element = document.createElement('a');
    const file = new Blob([summary], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = 'chat-summary.txt';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  if (loading) {
    return <Layout><div className="text-center py-12">Loading summary...</div></Layout>;
  }

  return (
    <Layout>
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Chat Summary</h1>
          <p className="text-gray-600 mb-8">AI-generated summary of your conversation</p>

          {!summary ? (
            <div className="text-center py-12">
              <p className="text-gray-600 mb-6">No summary available yet.</p>
              <button
                onClick={generateSummary}
                disabled={generating}
                className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
              >
                {generating ? 'Generating...' : 'Generate Summary'}
              </button>
            </div>
          ) : (
            <>
              <div className="bg-gray-50 rounded-lg p-6 mb-6">
                <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{summary}</p>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={downloadSummary}
                  className="flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  <Download size={18} />
                  Download
                </button>
                <button
                  onClick={generateSummary}
                  disabled={generating}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                >
                  {generating ? 'Generating...' : 'Regenerate'}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </Layout>
  );
}

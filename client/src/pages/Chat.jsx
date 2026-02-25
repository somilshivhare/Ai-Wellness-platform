import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Send } from 'lucide-react';
import Layout from '../components/Layout';
import { chatAPI } from '../services/api';
import { useAuthStore } from '../store/authStore';
import io from 'socket.io-client';

export default function Chat() {
  const { appointmentId } = useParams();
  const { user, token } = useAuthStore();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
  const socketRef = useRef(null);
  const [chatSessionId, setChatSessionId] = useState(null);

  useEffect(() => {
    const fetchChat = async () => {
      try {
        const response = await chatAPI.getSession(appointmentId);
        setChatSessionId(response.data._id);
        setMessages(response.data.messages || []);

        // Connect to Socket.io
        socketRef.current = io('http://localhost:5000', {
          auth: {
            token,
          },
        });

        socketRef.current.emit('join_chat', {
          chatSessionId: response.data._id,
        });

        socketRef.current.on('receive_message', (data) => {
          setMessages((prev) => [...prev, data]);
        });
      } catch (error) {
        console.error('Failed to load chat:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchChat();

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [appointmentId, token]);

  const handleSend = () => {
    if (!input.trim() || !chatSessionId) return;

    socketRef.current?.emit('send_message', {
      chatSessionId,
      message: input,
    });

    setInput('');
  };

  if (loading) {
    return (
      <Layout>
        <div className="text-center py-12">Loading chat...</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-2xl mx-auto px-4 py-12 h-screen flex flex-col">
        <div className="flex-1 bg-white rounded-lg shadow-lg mb-4 p-6 overflow-y-auto">
          {messages.length === 0 ? (
            <div className="text-center text-gray-500 py-12">
              <p>No messages yet. Start the conversation!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${
                    msg.senderRole === user?.role ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-xs px-4 py-2 rounded-lg ${
                      msg.senderRole === user?.role
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-200 text-gray-900'
                    }`}
                  >
                    <p className="text-sm">{msg.message}</p>
                    <p className="text-xs mt-1 opacity-70">
                      {new Date(msg.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type your message..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
          />
          <button
            onClick={handleSend}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </Layout>
  );
}

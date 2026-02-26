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

  // use configured socket url or derive from API base
  const SOCKET_URL =
    import.meta.env.VITE_SOCKET_URL ||
    (import.meta.env.VITE_API_BASE_URL || '').replace('/api', '');

  useEffect(() => {
    let isActive = true;
    // create a dedicated socket for this effect; ensures cleanup even if
    // the async fetch resolves after unmount (React Strict Mode can run
    // the effect twice during development, which previously resulted in
    // two active sockets and duplicate messages).
    const socket = io(SOCKET_URL, {
      auth: { token },
    });
    socketRef.current = socket;

    const fetchChat = async () => {
      try {
        // appointmentId is passed in via the route, so use the
        // appointment-specific endpoint which will create a session if
        // one doesn’t already exist.  The previously-used `/chat/:id`
        // endpoint expected a chatSessionId, hence the 404 errors.
        const response = await chatAPI.getSessionByAppointment(appointmentId);
        if (!isActive) return; // component unmounted while request in-flight

        setChatSessionId(response.data._id);
        setMessages(response.data.messages || []);

        socket.emit('join_chat', {
          chatSessionId: response.data._id,
        });
      } catch (error) {
        if (isActive) console.error('Failed to load chat:', error);
      } finally {
        if (isActive) setLoading(false);
      }
    };

    // dedupe based on last message to avoid accidental double-receive
    socket.on('receive_message', (data) => {
      setMessages((prev) => {
        const last = prev[prev.length - 1];
        if (
          last &&
          last.message === data.message &&
          last.senderRole === data.senderRole &&
          new Date(last.timestamp).getTime() === new Date(data.timestamp).getTime()
        ) {
          return prev; // duplicate
        }
        return [...prev, data];
      });
    });

    fetchChat();

    return () => {
      isActive = false;
      socket.disconnect();
    };
  }, [appointmentId, token]);

  // simple throttle guard to avoid rapid double-clicks / enter presses
  const [sending, setSending] = useState(false);
  const handleSend = () => {
    if (!input.trim() || !chatSessionId || sending) return;
    setSending(true);

    socketRef.current?.emit('send_message', {
      chatSessionId,
      message: input,
    });

    setInput('');
    setTimeout(() => setSending(false), 300);
  };

  if (loading) {
    return (
      <Layout>
        <div className="text-center py-12">Loading chat...</div>
      </Layout>
    );
  }

  // clear chat messages by calling backend and wiping local array
  const handleClearChat = async () => {
    if (!chatSessionId) return;
    if (!window.confirm('Are you sure you want to clear the chat? This cannot be undone.')) return;
    try {
      await chatAPI.clearChat(chatSessionId);
      setMessages([]);
    } catch (err) {
      console.error('Failed to clear chat', err);
      alert(err.response?.data?.message || 'Could not clear chat');
    }
  };


  return (
    <Layout>
      <div className="max-w-2xl mx-auto px-4 py-12 h-screen flex flex-col">
        <div className="mb-2">
          <h2 className="text-xl font-semibold">Chat</h2>
        </div>
        <div className="flex-1 bg-white rounded-lg shadow-lg mb-4 p-6 overflow-y-auto">
          {messages.length === 0 ? (
            <div className="text-center text-gray-500 py-12">
              <p>No messages yet. Start the conversation!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((msg, i) => {
                // msg.senderId may be a populated user object or a string id
                const senderId =
                  msg.senderId && typeof msg.senderId === 'object'
                    ? msg.senderId._id
                    : msg.senderId;
                // current user might have _id or id depending on server response
                const currentUserId = user?._id || user?.id;

                const isMine = String(senderId) === String(currentUserId);

                // debug information, remove or comment out if not needed later
                if (process.env.NODE_ENV === 'development') {
                  console.log('chat msg', i, { senderId, currentUserId, isMine });
                }

                return (
                  <div
                    key={i}
                    className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs flex flex-col ${
                        isMine ? 'items-end' : 'items-start'
                      }`}
                    >
                      <div
                        className={`px-4 py-2 rounded-2xl shadow-sm w-fit break-words ${
                          isMine
                            ? 'bg-green-200 text-gray-900' // light green bubble for sender
                            : 'bg-gray-200 text-gray-900' // pale grey background for other user
                        }`}
                      >
                        <p className="text-sm">{msg.message}</p>
                      </div>
                      <p className={`text-xs mt-1 opacity-70 ${isMine ? 'text-right' : 'text-left'}`}>
                        {new Date(msg.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>


        <div className="flex gap-2 mb-2">
          <button
            onClick={handleClearChat}
            className="px-3 py-1 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600"
          >
            Clear Chat
          </button>
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleSend();
              }
            }}
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

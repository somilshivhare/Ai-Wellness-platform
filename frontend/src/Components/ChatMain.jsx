import React, { useEffect, useRef, useState } from 'react';

// simple message component
const ChatMessage = ({ from, avatar, text, time, isUser }) => (
  <div
    className={`flex items-start gap-4 max-w-3xl message-anim ${
      isUser ? 'ml-auto flex-row-reverse' : ''
    }`}
    style={{ animationDelay: '0.2s' }}
  >
    {!isUser && (
      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex-none flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
        <span className="material-icons-round text-xl">smart_toy</span>
      </div>
    )}
    {isUser && (
      <img
        alt="User Avatar"
        className="w-10 h-10 rounded-full object-cover border-2 border-white dark:border-slate-700 shadow-md"
        src={avatar}
      />
    )}
    <div className="flex flex-col gap-1">
      {!isUser && (
        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 ml-1">
          {from}
        </span>
      )}
      <div
        className={`${
          isUser
            ? 'bg-white dark:bg-surface-dark border border-slate-100 dark:border-slate-700 text-slate-800 dark:text-slate-100'
            : 'bg-chat-ai-light dark:bg-chat-ai-dark text-slate-700 dark:text-slate-200'
        } p-5 rounded-2xl ${isUser ? 'rounded-tr-none' : 'rounded-tl-none'} shadow-sm leading-relaxed text-[15px]`}
      >
        <p>{text}</p>
      </div>
      {time && (
        <span
          className={`text-xs ${isUser ? 'text-slate-400 ml-auto mr-1' : 'text-slate-400 ml-1'}`}
        >
          {time}
        </span>
      )}
    </div>
  </div>
);

const ChatMain = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      from: 'CureNast AI',
      text: "Hello Cynthia. I'm here to listen and provide a safe space for you. How have you been feeling since our last conversation about managing workplace anxiety?",
      isUser: false,
      time: '10:23 AM',
    },
    {
      id: 2,
      from: 'You',
      text: 'It\'s been a bit up and down, to be honest. I tried the breathing exercises you suggested before the team meeting yesterday.',
      isUser: true,
      avatar: 'https://i.pravatar.cc/100?img=5',
    },
    {
      id: 3,
      from: 'CureNast AI',
      text: "That's a great step forward, Cynthia. Acknowledging the effort is important. Did you notice any shift in your physical sensations or thought patterns when you practiced the breathing?",
      isUser: false,
      time: null,
    },
    {
      id: 4,
      from: 'You',
      text: "It helped a little with the shaking hands, but my mind was still racing quite a bit about what my boss would say.",
      isUser: true,
      avatar: 'https://i.pravatar.cc/100?img=5',
      time: '10:25 AM',
    },
  ]);

  const textareaRef = useRef(null);

  useEffect(() => {
    // auto resize textarea
    const ta = textareaRef.current;
    if (!ta) return;
    const handleInput = () => {
      ta.style.height = 'auto';
      ta.style.height = ta.scrollHeight + 'px';
    };
    ta.addEventListener('input', handleInput);
    return () => ta.removeEventListener('input', handleInput);
  }, []);

  return (
    <main className="flex-1 flex flex-col bg-background-light dark:bg-background-dark relative">
      <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 md:space-y-8" id="chat-container">
        <div className="text-center">
          <span className="text-xs font-medium text-slate-400 dark:text-slate-600 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full">
            Today, 10:23 AM
          </span>
        </div>
        {messages.map((msg, idx) => (
          <ChatMessage key={msg.id} {...msg} />
        ))}
        <div className="h-4"></div>
      </div>
      <div className="p-4 md:p-6 bg-white dark:bg-surface-dark border-t border-slate-100 dark:border-slate-800 z-10">
        <div className="max-w-4xl mx-auto">
          <div className="flex gap-2 mb-3 overflow-x-auto pb-2 scrollbar-hide">
            <button className="flex-none flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 dark:bg-slate-800 text-primary dark:text-blue-400 text-xs font-medium rounded-lg hover:bg-blue-100 dark:hover:bg-slate-700 transition-colors">
              <span className="material-icons-round text-sm">lightbulb</span>
              Suggest topic
            </button>
            <button className="flex-none flex items-center gap-1.5 px-3 py-1.5 bg-purple-50 dark:bg-slate-800 text-purple-600 dark:text-purple-400 text-xs font-medium rounded-lg hover:bg-purple-100 dark:hover:bg-slate-700 transition-colors">
              <span className="material-icons-round text-sm">self_improvement</span>
              Start guided exercise
            </button>
          </div>
          <div className="relative bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all shadow-inner">
            <textarea
              ref={textareaRef}
              className="w-full bg-transparent border-none text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 p-4 pr-12 resize-none focus:ring-0 text-[15px] max-h-32"
              placeholder="Talk to me... how are you feeling right now?"
              rows="1"
            ></textarea>
            <div className="absolute bottom-2 right-2 flex items-center gap-1">
              <button className="p-2 text-slate-400 hover:text-primary dark:hover:text-primary transition-colors rounded-full hover:bg-slate-200 dark:hover:bg-slate-800" title="Voice Input">
                <span className="material-icons-round">mic</span>
              </button>
              <button className="p-2 bg-primary hover:bg-primary-dark text-white rounded-xl shadow-lg shadow-blue-500/30 transition-all transform active:scale-95 flex items-center justify-center">
                <span className="material-icons-round text-xl">send</span>
              </button>
            </div>
          </div>
          <p className="text-center text-[10px] text-slate-400 dark:text-slate-600 mt-2">
            Your conversations are private and end-to-end encrypted. AI can make mistakes.
          </p>
        </div>
      </div>
    </main>
  );
};

export default ChatMain;

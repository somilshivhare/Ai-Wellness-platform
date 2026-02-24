import React from 'react';

const ChatSidebar = () => (
  <aside className="w-80 bg-surface-light dark:bg-surface-dark border-r border-slate-200 dark:border-slate-700 flex flex-col flex-none hidden md:flex transition-colors duration-300">
    <div className="p-4 border-b border-slate-100 dark:border-slate-800">
      <button className="w-full bg-primary hover:bg-primary-dark text-white rounded-xl py-3 px-4 flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 transition-all transform active:scale-95">
        <span className="material-icons-round">add</span>
        <span className="font-medium">New Chat</span>
      </button>
    </div>
    <div className="flex-1 overflow-y-auto p-3 space-y-6">
      <div>
        <h3 className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider px-3 mb-2">Today</h3>
        <div className="space-y-1">
          <button className="w-full text-left p-3 rounded-lg bg-blue-50 dark:bg-slate-800/50 border border-blue-100 dark:border-slate-700/50 group hover:border-primary/30 transition-all">
            <div className="flex items-center gap-3">
              <span className="material-icons-round text-primary text-sm">chat_bubble_outline</span>
              <span className="text-sm font-medium text-slate-700 dark:text-slate-200 truncate">Managing daily anxiety</span>
            </div>
          </button>
        </div>
      </div>
      <div>
        <h3 className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider px-3 mb-2">Yesterday</h3>
        <div className="space-y-1">
          <button className="w-full text-left p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group">
            <div className="flex items-center gap-3">
              <span className="material-icons-round text-slate-400 group-hover:text-primary transition-colors text-sm">history</span>
              <span className="text-sm text-slate-600 dark:text-slate-400 truncate">Sleep pattern analysis</span>
            </div>
          </button>
          <button className="w-full text-left p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group">
            <div className="flex items-center gap-3">
              <span className="material-icons-round text-slate-400 group-hover:text-primary transition-colors text-sm">history</span>
              <span className="text-sm text-slate-600 dark:text-slate-400 truncate">Work stress triggers</span>
            </div>
          </button>
        </div>
      </div>
      <div>
        <h3 className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider px-3 mb-2">Previous 7 Days</h3>
        <div className="space-y-1">
          <button className="w-full text-left p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group">
            <div className="flex items-center gap-3">
              <span className="material-icons-round text-slate-400 group-hover:text-primary transition-colors text-sm">history</span>
              <span className="text-sm text-slate-600 dark:text-slate-400 truncate">Mindfulness techniques</span>
            </div>
          </button>
          <button className="w-full text-left p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group">
            <div className="flex items-center gap-3">
              <span className="material-icons-round text-slate-400 group-hover:text-primary transition-colors text-sm">history</span>
              <span className="text-sm text-slate-600 dark:text-slate-400 truncate">Building confidence</span>
            </div>
          </button>
        </div>
      </div>
    </div>
    <div className="p-4 border-t border-slate-100 dark:border-slate-800">
      <a className="flex items-center gap-3 px-3 py-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 transition-colors" href="#">
        <span className="material-icons-round">settings</span>
        <span className="text-sm font-medium">Settings</span>
      </a>
    </div>
  </aside>
);

export default ChatSidebar;

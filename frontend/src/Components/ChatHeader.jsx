import React from 'react';

const ChatHeader = ({ user, onToggleDark }) => (
  <header className="bg-surface-light dark:bg-surface-dark border-b border-slate-200 dark:border-slate-700 h-16 flex-none z-20 shadow-soft">
    <div className="h-full px-6 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white">
            <span className="material-icons-round text-lg">medical_services</span>
          </div>
          <span className="font-bold text-xl tracking-tight text-slate-900 dark:text-white">CureNast</span>
        </div>
      </div>
      <div className="flex items-center gap-2 px-4 py-1.5 bg-green-50 dark:bg-green-900/20 rounded-full border border-green-100 dark:border-green-800/30">
        <span className="material-icons-round text-green-500 text-sm">lock</span>
        <span className="text-xs font-medium text-green-700 dark:text-green-400">
          End-to-End Encrypted Session
        </span>
      </div>
      <div className="flex items-center gap-4">
        <button
          onClick={onToggleDark}
          className="p-2 text-slate-400 hover:text-primary dark:text-slate-500 dark:hover:text-primary transition-colors rounded-full hover:bg-slate-50 dark:hover:bg-slate-800"
        >
          <span className="material-icons-round">dark_mode</span>
        </button>
        <div className="flex items-center gap-3 pl-4 border-l border-slate-200 dark:border-slate-700">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold leading-tight">{user.name}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">{user.status}</p>
          </div>
          <img
            alt="User Avatar"
            className="w-10 h-10 rounded-full object-cover border-2 border-slate-100 dark:border-slate-700"
            src={user.avatar}
          />
        </div>
      </div>
    </div>
  </header>
);

export default ChatHeader;

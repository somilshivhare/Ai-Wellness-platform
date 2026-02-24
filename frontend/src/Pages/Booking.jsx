import React, { useState } from 'react';
import ChatHeader from '../Components/ChatHeader';
import ChatSidebar from '../Components/ChatSidebar';
import ChatMain from '../Components/ChatMain';

const Booking = () => {
  const [darkMode, setDarkMode] = useState(
    document.documentElement.classList.contains('dark')
  );

  const toggleDark = () => {
    document.documentElement.classList.toggle('dark');
    setDarkMode(!darkMode);
  };

  const user = {
    name: 'Cynthia',
    status: 'Premium Member',
    avatar: 'https://i.pravatar.cc/100?img=4',
  };

  return (
    <div className={darkMode ? 'dark' : ''}>
      <ChatHeader user={user} onToggleDark={toggleDark} />
      <div className="flex flex-1 overflow-hidden relative">
        <ChatSidebar />
        <ChatMain />
      </div>
    </div>
  );
};

export default Booking;

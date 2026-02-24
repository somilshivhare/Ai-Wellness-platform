import React, { useState, useEffect } from 'react';
import Navbar from '../Components/NavBar';
import Hero from '../Components/Hero';
import Stats from '../Components/Stats';
import Process from '../Components/Process';
import Bridging from '../Components/Bridging';
import Specialists from '../Components/Specialists';
import CTA from '../Components/CTA';
import Footer from '../Components/Footer';

const Landing = () => {
  const [dark, setDark] = useState(() =>
    document.documentElement.classList.contains('dark')
  );

  const toggleDark = () => {
    document.documentElement.classList.toggle('dark');
    setDark((d) => !d);
  };

  useEffect(() => {
    if (dark) {
      localStorage.setItem('dark-mode', 'true');
    } else {
      localStorage.removeItem('dark-mode');
    }
  }, [dark]);

  return (
    <>
      <Navbar toggleDark={toggleDark} />
      <Hero />
      <Stats />
      <Process />
      <Bridging />
      <Specialists />
      <CTA />
      <Footer />
    </>
  );
};

export default Landing;

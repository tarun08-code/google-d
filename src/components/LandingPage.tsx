import React from 'react';
import Navbar from './Navbar';
import Hero from './Hero';
import Features from './Features';
import Testimonial from './Testimonial';
import Footer from './Footer';

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white font-sans">
      {/* Background Pattern */}
      <div className="fixed inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, rgba(229, 29, 72, 0.1) 0%, transparent 50%),
                           radial-gradient(circle at 75% 75%, rgba(229, 29, 72, 0.1) 0%, transparent 50%)`
        }} />
      </div>

      {/* Main Content */}
      <div className="relative z-10">
        <Navbar />
        <Hero />
        <Features />
        <Testimonial />
        <Footer />
      </div>
    </div>
  );
};

export default LandingPage;
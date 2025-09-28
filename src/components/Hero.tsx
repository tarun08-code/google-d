import React from 'react';
import { ArrowRight, Play } from 'lucide-react';

const Hero: React.FC = () => {
  return (
    <section id="home" className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900/50 via-black to-gray-900/50" />
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-rose-500/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-rose-500/5 rounded-full blur-3xl animate-pulse delay-1000" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Main Heading */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold mb-8 leading-tight">
          <span className="bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
            Smart Networking
          </span>
          <br />
          <span className="bg-gradient-to-r from-rose-500 to-rose-400 bg-clip-text text-transparent">
            for Events
          </span>
        </h1>

        {/* Subheading */}
        <p className="text-xl sm:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
          Discover and connect with like-minded professionals effortlessly.
          <br className="hidden sm:block" />
          Transform your networking experience with AI-powered insights.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
          <button className="group flex items-center justify-center px-8 py-4 bg-rose-500 text-white rounded-xl font-semibold text-lg hover:bg-rose-600 hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-rose-500/30 min-w-[200px]">
            <Play className="mr-2 group-hover:scale-110 transition-transform" size={20} />
            Get Started
          </button>
          
          <button className="group flex items-center justify-center px-8 py-4 border-2 border-gray-600 text-white rounded-xl font-semibold text-lg hover:border-rose-500 hover:text-rose-400 hover:scale-105 transition-all duration-300 min-w-[200px]">
            Learn More
            <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
          </button>
        </div>

        {/* Stats */}
        <div className="mt-16 pt-8 border-t border-gray-800">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">10K+</div>
              <div className="text-gray-400">Active Users</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">500+</div>
              <div className="text-gray-400">Events Hosted</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">95%</div>
              <div className="text-gray-400">Success Rate</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
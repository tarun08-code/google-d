import React from 'react';
import { Quote } from 'lucide-react';

const Testimonial: React.FC = () => {
  return (
    <section id="networking" className="py-24 relative">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-r from-black via-gray-900 to-black" />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl animate-pulse" />
      
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Quote Icon */}
        <div className="inline-flex items-center justify-center w-20 h-20 bg-rose-500/20 backdrop-blur-md rounded-full mb-8">
          <Quote className="w-10 h-10 text-rose-400" />
        </div>

        {/* Main Quote */}
        <blockquote className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-8 leading-tight">
          "Networking has never been
          <span className="bg-gradient-to-r from-rose-500 to-rose-400 bg-clip-text text-transparent">
            {" "}this easy
          </span>
          "
        </blockquote>

        {/* Accent Border */}
        <div className="w-24 h-1 bg-gradient-to-r from-rose-500 to-rose-400 mx-auto mb-8 rounded-full" />

        {/* Supporting Text */}
        <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
          Join thousands of professionals who have transformed their networking experience 
          with Event Hub's intelligent matching and seamless connection features.
        </p>

        {/* Stats */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="text-2xl font-bold text-rose-400 mb-2">2.5x</div>
            <div className="text-gray-400 text-sm">More Connections</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-rose-400 mb-2">85%</div>
            <div className="text-gray-400 text-sm">Time Saved</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-rose-400 mb-2">98%</div>
            <div className="text-gray-400 text-sm">User Satisfaction</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-rose-400 mb-2">24/7</div>
            <div className="text-gray-400 text-sm">AI Support</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonial;
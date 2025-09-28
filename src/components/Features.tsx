import React from 'react';
import { Bot, Users, Calendar } from 'lucide-react';

const Features: React.FC = () => {
  const features = [
    {
      icon: Bot,
      title: 'AI Concierge',
      description: 'Chat with an intelligent event assistant that understands your needs and provides personalized recommendations.',
      gradient: 'from-[#E63946] to-pink-500',
    },
    {
      icon: Users,
      title: 'Smart Networking',
      description: 'Find and connect with like-minded professionals using AI-powered matching based on interests and goals.',
      gradient: 'from-purple-500 to-[#E63946]',
    },
    {
      icon: Calendar,
      title: 'Personalized Agenda',
      description: 'Stay organized with a customized schedule that adapts to your preferences and networking opportunities.',
      gradient: 'from-blue-500 to-purple-500',
    },
  ];

  return (
    <section id="features" className="py-24 relative">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-900/50 to-black" />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-[#E63946]/5 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            Powerful Features
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Discover the tools that make networking seamless and meaningful
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative p-6 sm:p-8 bg-black/40 backdrop-blur-md border border-gray-800 rounded-2xl hover:border-[#E63946]/50 transition-all duration-500 hover:scale-105"
            >
              {/* Card Background Glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#E63946]/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              {/* Icon */}
              <div className={`relative mb-6 w-16 h-16 rounded-xl bg-gradient-to-br ${feature.gradient} p-4 group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className="w-full h-full text-white" />
              </div>

              {/* Content */}
              <div className="relative">
                <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-[#E63946] transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-300 leading-relaxed">
                  {feature.description}
                </p>
              </div>

              {/* Hover Line */}
              <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-[#E63946] to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-300 rounded-b-2xl" />
            </div>
          ))}
        </div>

        {/* Additional Info */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center px-6 py-3 bg-gray-900/60 backdrop-blur-md border border-gray-700 rounded-full">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-3 animate-pulse" />
            <span className="text-gray-300">All features powered by advanced AI</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
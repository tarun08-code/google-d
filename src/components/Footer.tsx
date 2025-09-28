import React from 'react';
import { Mail, MapPin, Phone } from 'lucide-react';

const Footer: React.FC = () => {
  const footerLinks = {
    Product: ['Features', 'Demo', 'Pricing', 'API'],
    Company: ['About', 'Careers', 'Blog', 'Press'],
    Support: ['Help Center', 'Documentation', 'Status', 'Contact'],
    Legal: ['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'GDPR'],
  };

  return (
    <footer className="relative bg-black border-t border-gray-800">
      {/* Background Elements */}
      <div className="absolute top-0 left-1/4 w-64 h-64 bg-rose-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-rose-500/5 rounded-full blur-3xl" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <h3 className="text-2xl font-bold text-rose-500 mb-4">Event Hub</h3>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Revolutionizing event networking with AI-powered connections and smart insights.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center text-gray-300">
                <Mail className="w-4 h-4 mr-3 text-rose-400" />
                <span>hello@eventhub.com</span>
              </div>
              <div className="flex items-center text-gray-300">
                <Phone className="w-4 h-4 mr-3 text-rose-400" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center text-gray-300">
                <MapPin className="w-4 h-4 mr-3 text-rose-400" />
                <span>San Francisco, CA</span>
              </div>
            </div>
          </div>

          {/* Links Sections */}
          <div className="lg:col-span-3 grid grid-cols-2 md:grid-cols-4 gap-8">
            {Object.entries(footerLinks).map(([category, links]) => (
              <div key={category}>
                <h4 className="text-white font-semibold mb-4">{category}</h4>
                <ul className="space-y-3">
                  {links.map((link) => (
                    <li key={link}>
                      <a
                        href="#"
                        className="text-gray-400 hover:text-rose-400 transition-colors duration-200"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="border-t border-gray-800 pt-8 mb-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-4 md:mb-0">
              <h4 className="text-white font-semibold mb-2">Stay Updated</h4>
              <p className="text-gray-400">Get the latest news and updates from Event Hub</p>
            </div>
            <div className="flex w-full md:w-auto max-w-md">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 bg-gray-900 border border-gray-700 rounded-l-lg text-white placeholder-gray-400 focus:outline-none focus:border-rose-500"
              />
              <button className="px-6 py-2 bg-rose-500 text-white rounded-r-lg hover:bg-rose-600 transition-colors font-medium">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row items-center justify-between">
          <div className="text-gray-400 text-sm mb-4 md:mb-0">
            © 2025 Event Hub. All rights reserved.
          </div>
          
          {/* Social Links */}
          <div className="flex space-x-6">
            {['Twitter', 'LinkedIn', 'GitHub', 'Discord'].map((social) => (
              <a
                key={social}
                href="#"
                className="text-gray-400 hover:text-rose-400 transition-colors duration-200 text-sm"
              >
                {social}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
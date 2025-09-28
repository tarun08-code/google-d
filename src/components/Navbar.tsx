import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'Features', href: '#features' },
    { name: 'Smart Networking', href: '#networking' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-black/80 backdrop-blur-md border-b border-gray-800' : 'bg-transparent'
      }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <h1 className="text-2xl font-bold text-rose-500 hover:text-rose-400 transition-colors cursor-pointer">
              Event Hub
            </h1>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium transition-colors duration-200 relative group"
                >
                  {link.name}
                  <span className="absolute inset-x-0 bottom-0 h-0.5 bg-rose-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-200" />
                </a>
              ))}
            </div>
          </div>

          {/* Host an Event Button */}
          <div className="hidden md:block">
            <button className="bg-rose-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-rose-600 hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-rose-500/25">
              Host an Event
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-300 hover:text-white p-2"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-black/95 backdrop-blur-md border-b border-gray-800">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-gray-300 hover:text-white block px-3 py-2 text-base font-medium transition-colors"
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </a>
            ))}
            <button className="w-full mt-4 bg-rose-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-rose-600 transition-colors">
              Host an Event
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
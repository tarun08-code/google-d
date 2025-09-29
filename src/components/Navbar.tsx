import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import AuthModal from './AuthModal';
import AdminLoginModal from './AdminLoginModal';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);

  const handleAdminLogin = () => {
    setIsAdminModalOpen(true);
  };

  const handleAdminSuccess = () => {
    // Navigate to admin panel
    window.location.href = '/admin';
  };

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
            <h1 className="text-2xl font-bold text-[#E63946] hover:text-[#C5303E] transition-colors cursor-pointer">
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
                  <span className="absolute inset-x-0 bottom-0 h-0.5 bg-[#E63946] scale-x-0 group-hover:scale-x-100 transition-transform duration-200" />
                </a>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <button
              onClick={() => {
                setAuthMode('login');
                setIsAuthModalOpen(true);
              }}
              className="text-gray-300 hover:text-white px-4 py-2 font-medium transition-colors duration-200"
            >
              Login
            </button>
            <button 
              onClick={handleAdminLogin}
              className="bg-[#E63946] text-white px-6 py-2 rounded-lg font-medium hover:bg-[#C5303E] hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-[#E63946]/25"
            >
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
          <div className="px-4 pt-4 pb-6 space-y-2">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-gray-300 hover:text-white block px-3 py-3 text-base font-medium transition-colors rounded-lg hover:bg-white/10"
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </a>
            ))}
            <div className="mt-6 space-y-3 pt-4 border-t border-gray-700">
              <button
                onClick={() => {
                  setAuthMode('login');
                  setIsAuthModalOpen(true);
                  setIsOpen(false);
                }}
                className="w-full border border-[#E63946] text-[#E63946] px-6 py-2 rounded-lg font-medium hover:bg-[#E63946] hover:text-white transition-colors"
              >
                Login
              </button>
              <button 
                onClick={() => {
                  handleAdminLogin();
                  setIsOpen(false);
                }}
                className="w-full bg-[#E63946] text-white px-6 py-2 rounded-lg font-medium hover:bg-[#C5303E] transition-colors"
              >
                Host an Event
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialMode={authMode}
      />
      
      {/* Admin Login Modal */}
      <AdminLoginModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
        onSuccess={handleAdminSuccess}
      />
    </nav>
  );
};

export default Navbar;
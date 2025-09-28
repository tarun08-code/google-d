import React, { useState } from 'react';
import { X, User, Mail, Lock, Linkedin, Eye, EyeOff } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'register';
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, initialMode = 'login' }) => {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    linkedinUrl: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'register') {
      if (formData.password !== formData.confirmPassword) {
        alert('Passwords do not match!');
        return;
      }
      // Handle registration logic here
      console.log('Registration data:', formData);
    } else {
      // Handle login logic here
      console.log('Login data:', { email: formData.email, password: formData.password });
    }
    onClose();
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      linkedinUrl: ''
    });
  };

  const switchMode = (newMode: 'login' | 'register') => {
    setMode(newMode);
    resetForm();
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-md mx-auto">
        {/* Modal Content */}
        <div className="bg-black rounded-2xl border border-white shadow-2xl max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between p-4 sm:p-6 border-b border-white">
            <h2 className="text-xl sm:text-2xl font-bold text-white">
              {mode === 'login' ? 'Welcome Back' : 'Join Event Hub'}
            </h2>
            <button
              onClick={onClose}
              className="text-white hover:text-[#E63946] transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4">
            {mode === 'register' && (
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white" size={20} />
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full pl-10 pr-4 py-3 bg-black border border-white rounded-lg text-white placeholder-white focus:outline-none focus:border-[#E63946] focus:ring-1 focus:ring-[#E63946]"
                />
              </div>
            )}

            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white" size={20} />
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full pl-10 pr-4 py-3 bg-black border border-white rounded-lg text-white placeholder-white focus:outline-none focus:border-[#E63946] focus:ring-1 focus:ring-[#E63946]"
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white" size={20} />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleInputChange}
                required
                className="w-full pl-10 pr-12 py-3 bg-black border border-white rounded-lg text-white placeholder-white focus:outline-none focus:border-[#E63946] focus:ring-1 focus:ring-[#E63946]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white hover:text-[#E63946]"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {mode === 'register' && (
              <>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white" size={20} />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    placeholder="Confirm Password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    required
                    className="w-full pl-10 pr-12 py-3 bg-black border border-white rounded-lg text-white placeholder-white focus:outline-none focus:border-[#E63946] focus:ring-1 focus:ring-[#E63946]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white hover:text-[#E63946]"
                  >
                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>

                <div className="relative">
                  <Linkedin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white" size={20} />
                  <input
                    type="url"
                    name="linkedinUrl"
                    placeholder="LinkedIn Profile URL (Optional)"
                    value={formData.linkedinUrl}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 bg-black border border-white rounded-lg text-white placeholder-white focus:outline-none focus:border-[#E63946] focus:ring-1 focus:ring-[#E63946]"
                  />
                </div>
              </>
            )}

            {mode === 'login' && (
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center text-white">
                  <input type="checkbox" className="mr-2" />
                  Remember me
                </label>
                <a href="#" className="text-[#E63946] hover:text-[#C5303E]">
                  Forgot password?
                </a>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-[#E63946] text-white py-3 rounded-lg font-semibold hover:bg-[#C5303E] transition-colors"
            >
              {mode === 'login' ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          {/* Footer */}
          <div className="p-4 sm:p-6 border-t border-white text-center">
            <p className="text-white">
              {mode === 'login' ? "Don't have an account? " : "Already have an account? "}
              <button
                onClick={() => switchMode(mode === 'login' ? 'register' : 'login')}
                className="text-[#E63946] hover:text-[#C5303E] font-medium"
              >
                {mode === 'login' ? 'Sign Up' : 'Sign In'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
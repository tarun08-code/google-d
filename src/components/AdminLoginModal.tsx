import React, { useState } from 'react';
import { X, Shield, Eye, EyeOff, UserPlus, Phone } from 'lucide-react';
import { corsApiClient } from '../services/CorsApiClient';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface AdminCredentials {
  email: string;
  password: string;
}

interface AdminSignupData {
  name: string;
  email: string;
  phoneNumber: string;
  password: string;
}

const AdminLoginModal: React.FC<AdminLoginModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [credentials, setCredentials] = useState<AdminCredentials>({ email: '', password: '' });
  const [signupData, setSignupData] = useState<AdminSignupData>({ 
    name: '', 
    email: '', 
    phoneNumber: '', 
    password: '' 
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSignupMode, setIsSignupMode] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Use dummy admin credentials for testing
      console.log('Admin login attempt:', credentials.email);
      
      // Mock admin credentials
      const validAdminEmails = ['admin@eventhub.com', 'admin@test.com', 'test@admin.com'];
      const validPassword = 'admin123';
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (validAdminEmails.includes(credentials.email.toLowerCase()) && 
          credentials.password === validPassword) {
        
        // Store mock authentication data
        localStorage.setItem('isAdminLoggedIn', 'true');
        localStorage.setItem('adminToken', 'mock-admin-token-' + Date.now());
        localStorage.setItem('tokenType', 'Bearer');
        localStorage.setItem('adminLoginTime', new Date().toISOString());
        localStorage.setItem('adminEmail', credentials.email);
        
        console.log('✅ Admin login successful (mock)');
        onSuccess();
        onClose();
        
      } else {
        setError('Invalid admin credentials. Try admin@eventhub.com / admin123');
      }

    } catch (error: any) {
      console.error('Login error:', error);
      setError('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Always try proxy route first to avoid CORS issues
      let response = await corsApiClient.post('/api/users/signup/admin', signupData);
      
      // If proxy fails, try direct API as fallback
      if (!response.success && response.error?.includes('Proxy connection failed')) {
        console.log('Proxy failed, trying direct API call:', response.error);
        try {
          response = await corsApiClient.post('/users/signup/admin', signupData);
        } catch (directError) {
          console.log('Direct API also failed:', directError);
          // Keep the proxy error response
        }
      }

      if (!response.success) {
        throw new Error(response.error || 'Signup failed');
      }

      const data = response.data as any;
      
      // Store the token and admin status
      localStorage.setItem('adminToken', data?.token || '');
      localStorage.setItem('isAdminLoggedIn', 'true');
      localStorage.setItem('adminLoginTime', new Date().toISOString());
      
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error('Admin signup error:', error);
      
      // Handle CORS-specific errors
      if (error.message?.includes('CORS') || error.message?.includes('ERR_FAILED')) {
        setError('Connection failed. Please check if the server allows requests from this domain.');
      } else {
        setError(error.message || 'Signup failed. Please try again.');
      }
    }

    setIsLoading(false);
  };

  const handleLoginInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials(prev => ({ ...prev, [name]: value }));
    setError(''); // Clear error when user types
  };

  const handleSignupInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSignupData(prev => ({ ...prev, [name]: value }));
    setError(''); // Clear error when user types
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm overflow-y-auto">
      <div className="min-h-full flex items-center justify-center p-4">
        <div className="relative w-full max-w-md mx-auto bg-gray-900 rounded-2xl border border-gray-700 shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-700">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-[#E63946]/20 rounded-full flex items-center justify-center">
                {isSignupMode ? <UserPlus className="w-5 h-5 text-[#E63946]" /> : <Shield className="w-5 h-5 text-[#E63946]" />}
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">
                  {isSignupMode ? 'Admin Signup' : 'Admin Login'}
                </h2>
                <p className="text-gray-400 text-sm">
                  {isSignupMode ? 'Create admin account' : 'Access admin panel'}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white p-2 rounded-lg hover:bg-gray-800 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={isSignupMode ? handleSignup : handleLogin} className="p-6">
            <div className="space-y-4">
              {isSignupMode ? (
                // Signup fields
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
                    <input
                      type="text"
                      name="name"
                      value={signupData.name}
                      onChange={handleSignupInputChange}
                      required
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#E63946]/50 transition-colors"
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={signupData.email}
                      onChange={handleSignupInputChange}
                      required
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#E63946]/50 transition-colors"
                      placeholder="Enter your email"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Phone Number</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                      <input
                        type="tel"
                        name="phoneNumber"
                        value={signupData.phoneNumber}
                        onChange={handleSignupInputChange}
                        required
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 pl-12 text-white focus:outline-none focus:ring-2 focus:ring-[#E63946]/50 transition-colors"
                        placeholder="+1234567890"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        value={signupData.password}
                        onChange={handleSignupInputChange}
                        required
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 pr-12 text-white focus:outline-none focus:ring-2 focus:ring-[#E63946]/50 transition-colors"
                        placeholder="Create a strong password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                      >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                // Login fields
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={credentials.email}
                      onChange={handleLoginInputChange}
                      required
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#E63946]/50 transition-colors"
                      placeholder="Enter admin email"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        value={credentials.password}
                        onChange={handleLoginInputChange}
                        required
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 pr-12 text-white focus:outline-none focus:ring-2 focus:ring-[#E63946]/50 transition-colors"
                        placeholder="Enter admin password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                      >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                  </div>
                </>
              )}

              {error && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              )}
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 bg-gray-700 hover:bg-gray-600 text-white px-4 py-3 rounded-lg font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 bg-[#E63946] hover:bg-[#C5303E] text-white px-4 py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading 
                  ? (isSignupMode ? 'Creating Account...' : 'Logging in...') 
                  : (isSignupMode ? 'Create Account' : 'Login')
                }
              </button>
            </div>

            {/* Mode toggle */}
            <div className="mt-4 text-center">
              <button
                type="button"
                onClick={() => {
                  setIsSignupMode(!isSignupMode);
                  setError('');
                  setCredentials({ email: '', password: '' });
                  setSignupData({ name: '', email: '', phoneNumber: '', password: '' });
                }}
                className="text-sm text-gray-400 hover:text-[#E63946] transition-colors"
              >
                {isSignupMode 
                  ? 'Already have an account? Login here' 
                  : 'Need an admin account? Sign up here'
                }
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginModal;
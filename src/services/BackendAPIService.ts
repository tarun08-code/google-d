// Mock API service to demonstrate integration with backend
// Replace with actual API calls in production

interface BackendUserData {
  id: string;
  username: string;
  password: string; // In production, this would be hashed
  name: string;
  email: string;
  registrationDate: string;
  role: 'participant' | 'admin' | 'mentor';
  teamId?: string;
  skills?: string[];
  profilePicture?: string;
}

interface LoginResponse {
  success: boolean;
  user?: BackendUserData;
  token?: string;
  message?: string;
}

export class BackendAPIService {
  private static baseUrl = 'https://api.techhack2025.com'; // Replace with actual API URL
  
  // Mock user database (replace with actual API calls)
  private static mockUsers: BackendUserData[] = [
    {
      id: '1',
      username: 'john.doe',
      password: 'password123',
      name: 'John Doe',
      email: 'john.doe@email.com',
      registrationDate: '2025-03-10T10:00:00Z',
      role: 'participant',
      skills: ['React', 'Python', 'AI/ML']
    },
    {
      id: '2',
      username: 'jane.smith',
      password: 'securepass456',
      name: 'Jane Smith',
      email: 'jane.smith@email.com',
      registrationDate: '2025-03-10T14:30:00Z',
      role: 'participant',
      skills: ['Vue.js', 'Node.js', 'Blockchain']
    }
  ];

  /**
   * Login user and get user data
   */
  static async login(username: string, password: string): Promise<LoginResponse> {
    try {
      // In production, this would be an actual API call:
      // const response = await fetch(`${this.baseUrl}/auth/login`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ username, password })
      // });
      // return await response.json();

      // Mock implementation for demo
      await this.delay(1000); // Simulate network delay
      
      const user = this.mockUsers.find(u => 
        u.username === username && u.password === password
      );

      if (user) {
        const { password: _, ...userWithoutPassword } = user;
        return {
          success: true,
          user: userWithoutPassword as BackendUserData,
          token: `mock_token_${user.id}_${Date.now()}`,
        };
      } else {
        return {
          success: false,
          message: 'Invalid username or password'
        };
      }
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        message: 'Network error. Please try again.'
      };
    }
  }

  /**
   * Get user profile data
   */
  static async getUserProfile(userId: string, token: string): Promise<BackendUserData | null> {
    try {
      // In production:
      // const response = await fetch(`${this.baseUrl}/users/${userId}`, {
      //   headers: { 'Authorization': `Bearer ${token}` }
      // });
      // return await response.json();

      await this.delay(500);
      const user = this.mockUsers.find(u => u.id === userId);
      return user || null;
    } catch (error) {
      console.error('Profile fetch error:', error);
      return null;
    }
  }

  /**
   * Update user profile
   */
  static async updateUserProfile(userId: string, updates: Partial<BackendUserData>, token: string): Promise<boolean> {
    try {
      // In production:
      // const response = await fetch(`${this.baseUrl}/users/${userId}`, {
      //   method: 'PATCH',
      //   headers: { 
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${token}` 
      //   },
      //   body: JSON.stringify(updates)
      // });
      // return response.ok;

      await this.delay(800);
      const userIndex = this.mockUsers.findIndex(u => u.id === userId);
      if (userIndex !== -1) {
        this.mockUsers[userIndex] = { ...this.mockUsers[userIndex], ...updates };
        return true;
      }
      return false;
    } catch (error) {
      console.error('Profile update error:', error);
      return false;
    }
  }

  /**
   * Register new user
   */
  static async registerUser(userData: Omit<BackendUserData, 'id' | 'registrationDate'>): Promise<LoginResponse> {
    try {
      // In production:
      // const response = await fetch(`${this.baseUrl}/auth/register`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(userData)
      // });
      // return await response.json();

      await this.delay(1200);
      
      // Check if username/email already exists
      const existingUser = this.mockUsers.find(u => 
        u.username === userData.username || u.email === userData.email
      );

      if (existingUser) {
        return {
          success: false,
          message: 'Username or email already exists'
        };
      }

      const newUser: BackendUserData = {
        ...userData,
        id: (this.mockUsers.length + 1).toString(),
        registrationDate: new Date().toISOString()
      };

      this.mockUsers.push(newUser);
      const { password: _, ...userWithoutPassword } = newUser;
      
      return {
        success: true,
        user: userWithoutPassword as BackendUserData,
        token: `mock_token_${newUser.id}_${Date.now()}`,
      };
    } catch (error) {
      console.error('Registration error:', error);
      return {
        success: false,
        message: 'Network error. Please try again.'
      };
    }
  }

  /**
   * Validate QR code data
   */
  static async validateQRCode(qrData: string, token: string): Promise<{ valid: boolean; user?: BackendUserData }> {
    try {
      // In production:
      // const response = await fetch(`${this.baseUrl}/qr/validate`, {
      //   method: 'POST',
      //   headers: { 
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${token}` 
      //   },
      //   body: JSON.stringify({ qrData })
      // });
      // return await response.json();

      await this.delay(300);
      
      try {
        const parsed = JSON.parse(qrData);
        if (parsed.type === 'TECHHACK2025_REGISTRATION') {
          // Validate user exists
          const user = this.mockUsers.find(u => u.email === parsed.email);
          return { valid: !!user, user };
        }
      } catch {
        // Invalid QR format
      }
      
      return { valid: false };
    } catch (error) {
      console.error('QR validation error:', error);
      return { valid: false };
    }
  }

  // Utility method to simulate network delay
  private static delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Example usage for integration:
   */
  static exampleUsage() {
    return {
      // 1. Login with backend credentials
      login: async (username: string, password: string) => {
        const result = await this.login(username, password);
        if (result.success && result.user) {
          // Store token for future requests
          localStorage.setItem('authToken', result.token!);
          localStorage.setItem('userId', result.user.id);
          
          // Transform to app format
          const userData = {
            name: result.user.name,
            email: result.user.email,
            linkedinUrl: '', // Map from backend data
            registrationDate: result.user.registrationDate,
            following: [] // Initialize empty
          };
          
          localStorage.setItem('userData', JSON.stringify(userData));
          return { success: true, userData };
        }
        return { success: false, message: result.message };
      },

      // 2. Generate QR with backend user data
      generateQR: async (userId: string) => {
        const token = localStorage.getItem('authToken');
        if (!token) return null;
        
        const user = await this.getUserProfile(userId, token);
        if (!user) return null;
        
        // Use QRCodeService with backend data
        // const qrResult = await QRCodeService.generateQRCode({
        //   name: user.name,
        //   email: user.email,
        //   registrationDate: user.registrationDate
        // });
        // return qrResult;
      }
    };
  }
}

// Example integration in components:
/*
// In AuthModal or login component:
const handleLogin = async (username: string, password: string) => {
  const result = await BackendAPIService.login(username, password);
  if (result.success) {
    // User logged in successfully
    window.location.reload(); // or navigate to dashboard
  } else {
    setError(result.message);
  }
};

// In Dashboard component:
const userData = useMemo(() => {
  const stored = localStorage.getItem('userData');
  return stored ? JSON.parse(stored) : null;
}, []);

// Generate QR with backend data:
const generateQR = useCallback(async () => {
  const userId = localStorage.getItem('userId');
  if (!userId || !userData) return;
  
  const qrResult = await QRCodeService.generateQRCode(userData);
  setQRData(qrResult);
}, [userData]);
*/
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { classroomService, UserProfile } from '@/services/classroomService';

export type UserRole = 'admin' | 'teacher' | 'student';

interface AuthContextType {
  token: string | null;
  user: UserProfile | null;
  role: UserRole | null;
  isLoading: boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Admin emails - configure these for your organization (Superadmins with full Classroom access)
const ADMIN_EMAILS = ['principal@school.edu', 'admin@school.edu', 'pulkit@mangosorange.com', 'mentor.ravi.db@gmail.com', 'demo@prasad.edu.in'];

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('google_access_token');
      
      if (!storedToken) {
        setIsLoading(false);
        return;
      }

      try {
        setToken(storedToken);
        
        // Fetch user profile
        const userProfile = await classroomService.getUserProfile(storedToken);
        setUser(userProfile);

        // Detect role
        const detectedRole = await classroomService.detectUserRole(storedToken, ADMIN_EMAILS);
        setRole(detectedRole);
        
        // Store role for quick access
        localStorage.setItem('user_role', detectedRole);
      } catch (error) {
        console.error('Auth initialization failed:', error);
        localStorage.removeItem('google_access_token');
        localStorage.removeItem('user_role');
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const logout = () => {
    localStorage.removeItem('google_access_token');
    localStorage.removeItem('user_role');
    setToken(null);
    setUser(null);
    setRole(null);
    navigate('/');
  };

  return (
    <AuthContext.Provider value={{ token, user, role, isLoading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

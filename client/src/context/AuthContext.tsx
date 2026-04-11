import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { authAPI } from '@/services/api';

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  isVerified: boolean;
  bookmarks: string[];
  profileCompletionPercentage: number;
  authProvider: string;
  education?: string;
  degreeType?: string;
  skills?: string[];
  interests?: string[];
  isPhoneVerified?: boolean;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<ReturnType<typeof authAPI.login> extends Promise<infer R> ? R : never>;
  register: (data: { name: string; email: string; password: string }) => Promise<ReturnType<typeof authAPI.register> extends Promise<infer R> ? R : never>;
  verifyOTP: (email: string, otp: string) => Promise<ReturnType<typeof authAPI.verifyOTP> extends Promise<infer R> ? R : never>;
  resendOTP: (email: string) => Promise<ReturnType<typeof authAPI.resendOTP> extends Promise<infer R> ? R : never>;
  logout: () => void;
  updateBookmarks: (bookmarks: string[]) => void;
  loginWithGoogle: () => void;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('ai_hustle_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem('ai_hustle_token')
  );
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!token && !!user;

  // Handle Google OAuth callback — check URL for token param
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const googleToken = urlParams.get('token');
    if (googleToken) {
      setToken(googleToken);
      localStorage.setItem('ai_hustle_token', googleToken);
      // Clean the URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  // Load profile on mount if token exists
  useEffect(() => {
    const loadProfile = async () => {
      const currentToken = token || localStorage.getItem('ai_hustle_token');
      if (currentToken) {
        try {
          const res = await authAPI.getProfile();
          setUser(res.data.user);
          localStorage.setItem('ai_hustle_user', JSON.stringify(res.data.user));
        } catch {
          // Token expired or invalid
          localStorage.removeItem('ai_hustle_token');
          localStorage.removeItem('ai_hustle_user');
          setToken(null);
          setUser(null);
        }
      }
      setIsLoading(false);
    };
    loadProfile();
  }, [token]);

  const login = useCallback(async (email: string, password: string) => {
    const res = await authAPI.login({ email, password });
    const { token: newToken, user: userData } = res.data;
    setToken(newToken);
    setUser(userData);
    localStorage.setItem('ai_hustle_token', newToken);
    localStorage.setItem('ai_hustle_user', JSON.stringify(userData));
    return res.data;
  }, []);

  const register = useCallback(async (data: { name: string; email: string; password: string }) => {
    const res = await authAPI.register(data);
    return res.data;
  }, []);

  const verifyOTP = useCallback(async (email: string, otp: string) => {
    const res = await authAPI.verifyOTP({ email, otp });
    const { token: newToken, user: userData } = res.data;
    setToken(newToken);
    setUser(userData);
    localStorage.setItem('ai_hustle_token', newToken);
    localStorage.setItem('ai_hustle_user', JSON.stringify(userData));
    return res.data;
  }, []);

  const resendOTP = useCallback(async (email: string) => {
    const res = await authAPI.resendOTP({ email });
    return res.data;
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('ai_hustle_token');
    localStorage.removeItem('ai_hustle_user');
  }, []);

  const updateBookmarks = useCallback((bookmarks: string[]) => {
    if (user) {
      const updatedUser = { ...user, bookmarks };
      setUser(updatedUser);
      localStorage.setItem('ai_hustle_user', JSON.stringify(updatedUser));
    }
  }, [user]);

  const loginWithGoogle = useCallback(() => {
    const apiBase = import.meta.env.VITE_API_URL || '/api';
    // For relative URLs, construct the full URL
    const baseUrl = apiBase.startsWith('http') ? apiBase : window.location.origin + apiBase;
    window.location.href = `${baseUrl}/auth/google`;
  }, []);

  const refreshProfile = useCallback(async () => {
    try {
      const res = await authAPI.getProfile();
      setUser(res.data.user);
      localStorage.setItem('ai_hustle_user', JSON.stringify(res.data.user));
    } catch {
      // Silently fail — profile will be refreshed on next load
    }
  }, []);

  return (
    <AuthContext.Provider value={{
      user, token, isAuthenticated, isLoading,
      login, register, verifyOTP, resendOTP, logout, updateBookmarks,
      loginWithGoogle, refreshProfile,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}

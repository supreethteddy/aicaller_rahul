import React, { createContext, useContext, useState } from 'react';

// Mock user data
const MOCK_USER = {
  id: 'mock-user-123',
  email: 'test@test.com',
  created_at: '2024-01-01T00:00:00Z',
  user_metadata: {
    full_name: 'Test User',
    super_admin: false
  }
};

const MOCK_SESSION = {
  user: MOCK_USER,
  access_token: 'mock-token',
  expires_at: Date.now() + 86400000, // 24 hours from now
  refresh_token: 'mock-refresh-token'
};

interface AuthContextType {
  user: any | null;
  session: any | null;
  loading: boolean;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<{ error: any }>;
  resetPassword: (email: string) => Promise<{ error: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState(MOCK_USER);
  const [session, setSession] = useState(MOCK_SESSION);
  const [loading, setLoading] = useState(false);

  const signUp = async (email: string, password: string, fullName: string) => {
    // Static signup - only allow test@test.com with 12test@
    if (email === 'test@test.com' && password === '12test@') {
      setUser(MOCK_USER);
      setSession(MOCK_SESSION);
      return { error: null };
    } else {
      return { error: { message: 'Invalid credentials. Use test@test.com and 12test@' } };
    }
  };

  const signIn = async (email: string, password: string) => {
    // Static signin - only allow test@test.com with 12test@
    if (email === 'test@test.com' && password === '12test@') {
      setUser(MOCK_USER);
      setSession(MOCK_SESSION);
      return { error: null };
    } else {
      return { error: { message: 'Invalid credentials. Use test@test.com and 12test@' } };
    }
  };

  const signOut = async () => {
    setUser(null);
    setSession(null);
    window.location.href = '/';
    return { error: null };
  };

  const resetPassword = async (email: string) => {
    return { error: null };
  };

  const value = {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    resetPassword
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { toast } from 'sonner';
import { api } from '@/lib/api';

interface User {
  id: string;
  email: string;
  displayName: string;
}

interface AuthContextType {
  user: User | null;
  profile: any | null;
  loading: boolean;
  isAdmin: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string, displayName?: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  signInWithGithub: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: Error | null }>;
  updatePassword: (password: string) => Promise<{ error: Error | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  const fetchProfile = async (userId: string) => {
    try {
      const response = await api.user.getProfile(userId);

      if (response.success && response.data) {
        setProfile(response.data);
        const isAdminUser = response.data.role === 'admin';
        setIsAdmin(isAdminUser);
        return { profile: response.data, isAdmin: isAdminUser };
      }
      return { profile: null, isAdmin: false };
    } catch (err) {
      console.error('Error fetching profile:', err);
      return { profile: null, isAdmin: false };
    }
  };

  useEffect(() => {
    let mounted = true;

    // Check if user is already logged in
    const initAuth = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const userId = localStorage.getItem('userId');

        if (token && userId && mounted) {
          // Try to fetch user profile
          const response = await api.user.getProfile(userId);
          if (response.success && response.data) {
            const userData: User = {
              id: response.data.id,
              email: response.data.email,
              displayName: response.data.displayName,
            };
            setUser(userData);
            setProfile(response.data);
            setIsAdmin(response.data.role === 'admin');
          } else {
            // Token is invalid, clear it
            localStorage.removeItem('authToken');
            localStorage.removeItem('userId');
          }
        }
      } catch (err) {
        console.error('Auth initialization error:', err);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    initAuth();

    return () => {
      mounted = false;
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const response = await api.auth.login(email, password);
      if (response.success && response.data) {
        localStorage.setItem('userId', response.data.id);
        const userData: User = {
          id: response.data.id,
          email,
          displayName: response.data.displayName,
        };
        setUser(userData);
        await fetchProfile(response.data.id);
        toast.success('Đăng nhập thành công!');
        return { error: null };
      } else {
        throw new Error(response.error || 'Đăng nhập thất bại');
      }
    } catch (error) {
      const err = error as Error;
      toast.error(err.message);
      return { error: err };
    }
  };

  const signUp = async (email: string, password: string, displayName?: string) => {
    try {
      const response = await api.auth.signup(
        email,
        password,
        displayName || email.split('@')[0]
      );
      if (response.success && response.data) {
        localStorage.setItem('userId', response.data.id);
        const userData: User = {
          id: response.data.id,
          email,
          displayName: displayName || email.split('@')[0],
        };
        setUser(userData);
        await fetchProfile(response.data.id);
        toast.success('Đăng ký thành công!');
        return { error: null };
      } else {
        throw new Error(response.error || 'Đăng ký thất bại');
      }
    } catch (error) {
      const err = error as Error;
      toast.error(err.message);
      return { error: err };
    }
  };

  const signOut = async () => {
    try {
      api.auth.logout();
      setUser(null);
      setProfile(null);
      setIsAdmin(false);
      localStorage.removeItem('userId');
      toast.success('Đã đăng xuất');
    } catch (err) {
      console.error('Sign out error:', err);
    }
  };


  const signInWithGithub = async () => {
    try {
      // For OAuth, typically you'd redirect to your backend OAuth endpoint
      // The backend would handle the OAuth code exchange
      toast.info('Redirecting to GitHub...');
      // This is a simplified implementation - actual OAuth flow depends on your backend setup
      window.location.href = `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/oauth/github`;
    } catch (error) {
      toast.error('Đăng nhập với GitHub thất bại');
    }
  };

  const signInWithGoogle = async () => {
    try {
      // For OAuth, typically you'd redirect to your backend OAuth endpoint
      toast.info('Redirecting to Google...');
      window.location.href = `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/oauth/google`;
    } catch (error) {
      toast.error('Đăng nhập với Google thất bại');
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const response = await api.auth.forgotPassword(email);
      if (response.success) {
        toast.success('Email reset password đã được gửi');
        return { error: null };
      } else {
        throw new Error(response.error || 'Gửi email thất bại');
      }
    } catch (error) {
      const err = error as Error;
      toast.error(err.message);
      return { error: err };
    }
  };

  const updatePassword = async (password: string) => {
    try {
      // This would typically require the current password as well
      // You might need to adjust this based on your backend implementation
      toast.error('Vui lòng sử dụng "Quên mật khẩu" để đặt lại mật khẩu');
      return { error: new Error('Use forgot password') };
    } catch (error) {
      const err = error as Error;
      return { error: err };
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      profile,
      loading,
      isAdmin,
      signIn,
      signUp,
      signOut,
      signInWithGithub,
      signInWithGoogle,
      resetPassword,
      updatePassword,
    }}>
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

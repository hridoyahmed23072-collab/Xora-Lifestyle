import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  type User,
} from 'firebase/auth';
import { auth, isFirebaseConfigured, ADMIN_EMAIL, ADMIN_EMAILS } from '../lib/firebase';

interface AuthContextType {
  user: User | { email: string; uid: string; displayName?: string } | null;
  isAdmin: boolean;
  loading: boolean;
  login: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  loginAsDemoAdmin: () => void;
  logout: () => Promise<void>;
  adminEmail: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEMO_AUTH_STORAGE_KEY = 'xora_demo_admin_user';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | { email: string; uid: string; displayName?: string } | null>(null);
  const [loading, setLoading] = useState(true);

  const targetAdminEmail = (ADMIN_EMAIL || 'admin@xoralifestyle.com').toLowerCase().trim();

  useEffect(() => {
    if (isFirebaseConfigured && auth) {
      const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
        setUser(firebaseUser);
        setLoading(false);
      });
      return () => unsubscribe();
    } else {
      // Check localStorage for demo admin session
      try {
        const savedDemo = localStorage.getItem(DEMO_AUTH_STORAGE_KEY);
        if (savedDemo) {
          const parsed = JSON.parse(savedDemo);
          if (parsed?.email && ADMIN_EMAILS.includes(parsed.email.toLowerCase().trim())) {
            setUser(parsed);
          } else {
            localStorage.removeItem(DEMO_AUTH_STORAGE_KEY);
            setUser(null);
          }
        }
      } catch (e) {
        console.warn('Error reading demo auth state:', e);
      }
      setLoading(false);
    }
  }, [targetAdminEmail]);

  const isAdmin = Boolean(
    user && user.email && ADMIN_EMAILS.includes(user.email.toLowerCase().trim())
  );

  const login = async (email: string, pass: string): Promise<{ success: boolean; error?: string }> => {
    const cleanEmail = email.toLowerCase().trim();

    // Verification check for admin email
    if (!ADMIN_EMAILS.includes(cleanEmail)) {
      return {
        success: false,
        error: 'Access Denied. Only authorized administrator accounts are permitted to log in.',
      };
    }

    if (!pass || pass.trim().length === 0) {
      return {
        success: false,
        error: 'Please enter your password.',
      };
    }

    if (isFirebaseConfigured && auth) {
      try {
        const cred = await signInWithEmailAndPassword(auth, email, pass);
        setUser(cred.user);
        return { success: true };
      } catch (err: any) {
        return {
          success: false,
          error: err.message || 'Invalid email or password',
        };
      }
    } else {
      // Demo Mode login: accepts login for targetAdminEmail
      const demoUser = {
        email: targetAdminEmail,
        uid: 'demo-admin-uid-101',
        displayName: 'Xora Admin (Demo)',
      };
      localStorage.setItem(DEMO_AUTH_STORAGE_KEY, JSON.stringify(demoUser));
      setUser(demoUser);
      return { success: true };
    }
  };

  const loginAsDemoAdmin = () => {
    const demoUser = {
      email: targetAdminEmail,
      uid: 'demo-admin-uid-101',
      displayName: 'Xora Admin (Demo)',
    };
    localStorage.setItem(DEMO_AUTH_STORAGE_KEY, JSON.stringify(demoUser));
    setUser(demoUser);
  };

  const logout = async () => {
    if (isFirebaseConfigured && auth) {
      await signOut(auth);
    }
    localStorage.removeItem(DEMO_AUTH_STORAGE_KEY);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAdmin,
        loading,
        login,
        loginAsDemoAdmin,
        logout,
        adminEmail: targetAdminEmail,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

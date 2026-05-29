import React, { createContext, useContext, useState, useEffect } from 'react';
import { signIn as apiSignIn, signUp as apiSignUp, getMe } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser]           = useState(null);
  const [loading, setLoading]     = useState(true);
  const [orderCount, setOrderCount] = useState(0);

  // ── On app load, restore user from localStorage ────────────────────────
  useEffect(() => {
    const token     = localStorage.getItem('gymrat_token');
    const savedUser = localStorage.getItem('gymrat_user');
    if (token && savedUser) {
      setUser(JSON.parse(savedUser));
      getMe()
        .then(res => {
          setUser(res.data.user);
          setOrderCount(res.data.user.orderCount || 0);
        })
        .catch(() => {
          localStorage.removeItem('gymrat_token');
          localStorage.removeItem('gymrat_user');
          setUser(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  // ── Email / Password Sign-In ───────────────────────────────────────────
  const login = async (email, password) => {
    try {
      const res = await apiSignIn({ email, password });
      const { token, user } = res.data;
      localStorage.setItem('gymrat_token', token);
      localStorage.setItem('gymrat_user', JSON.stringify(user));
      setUser(user);
      setOrderCount(user.orderCount || 0);
      return { success: true, data: res.data };
    } catch (err) {
      return { success: false, error: err.response?.data?.message || 'Login failed. Please check your credentials.' };
    }
  };

  // ── Email / Password Register ──────────────────────────────────────────
  const register = async (userData) => {
    try {
      const res = await apiSignUp(userData);
      const { token, user } = res.data;
      localStorage.setItem('gymrat_token', token);
      localStorage.setItem('gymrat_user', JSON.stringify(user));
      setUser(user);
      setOrderCount(0);
      return { success: true, data: res.data };
    } catch (err) {
      const msg =
        err.response?.data?.errors?.[0]?.message ||
        err.response?.data?.message ||
        'Registration failed. Please check your details.';
      return { success: false, error: msg };
    }
  };

  // ── Google Sign-In / Sign-Up ───────────────────────────────────────────
  // credentialResponse : { credential } from @react-oauth/google onSuccess
  // planKey            : 'standard' | 'business' | 'vip'  (default 'standard')
  const loginWithGoogle = async (credentialResponse, planKey = 'standard') => {
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_URL || 'http://localhost:5001/api'}/auth/google`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            credential: credentialResponse.credential,
            plan: planKey,
          }),
        }
      );
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.message || 'Google Sign-In failed.' };
      }
      localStorage.setItem('gymrat_token', data.token);
      localStorage.setItem('gymrat_user', JSON.stringify(data.user));
      setUser(data.user);
      setOrderCount(data.user.orderCount || 0);
      return { success: true, data };
    } catch (err) {
      return { success: false, error: 'Google Sign-In failed. Please try again.' };
    }
  };

  // ── Logout ─────────────────────────────────────────────────────────────
  const logout = () => {
    localStorage.removeItem('gymrat_token');
    localStorage.removeItem('gymrat_user');
    setUser(null);
    setOrderCount(0);
  };

  const incrementOrderCount = () => setOrderCount(prev => prev + 1);

  // ── Refresh / Update User ──────────────────────────────────────────────
  const refreshUser = async () => {
    try {
      const res = await getMe();
      const updatedUser = res.data.user || res.data;
      setUser(updatedUser);
      localStorage.setItem('gymrat_user', JSON.stringify(updatedUser));
      return updatedUser;
    } catch (err) {
      console.error('refreshUser error:', err);
    }
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('gymrat_user', JSON.stringify(updatedUser));
  };

  // ── Computed flags ─────────────────────────────────────────────────────
  const isAdmin   = user?.role === 'super_admin';
  // Accept both Title-case (legacy) and lowercase (new) plan values
  const isPremium = ['business', 'vip', 'Business', 'VIP'].includes(user?.plan);

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      orderCount,
      error: null,          // kept for API compat; individual errors come from login/register return values
      isAuthenticated: !!user,
      isAdmin,
      isPremium,
      login,
      loginWithGoogle,
      register,
      logout,
      incrementOrderCount,
      refreshUser,
      updateUser,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};
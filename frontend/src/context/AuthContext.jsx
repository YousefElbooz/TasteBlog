import { createContext, useState, useEffect, useContext } from 'react';
import api from '../api/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      if (localStorage.getItem('token')) {
        try {
          const res = await api.get('/me');
          setUser(res.data);
        } catch (error) {
          localStorage.removeItem('token');
        }
      }
      setLoading(false);
    };
    fetchUser();
  }, []);

  const login = async (credentials) => {
    const res = await api.post('/login', credentials);
    localStorage.setItem('token', res.data.access_token);
    setUser(res.data.user);
  };

  const signup = async (formData) => {
    const res = await api.post('/signup', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    localStorage.setItem('token', res.data.access_token);
    setUser(res.data.user);
  };

  const logout = async () => {
    await api.post('/logout');
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

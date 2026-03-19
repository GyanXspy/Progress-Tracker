import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../api/config';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const initAuth = async () => {
            if (token) {
                try {
                    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                    const res = await api.get('/auth/user');
                    setUser(res.data);
                    localStorage.setItem('user', JSON.stringify(res.data));
                } catch (err) {
                    console.error('Auth Error', err);
                    logout();
                }
            }
            setLoading(false);
        };
        initAuth();
    }, [token]);

    const register = async (userData) => {
        const res = await api.post('/auth/register', userData);
        setToken(res.data.token);
        setUser(res.data.user);
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user));
        api.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
        navigate('/dashboard');
    };

    const login = async (userData) => {
        const res = await api.post('/auth/login', userData);
        setToken(res.data.token);
        setUser(res.data.user);
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user));
        api.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
        navigate('/dashboard');
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        delete api.defaults.headers.common['Authorization'];
        navigate('/signin');
    };

    return (
        <AuthContext.Provider value={{ user, token, register, login, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

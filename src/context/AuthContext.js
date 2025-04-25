import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const userData = localStorage.getItem('userData');
        if (userData) {
            setUser(JSON.parse(userData));
            setIsAuthenticated(true);
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            setError(null);
            const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/login`, {
                email,
                password
            });

            localStorage.setItem('userData', JSON.stringify(res.data));
            setUser(res.data);
            setIsAuthenticated(true);
            return res.data;
        } catch (error) {
            setError(error.response?.data?.message || 'An error occurred during login');
            throw error;
        }
    };

    const register = async (email, password) => {
        try {
            setError(null);
            const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/signup`, {
                email,
                password
            });

            localStorage.setItem('userData', JSON.stringify(res.data));
            setUser(res.data);
            setIsAuthenticated(true);
            return res.data;
        } catch (error) {
            setError(error.response?.data?.message || 'An error occurred during registration');
            throw error;
        }
    };

    const logout = () => {
        localStorage.removeItem('userData');
        setUser(null);
        setIsAuthenticated(false);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated,
                loading,
                error,
                login,
                register,
                logout
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
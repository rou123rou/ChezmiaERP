// AuthContext.tsx
import React, { createContext, useState, useContext, ReactNode, useCallback, useEffect } from 'react';

export interface AuthContextType {
    user: any | null;
    login: (email: string, password: string) => Promise<boolean>;
    logout: () => void;
    signup: (nom: string, prenom: string, email: string, password: string) => Promise<boolean>;
    isAuthenticated: boolean;

    loading: boolean;
    error: string | null;
    setUser: React.Dispatch<React.SetStateAction<any | null>>;
    setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
    authChangeCounter: number;
    incrementAuthChangeCounter: () => void;
    token: string | null; // Ajout de la propriété token à l'interface
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<any | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [authChangeCounter, setAuthChangeCounter] = useState(0);
    const [token, setToken] = useState<string | null>(localStorage.getItem('token') || null); // Initialize token from localStorage

    const incrementAuthChangeCounter = useCallback(() => {
        setAuthChangeCounter(prevCounter => prevCounter + 1);
    }, []);

    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const login = useCallback(async (email: string, password: string): Promise<boolean> => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${backendUrl}/api/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });
            const data = await response.json();
            if (response.ok) {
                setUser(data);
                setIsAuthenticated(true);
                setToken(data.token); // Set the token in state
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data));
                incrementAuthChangeCounter();
                return true;
            } else {
                setError(data?.message || `Erreur de connexion: ${response.status}`);
                return false;
            }
        } catch (err: any) {
            setError(err.message);
            return false;
        } finally {
            setLoading(false);
        }
    }, [incrementAuthChangeCounter, backendUrl, setToken]); // Include setToken in dependencies

    const signup = useCallback(async (nom: string, prenom: string, email: string, password: string): Promise<boolean> => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${backendUrl}/api/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ nom, prenom, email, password }),
            });
            const data = await response.json();
            if (response.ok) {
                setUser(data);
                setIsAuthenticated(true);
                setToken(data.token); // Set the token in state
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data));
                incrementAuthChangeCounter();
                return true;
            } else {
                setError(data?.message || `Erreur d'inscription: ${response.status}`);
                return false;
            }
        } catch (err: any) {
            setError(err.message);
            return false;
        } finally {
            setLoading(false);
        }
    }, [incrementAuthChangeCounter, backendUrl, setToken]); // Include setToken in dependencies

    const logout = useCallback(() => {
        setUser(null);
        setIsAuthenticated(false);
        setToken(null); // Clear the token from state
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        incrementAuthChangeCounter();
    }, [incrementAuthChangeCounter, setToken]); // Include setToken in dependencies

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');
        if (storedToken && storedUser) {
            try {
                const parsedUser = JSON.parse(storedUser);
                setUser(parsedUser);
                setIsAuthenticated(true);
                setToken(storedToken); // Set token from localStorage on mount
                incrementAuthChangeCounter();
            } catch (error) {
                console.error('Erreur lors de la récupération de l\'utilisateur depuis le localStorage:', error);
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                setToken(null);
                setIsAuthenticated(false);
                setUser(null);
            }
        }
    }, [incrementAuthChangeCounter, setToken]); // Include setToken in dependencies

    return (
        <AuthContext.Provider value={{ user, login, logout, signup, isAuthenticated, loading, error, setUser, setIsAuthenticated, authChangeCounter, incrementAuthChangeCounter, token }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuthContext = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuthContext doit être utilisé à l\'intérieur d\'un AuthProvider');
    }
    return context;
};

export default AuthContext;
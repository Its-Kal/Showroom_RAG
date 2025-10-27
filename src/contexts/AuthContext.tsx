import React, { createContext, useContext, useState, ReactNode } from 'react';
import { jwtDecode } from 'jwt-decode';

// --- TYPE DEFINITIONS ---
interface DecodedToken {
  sub: string;
  role: string;
  exp: number;
}

interface IUser {
  username: string;
  role: string;
}

interface IAuthState {
  user: IUser | null;
  token: string | null;
  isLoading: boolean;
}

interface IAuthContext extends IAuthState {
  login: (token: string) => void;
  logout: () => void;
}

// --- CONTEXT CREATION ---
const AuthContext = createContext<IAuthContext | undefined>(undefined);

// --- AUTH PROVIDER COMPONENT ---
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<IAuthState>({
    user: null,
    token: null,
    isLoading: false, // Set to false initially for debugging
  });

  const login = (token: string) => {
    try {
      const decoded = jwtDecode<DecodedToken>(token);
      sessionStorage.setItem('accessToken', token);
      setState({
        user: { username: decoded.sub, role: decoded.role },
        token: token,
        isLoading: false,
      });
      console.log("AuthContext: User logged in", { username: decoded.sub, role: decoded.role });
    } catch (error) {
      console.error("AuthContext: Failed to decode token on login", error);
    }
  };

  const logout = () => {
    sessionStorage.removeItem('accessToken');
    setState({ user: null, token: null, isLoading: false });
    console.log("AuthContext: User logged out");
  };

  const value: IAuthContext = {
    ...state,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// --- CUSTOM HOOK ---
export const useAuth = (): IAuthContext => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

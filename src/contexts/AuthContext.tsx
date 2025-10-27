import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

// --- TYPE DEFINITIONS ---

// Type for the decoded JWT payload, now including permissions
interface DecodedToken {
  sub: string; 
  role: string;
  permissions: string[]; // Added permissions array
  exp: number;
}

// Type for the user object stored in state
interface IUser {
  username: string;
  role: string;
  permissions: Set<string>; // Use a Set for efficient permission checks (O(1) lookup)
}

// Type for the overall auth state
interface IAuthState {
  user: IUser | null;
  token: string | null;
  isLoading: boolean;
}

// Type for the context value, now with a more specific checkPermission function
interface IAuthContext extends IAuthState {
  login: (token: string) => void;
  logout: () => void;
  checkPermission: (permission: string) => boolean;
}

// --- CONTEXT CREATION ---
const AuthContext = createContext<IAuthContext | undefined>(undefined);

// --- AUTH PROVIDER COMPONENT ---
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<IAuthState>({
    user: null,
    token: null,
    isLoading: true,
  });

  useEffect(() => {
    try {
      const token = sessionStorage.getItem('accessToken');
      if (token) {
        const decoded = jwtDecode<DecodedToken>(token);
        if (decoded.exp * 1000 > Date.now()) {
          setState({
            user: { 
              username: decoded.sub, 
              role: decoded.role, 
              permissions: new Set(decoded.permissions) // Store permissions in a Set
            },
            token: token,
            isLoading: false,
          });
        }
      }
    } catch (error) {
      console.error("Failed to decode token on initial load", error);
    } finally {
      setState(s => ({ ...s, isLoading: false }));
    }
  }, []);

  const login = (token: string) => {
    try {
      const decoded = jwtDecode<DecodedToken>(token);
      sessionStorage.setItem('accessToken', token);
      setState({
        user: { 
          username: decoded.sub, 
          role: decoded.role, 
          permissions: new Set(decoded.permissions) // Store permissions in a Set
        },
        token: token,
        isLoading: false,
      });
    } catch (error) {
      console.error("Failed to decode token on login", error);
    }
  };

  const logout = () => {
    sessionStorage.removeItem('accessToken');
    setState({ user: null, token: null, isLoading: false });
  };

  // The new permission checking function
  const checkPermission = (permission: string): boolean => {
    if (!state.user) return false;
    return state.user.permissions.has(permission);
  };

  const value: IAuthContext = {
    ...state,
    login,
    logout,
    checkPermission,
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

import React, { createContext, useContext, useState, ReactNode } from 'react';

// 1. Interface Definitions
interface IUser {
  email: string;
  // Add other user properties as needed
}

interface IAuthState {
  user: IUser | null;
  permissions: Set<string>;
  isLoading: boolean;
}

interface IAuthContext extends IAuthState {
  checkPermission: (permission: string) => boolean;
  loginMock: () => void; // Dummy login for testing
  logoutMock: () => void; // Dummy logout for testing
}

// 2. AuthContext Creation
const AuthContext = createContext<IAuthContext | undefined>(undefined);

// 3. AuthProvider Component
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, setState] = useState<IAuthState>({
    user: null,
    permissions: new Set(),
    isLoading: true, // Assume loading until a check is made
  });

  // Dummy login function for development and testing
  const loginMock = () => {
    const mockUser: IUser = { email: 'test@example.com' };
    const mockPermissions = new Set(["CAN_VIEW_CARS", "CAN_VIEW_SALES_CHART"]);
    setState({ user: mockUser, permissions: mockPermissions, isLoading: false });
  };

  // Dummy logout function
  const logoutMock = () => {
    setState({ user: null, permissions: new Set(), isLoading: false });
  };

  const checkPermission = (permission: string): boolean => {
    return state.permissions.has(permission);
  };

  // In a real app, you would have a useEffect here to fetch the user
  // e.g., from a 'GET /auth/me' endpoint upon initial load.

  const value: IAuthContext = {
    ...state,
    checkPermission,
    loginMock,
    logoutMock,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// 4. Custom Hook `useAuth`
export const useAuth = (): IAuthContext => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

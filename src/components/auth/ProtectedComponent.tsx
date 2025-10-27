import React from 'react';
import { useAuth } from '../../contexts/AuthContext';

interface ProtectedComponentProps {
  // We expect the required role as a string, e.g., "admin" or "sales"
  requiredRole: string;
  children: React.ReactNode;
}

export const ProtectedComponent: React.FC<ProtectedComponentProps> = ({ requiredRole, children }) => {
  // Get the whole user object from the context
  const { user } = useAuth();

  // Check if the logged-in user's role matches the required role
  const canAccess = user?.role === requiredRole;

  // Render the children only if the user has the correct role
  return canAccess ? <>{children}</> : null;
};

import React from 'react';
import { useAuth } from '../../contexts/AuthContext';

interface ProtectedComponentProps {
  // The prop is now the specific permission string we need
  requiredPermission: string;
  children: React.ReactNode;
}

export const ProtectedComponent: React.FC<ProtectedComponentProps> = ({ requiredPermission, children }) => {
  // Get the permission checking function from our updated context
  const { checkPermission } = useAuth();

  // Check if the logged-in user has the required permission
  const canAccess = checkPermission(requiredPermission);

  // Render the children only if the user has permission
  return canAccess ? <>{children}</> : null;
};

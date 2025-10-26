import React from 'react';
import { useAuth } from '../../contexts/AuthContext';

interface ProtectedComponentProps {
  permission: string;
  children: React.ReactNode;
}

export const ProtectedComponent: React.FC<ProtectedComponentProps> = ({ permission, children }) => {
  const { checkPermission } = useAuth();

  const canAccess = checkPermission(permission);

  return canAccess ? <>{children}</> : null;
};

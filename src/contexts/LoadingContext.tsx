import React, { createContext, useState, useContext, ReactNode, useCallback } from 'react';

interface LoadingContextType {
  isLoading: boolean;
  showLoading: () => void;
  hideLoading: () => void;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export const LoadingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [loadingCount, setLoadingCount] = useState(0);

  const showLoading = useCallback(() => {
    setLoadingCount(prevCount => prevCount + 1);
  }, []);

  const hideLoading = useCallback(() => {
    setLoadingCount(prevCount => Math.max(0, prevCount - 1));
  }, []);

  return (
    <LoadingContext.Provider value={{ isLoading: loadingCount > 0, showLoading, hideLoading }}>
      {children}
    </LoadingContext.Provider>
  );
};

export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (context === undefined) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return context;
};

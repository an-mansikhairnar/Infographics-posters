'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

type LoadingContextType = {
  loading: boolean;
  setLoading: (value: boolean) => void;
};

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export function LoadingProvider({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(false);

  return <LoadingContext.Provider value={{ loading, setLoading }}>{children}</LoadingContext.Provider>;
}

export function useLoading() {
  const context = useContext(LoadingContext);

  if (!context) {
    throw new Error('useLoading must be used inside LoadingProvider');
  }

  return context;
}
export function LoadingSpinner() {
  return (
    <div className='flex items-center justify-center gap-3'>
      <div
        className='w-8 h-8 rounded-full animate-spin'
        style={{
          border: '6px solid transparent',
          borderTopColor: '#171cba',
          borderRightColor: '#e61f1f',
          borderBottomColor: '#FBBC05',
          borderLeftColor: '#34A853',
        }}
      />
      <p className='text-gray-700 text-base'>Loading More Infographics...</p>
    </div>
  );
}

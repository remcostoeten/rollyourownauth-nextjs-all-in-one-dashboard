'use client'

import { ReactNode, useEffect } from 'react';
import { useFontSize } from '@ryoa/hooks';

interface FontSizeProviderProps {
  children: ReactNode;
}

export function FontSizeProvider({ children }: FontSizeProviderProps) {
  const { fontSize } = useFontSize();

  useEffect(() => {
    document.documentElement.style.fontSize = `${fontSize}px`;
    return () => {
      document.documentElement.style.fontSize = '';
    };
  }, [fontSize]);

  return <>{children}</>;
} 
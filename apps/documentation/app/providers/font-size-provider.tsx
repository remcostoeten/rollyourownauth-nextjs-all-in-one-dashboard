'use client'

import { ReactNode, useEffect } from 'react';
import { useFontSize } from '@/app/hooks/use-font-size';

export function FontSizeProvider({ children }: { children: ReactNode }) {
  const { fontSize } = useFontSize();

  useEffect(() => {
    document.documentElement.style.fontSize = `${fontSize}px`;
  }, [fontSize]);

  return children;
} 
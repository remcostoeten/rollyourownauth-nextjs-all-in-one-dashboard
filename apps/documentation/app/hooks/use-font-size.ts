import { useState, useEffect } from 'react';

export function useFontSize() {
  const [fontSize, setFontSize] = useState(16);

  useEffect(() => {
    // Get initial font size from HTML element
    const currentSize = getComputedStyle(document.documentElement).fontSize;
    setFontSize(parseInt(currentSize));
  }, []);

  const increaseFontSize = () => {
    const newSize = fontSize + 1;
    setFontSize(newSize);
  };

  const decreaseFontSize = () => {
    const newSize = fontSize - 1;
    setFontSize(newSize);
  };

  const resetFontSize = () => {
    setFontSize(16);
  };

  return {
    fontSize,
    increaseFontSize,
    decreaseFontSize,
    resetFontSize,
  };
} 
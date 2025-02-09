'use client'

import { useEffect, useState } from 'react'

export function useMountedTheme() {
    const [mounted, setMounted] = useState(false)
    const [theme, setTheme] = useState<'dark' | 'light'>('light')

    useEffect(() => {
        setMounted(true)
        // Check if user prefers dark mode
        const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches
        setTheme(isDark ? 'dark' : 'light')

        // Listen for theme changes
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
        const handler = (e: MediaQueryListEvent) => setTheme(e.matches ? 'dark' : 'light')
        
        mediaQuery.addEventListener('change', handler)
        return () => mediaQuery.removeEventListener('change', handler)
    }, [])

    return { theme, mounted }
} 
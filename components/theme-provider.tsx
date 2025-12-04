"use client"

import * as React from 'react'
import {
  ThemeProvider as NextThemesProvider,
  type ThemeProviderProps,
} from 'next-themes'

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider {...props}>
      <style jsx global>{`
        :root {
          --landing-bg: #fff7ed; /* cream for light mode */
          --violet-primary: #6366f1;
          --violet-secondary: #8b5cf6;
          --indigo-primary: #4f46e5;
          --cyan-primary: #06b6d4;
          --gray-400: #9ca3af;
          --gray-500: #6b7280;
        }
        .dark {
          --landing-bg: #030014; /* deep indigo black for dark mode */
          --violet-primary: #6366f1;
          --violet-secondary: #8b5cf6;
          --indigo-primary: #4f46e5;
          --cyan-primary: #06b6d4;
          --gray-400: #9ca3af;
          --gray-500: #6b7280;
        }
      `}</style>
      {children}
    </NextThemesProvider>
  )
}

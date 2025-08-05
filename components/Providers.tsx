'use client'
import React from 'react'
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { createTheme } from '@mui/material/styles'
import { AuthProvider } from '../contexts/AuthContext'

// MUI 테마 생성
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
  typography: {
    fontFamily: 'var(--font-geist-sans), Arial, sans-serif',
  },
  // SSR 관련 설정 추가
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          scrollbarGutter: 'stable',
        },
      },
    },
  },
})

interface ProvidersProps {
  children: React.ReactNode
}

export default function Providers({ children }: ProvidersProps) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline enableColorScheme />
      <AuthProvider>
        {children}
      </AuthProvider>
    </ThemeProvider>
  )
}

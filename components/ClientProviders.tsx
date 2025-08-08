'use client'
import React from 'react'
import { CacheProvider } from '@emotion/react'
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { createTheme } from '@mui/material/styles'
import { AuthProvider } from '../contexts/AuthContext'
import { getClientSideEmotionCache } from '../lib/emotion'

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
    fontFamily: 'var(--font-inter), Arial, sans-serif',
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

interface ClientProvidersProps {
  children: React.ReactNode
}

export default function ClientProviders({ children }: ClientProvidersProps) {
  const emotionCache = getClientSideEmotionCache()

  return (
    <CacheProvider value={emotionCache}>
      <ThemeProvider theme={theme}>
        <CssBaseline enableColorScheme />
        <AuthProvider>
          {children}
        </AuthProvider>
      </ThemeProvider>
    </CacheProvider>
  )
}

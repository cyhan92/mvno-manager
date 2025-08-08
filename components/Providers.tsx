'use client'
import React from 'react'
import dynamic from 'next/dynamic'
import { createTheme } from '@mui/material/styles'
import { ThemeProvider } from '@mui/material/styles'
import { AuthProvider } from '../contexts/AuthContext'

// 클라이언트 전용 컴포넌트를 dynamic import로 로드
const ClientProviders = dynamic(() => import('./ClientProviders'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="flex flex-col items-center space-y-4 p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <div className="text-lg text-gray-600 font-medium">앱을 초기화하는 중...</div>
      </div>
    </div>
  )
})

// 서버에서 사용할 기본 테마 (MUI 없이)
const basicTheme = createTheme({
  typography: {
    fontFamily: 'var(--font-inter), Arial, sans-serif',
  },
})

interface ProvidersProps {
  children: React.ReactNode
}

export default function Providers({ children }: ProvidersProps) {
  return (
    <ThemeProvider theme={basicTheme}>
      <AuthProvider>
        <ClientProviders>
          {children}
        </ClientProviders>
      </AuthProvider>
    </ThemeProvider>
  )
}

'use client'
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface AuthContextType {
  isAuthenticated: boolean
  login: (username: string, password: string) => boolean
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isMounted, setIsMounted] = useState(false)

  // 고정된 로그인 정보
  const FIXED_USERNAME = 'nable'
  const FIXED_PASSWORD = 'nable123!'

  useEffect(() => {
    // 클라이언트에서만 실행되도록 보장
    setIsMounted(true)
    
    // 로컬 스토리지에서 로그인 상태 확인
    const authStatus = localStorage.getItem('isAuthenticated')
    if (authStatus === 'true') {
      setIsAuthenticated(true)
    }
    setIsLoading(false)
  }, [])

  const login = (username: string, password: string): boolean => {
    if (username === FIXED_USERNAME && password === FIXED_PASSWORD) {
      setIsAuthenticated(true)
      if (typeof window !== 'undefined') {
        localStorage.setItem('isAuthenticated', 'true')
      }
      return true
    }
    return false
  }

  const logout = () => {
    setIsAuthenticated(false)
    if (typeof window !== 'undefined') {
      localStorage.removeItem('isAuthenticated')
    }
  }

  // 하이드레이션 완료 전까지는 로딩 상태 유지
  if (!isMounted) {
    return (
      <AuthContext.Provider value={{ isAuthenticated: false, login, logout, isLoading: true }}>
        {children}
      </AuthContext.Provider>
    )
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

'use client'
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface AuthContextType {
  isAuthenticated: boolean
  userRole: 'user' | 'admin' | null
  currentUser: string | null
  login: (username: string, password: string) => boolean
  logout: () => void
  isLoading: boolean
  isAdmin: () => boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userRole, setUserRole] = useState<'user' | 'admin' | null>(null)
  const [currentUser, setCurrentUser] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isMounted, setIsMounted] = useState(false)

  // 사용자 계정 정보 (역할 포함)
  const USER_ACCOUNTS = [
    { username: 'nable', password: 'nable123!', role: 'user' as const },
    { username: 'admin', password: 'admin0129!', role: 'admin' as const }
  ]

  useEffect(() => {
    // 클라이언트에서만 실행되도록 보장
    setIsMounted(true)
    
    // 로컬 스토리지에서 로그인 상태 확인
    const authStatus = localStorage.getItem('isAuthenticated')
    const savedUser = localStorage.getItem('currentUser')
    const savedRole = localStorage.getItem('userRole') as 'user' | 'admin' | null
    
    if (authStatus === 'true' && savedUser && savedRole) {
      setIsAuthenticated(true)
      setCurrentUser(savedUser)
      setUserRole(savedRole)
    }
    setIsLoading(false)
  }, [])

  const login = (username: string, password: string): boolean => {
    const user = USER_ACCOUNTS.find(acc => acc.username === username && acc.password === password)
    
    if (user) {
      setIsAuthenticated(true)
      setCurrentUser(user.username)
      setUserRole(user.role)
      
      if (typeof window !== 'undefined') {
        localStorage.setItem('isAuthenticated', 'true')
        localStorage.setItem('currentUser', user.username)
        localStorage.setItem('userRole', user.role)
      }
      return true
    }
    return false
  }

  const logout = () => {
    setIsAuthenticated(false)
    setCurrentUser(null)
    setUserRole(null)
    if (typeof window !== 'undefined') {
      localStorage.removeItem('isAuthenticated')
      localStorage.removeItem('currentUser')
      localStorage.removeItem('userRole')
    }
  }

  const isAdmin = (): boolean => {
    return userRole === 'admin'
  }

  // 하이드레이션 완료 전까지는 로딩 상태 유지
  if (!isMounted) {
    return (
      <AuthContext.Provider value={{ 
        isAuthenticated: false, 
        userRole: null,
        currentUser: null,
        login, 
        logout, 
        isLoading: true,
        isAdmin: () => false
      }}>
        {children}
      </AuthContext.Provider>
    )
  }

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      userRole,
      currentUser,
      login, 
      logout, 
      isLoading,
      isAdmin
    }}>
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

'use client'
import React from 'react'
import dynamic from 'next/dynamic'
import Loading from '../components/Loading'
import LoginPage from '../components/LoginPage'
import { useAuth } from '../contexts/AuthContext'

const ClientHome = dynamic(() => import('../components/home/ClientHomeRefactored'), {
  ssr: false,
  loading: () => <Loading />
})

export default function Home() {
  const { isAuthenticated, isLoading } = useAuth()

  // 로딩 중
  if (isLoading) {
    return <Loading />
  }

  // 인증되지 않은 경우 로그인 페이지 표시
  if (!isAuthenticated) {
    return <LoginPage onLoginSuccess={() => {}} />
  }

  // 인증된 경우 메인 페이지 표시
  return <ClientHome />
}

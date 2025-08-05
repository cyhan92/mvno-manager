'use client'
import React, { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import Loading from '../components/Loading'
import LoginPage from '../components/LoginPage'
import { useAuth } from '../contexts/AuthContext'

const ClientHome = dynamic(() => import('../components/ClientHome'), {
  ssr: false,
  loading: () => <Loading />
})

export default function Home() {
  const { isAuthenticated, isLoading } = useAuth()
  const [showMain, setShowMain] = useState(false)

  useEffect(() => {
    if (isAuthenticated) {
      setShowMain(true)
    } else {
      setShowMain(false)
    }
  }, [isAuthenticated])

  const handleLoginSuccess = () => {
    setShowMain(true)
  }

  // 로딩 중
  if (isLoading) {
    return <Loading />
  }

  // 인증되지 않은 경우 로그인 페이지 표시
  if (!isAuthenticated || !showMain) {
    return <LoginPage onLoginSuccess={handleLoginSuccess} />
  }

  // 인증된 경우 메인 페이지 표시
  return <ClientHome />
}

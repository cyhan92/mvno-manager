'use client'
import React from 'react'

interface LoadingProps {
  message?: string
}

const Loading: React.FC<LoadingProps> = ({ message = "데이터를 로딩 중..." }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="flex flex-col items-center space-y-4 p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <div className="text-lg text-gray-600 font-medium">{message}</div>
        <div className="text-sm text-gray-400">잠시만 기다려주세요...</div>
      </div>
    </div>
  )
}

export default Loading

'use client'
import React, { useRef } from 'react'
import { useAuth } from '../contexts/AuthContext'

interface HeaderProps {
  taskCount: number
  onRefresh?: () => Promise<void>
  source: 'database' | 'excel_fallback' | null
}

const Header: React.FC<HeaderProps> = ({ taskCount, onRefresh, source }) => {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { logout } = useAuth()

  const handleLogout = () => {
    const confirmed = window.confirm('로그아웃 하시겠습니까?')
    if (confirmed) {
      logout()
      window.location.reload()
    }
  }

  const handleExcelUpload = async () => {
    if (!fileInputRef.current) return

    const confirmed = window.confirm(
      '⚠️ 경고: Excel 파일을 업로드하면 기존 데이터베이스의 모든 데이터가 삭제되고 Excel 데이터로 교체됩니다.\n\n계속하시겠습니까?'
    )

    if (!confirmed) return

    fileInputRef.current.click()
  }

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await fetch('/api/upload-excel', {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        // 성공 - 별도의 팝업 없이 조용히 처리하고 페이지 새로고침
        console.log('✅ Excel 데이터가 성공적으로 데이터베이스에 저장되었습니다!')
        window.location.reload() // 페이지 새로고침
      } else {
        const error = await response.text()
        alert(`❌ 업로드 실패: ${error}`)
      }
    } catch (error) {
      console.error('Upload error:', error)
      alert('❌ 업로드 중 오류가 발생했습니다.')
    }

    // 파일 입력 초기화
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            📊 스노우모바일 MVNO 프로젝트 관리
          </h1>
          <div className="flex items-center gap-4 mt-1">
            <p className="text-sm text-gray-600">
              전체 작업 수: <span className="font-semibold text-blue-600">{taskCount}</span>
            </p>
            {source && (
              <div className={`text-xs px-2 py-1 rounded-full ${
                source === 'database' 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-yellow-100 text-yellow-700'
              }`}>
                {source === 'database' ? '🗄️ 데이터베이스' : '📄 Excel 파일'}
              </div>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={handleExcelUpload}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors font-medium text-sm"
          >
            📁 Excel → DB
          </button>
          
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors font-medium text-sm"
          >
            🚪 로그아웃
          </button>
        </div>
      </div>

      {/* 숨겨진 파일 입력 */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".xlsx,.xls"
        onChange={handleFileChange}
        className="hidden"
        aria-label="Excel 파일 선택"
      />
    </div>
  )
}

export default Header

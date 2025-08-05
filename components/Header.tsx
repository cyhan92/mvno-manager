import React, { useState } from 'react'

interface HeaderProps {
  taskCount: number
  onRefresh: () => void
  source?: 'database' | 'excel_fallback' | null
}

const Header: React.FC<HeaderProps> = ({
  taskCount,
  onRefresh,
  source
}) => {
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<string>('')

  // 동기화 상태 확인
  const checkSyncStatus = async () => {
    setIsLoading(true)
    setMessage('')

    try {
      const response = await fetch('/api/sync')
      const result = await response.json()

      if (result.success) {
        setMessage(
          result.data.inSync 
            ? '✅ Excel과 DB가 동기화되어 있습니다.'
            : '⚠️ Excel과 DB가 동기화되지 않았습니다.'
        )
      } else {
        setMessage(`❌ 상태 확인 실패: ${result.message}`)
      }
    } catch (error) {
      setMessage(`❌ 상태 확인 중 오류: ${error}`)
    } finally {
      setIsLoading(false)
    }
  }

  // Excel → Database 동기화 실행
  const syncToDatabase = async () => {
    setIsLoading(true)
    setMessage('')

    try {
      const response = await fetch('/api/sync', {
        method: 'POST'
      })
      const result = await response.json()

      if (result.success) {
        setMessage(`✅ ${result.message}`)
        // 동기화 후 데이터 새로고침
        setTimeout(() => {
          onRefresh()
        }, 1000)
      } else {
        setMessage(`❌ 동기화 실패: ${result.message}`)
      }
    } catch (error) {
      setMessage(`❌ 동기화 중 오류: ${error}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              🚀 스노우모바일 MVNO 프로젝트 관리
            </h1>
            <p className="text-gray-600 mt-1">
              총 {taskCount}개 작업 | 
              {source === 'database' && ' 데이터베이스 연동'}
              {source === 'excel_fallback' && ' Excel 파일 (DB 연결 실패)'}
              {!source && ' Excel 파일 기반'}
            </p>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={checkSyncStatus}
              disabled={isLoading}
              className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium transition-colors disabled:opacity-50"
            >
              {isLoading ? '확인 중...' : '🔍 상태 확인'}
            </button>
            <button
              onClick={syncToDatabase}
              disabled={isLoading}
              className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium transition-colors disabled:opacity-50"
            >
              {isLoading ? '동기화 중...' : '🔄 Excel → DB'}
            </button>
            <button
              onClick={onRefresh}
              disabled={isLoading}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 text-sm font-medium transition-colors disabled:opacity-50"
            >
              📄 Excel 새로고침
            </button>
          </div>
        </div>
        
        {/* 메시지 표시 */}
        {message && (
          <div className="mt-3 p-2 rounded-lg bg-gray-50 border">
            <p className="text-sm">{message}</p>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header

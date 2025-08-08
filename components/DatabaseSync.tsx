'use client'
import React, { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'

interface SyncStatus {
  excel: {
    totalRows: number
    validTasks: number
    errors: string[]
  }
  database: {
    totalTasks: number
  }
  inSync: boolean
}

const DatabaseSyncComponent: React.FC = () => {
  const { isAdmin } = useAuth()
  const [syncStatus, setSyncStatus] = useState<SyncStatus | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<string>('')

  // 관리자가 아닌 경우 컴포넌트를 렌더링하지 않음
  if (!isAdmin()) {
    return null
  }

  // 동기화 상태 확인
  const checkSyncStatus = async () => {
    setIsLoading(true)
    setMessage('')

    try {
      const response = await fetch('/api/sync')
      const result = await response.json()

      if (result.success) {
        setSyncStatus(result.data)
        setMessage(
          result.data.inSync 
            ? '✅ Excel 파일과 데이터베이스가 동기화되어 있습니다.'
            : '⚠️ Excel 파일과 데이터베이스가 동기화되지 않았습니다.'
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
        await checkSyncStatus() // 동기화 후 상태 재확인
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
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          🔄 데이터베이스 동기화
        </h3>
        <div className="flex gap-2">
          <button
            onClick={checkSyncStatus}
            disabled={isLoading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {isLoading ? '확인 중...' : '상태 확인'}
          </button>
          <button
            onClick={syncToDatabase}
            disabled={isLoading}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
          >
            {isLoading ? '동기화 중...' : 'Excel → DB 동기화'}
          </button>
        </div>
      </div>

      {/* 메시지 표시 */}
      {message && (
        <div className="mb-4 p-3 rounded-lg bg-gray-50 border">
          <p className="text-sm">{message}</p>
        </div>
      )}

      {/* 동기화 상태 표시 */}
      {syncStatus && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Excel 파일 상태 */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-blue-900 mb-2">📄 Excel 파일</h4>
            <div className="space-y-1 text-sm text-blue-700">
              <p>전체 행: {syncStatus.excel.totalRows}</p>
              <p>유효 작업: {syncStatus.excel.validTasks}</p>
              {syncStatus.excel.errors.length > 0 && (
                <p className="text-red-600">
                  오류: {syncStatus.excel.errors.length}개
                </p>
              )}
            </div>
          </div>

          {/* 데이터베이스 상태 */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h4 className="font-semibold text-green-900 mb-2">🗄️ 데이터베이스</h4>
            <div className="space-y-1 text-sm text-green-700">
              <p>저장된 작업: {syncStatus.database.totalTasks}</p>
            </div>
          </div>

          {/* 동기화 상태 */}
          <div className={`border rounded-lg p-4 ${
            syncStatus.inSync 
              ? 'bg-green-50 border-green-200' 
              : 'bg-yellow-50 border-yellow-200'
          }`}>
            <h4 className={`font-semibold mb-2 ${
              syncStatus.inSync ? 'text-green-900' : 'text-yellow-900'
            }`}>
              🔄 동기화 상태
            </h4>
            <div className={`space-y-1 text-sm ${
              syncStatus.inSync ? 'text-green-700' : 'text-yellow-700'
            }`}>
              <p>
                {syncStatus.inSync ? '✅ 동기화됨' : '⚠️ 동기화 필요'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 에러 목록 */}
      {syncStatus && syncStatus.excel.errors.length > 0 && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <h4 className="font-semibold text-red-900 mb-2">⚠️ Excel 파싱 오류</h4>
          <ul className="text-sm text-red-700 space-y-1">
            {syncStatus.excel.errors.map((error, index) => (
              <li key={index}>• {error}</li>
            ))}
          </ul>
        </div>
      )}

      {/* 사용 가이드 */}
      <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
        <h4 className="font-semibold text-gray-900 mb-2">📖 사용 가이드</h4>
        <div className="text-sm text-gray-700 space-y-1">
          <p>1. <strong>상태 확인</strong>: Excel 파일과 데이터베이스의 현재 상태를 확인합니다.</p>
          <p>2. <strong>Excel → DB 동기화</strong>: Excel 파일의 데이터를 데이터베이스에 저장합니다.</p>
          <p>3. Excel 파일을 수정한 후에는 반드시 동기화를 실행해주세요.</p>
          <p>4. 동기화 시 기존 데이터베이스 내용은 모두 삭제되고 Excel 데이터로 교체됩니다.</p>
        </div>
      </div>
    </div>
  )
}

export default DatabaseSyncComponent

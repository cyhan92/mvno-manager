import React, { useState } from 'react'
import { Task } from '../../types/task'

interface DeleteConfirmationPopupProps {
  task: Task
  isOpen: boolean
  onClose: () => void
  onConfirm: (password: string) => void
  isLoading: boolean
}

const DeleteConfirmationPopup: React.FC<DeleteConfirmationPopupProps> = ({
  task,
  isOpen,
  onClose,
  onConfirm,
  isLoading
}) => {
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!password.trim()) {
      alert('비밀번호를 입력해주세요.')
      return
    }
    onConfirm(password)
  }

  const handleClose = () => {
    setPassword('')
    setShowPassword(false)
    onClose()
  }

  if (!isOpen) return null

  return (
    <>
      {/* 배경 오버레이 */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-[9999] flex items-center justify-center"
        onClick={handleClose}
      >
        {/* 팝업 내용 */}
        <div 
          className="bg-white rounded-lg shadow-xl border-2 border-red-200 max-w-md w-full mx-4"
          onClick={(e) => e.stopPropagation()}
        >
          <form onSubmit={handleSubmit} className="p-6">
            {/* 헤더 */}
            <div className="flex items-center mb-4">
              <div className="text-red-500 text-2xl mr-3">⚠️</div>
              <h3 className="text-lg font-semibold text-red-800">
                Action Item 삭제 확인
              </h3>
            </div>

            {/* 경고 메시지 */}
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-800 font-medium mb-2">
                🚨 중요: 이 작업은 되돌릴 수 없습니다!
              </p>
              <ul className="text-sm text-red-700 space-y-1">
                <li>• 선택된 작업이 데이터베이스에서 영구적으로 삭제됩니다.</li>
                <li>• 삭제된 데이터는 복구할 수 없습니다.</li>
                <li>• 연관된 모든 정보도 함께 삭제됩니다.</li>
              </ul>
            </div>

            {/* 삭제할 작업 정보 */}
            <div className="mb-6 p-3 bg-gray-50 border rounded-lg">
              <p className="text-sm font-medium text-gray-700 mb-2">삭제할 작업:</p>
              <p className="text-sm text-gray-900 font-semibold">{task.name}</p>
              {task.detail && task.detail !== task.name && (
                <p className="text-xs text-gray-600 mt-1">{task.detail}</p>
              )}
              <div className="flex gap-4 mt-2 text-xs text-gray-600">
                <span>담당자: {task.resource || '미정'}</span>
                <span>진행률: {task.percentComplete || 0}%</span>
              </div>
            </div>

            {/* 비밀번호 입력 */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                현재 로그인 계정의 비밀번호를 입력해주세요:
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  placeholder="비밀번호 입력"
                  disabled={isLoading}
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  disabled={isLoading}
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            {/* 버튼들 */}
            <div className="flex gap-3 justify-end">
              <button
                type="button"
                onClick={handleClose}
                disabled={isLoading}
                className="px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                취소
              </button>
              <button
                type="submit"
                disabled={isLoading || !password.trim()}
                className="px-4 py-2 text-sm bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? '삭제 중...' : '🗑️ 삭제 확인'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}

export default DeleteConfirmationPopup

'use client'
import React, { useState, useEffect } from 'react'
import { Task } from '../../types/task'

interface MoveMajorCategoryPopupProps {
  isOpen: boolean
  task: Task | null
  tasks: Task[]
  onClose: () => void
  onMove: (targetMajorCategory: string) => Promise<void>
}

const MoveMajorCategoryPopup: React.FC<MoveMajorCategoryPopupProps> = ({
  isOpen,
  task,
  tasks,
  onClose,
  onMove
}) => {
  const [selectedMajorCategory, setSelectedMajorCategory] = useState<string>('')

  // 사용 가능한 대분류 목록 생성
  const availableMajorCategories = React.useMemo(() => {
    const majorCategories = new Set<string>()
    
    tasks.forEach(t => {
      if (t.level === 0 && t.majorCategory) {
        majorCategories.add(t.majorCategory)
      }
    })
    
    // 현재 선택된 소분류의 대분류는 제외
    if (task?.majorCategory) {
      majorCategories.delete(task.majorCategory)
    }
    
    return Array.from(majorCategories).sort()
  }, [tasks, task?.majorCategory])

  // 팝업이 열릴 때 첫 번째 대분류를 기본 선택
  useEffect(() => {
    if (isOpen && availableMajorCategories.length > 0) {
      setSelectedMajorCategory(availableMajorCategories[0])
    }
  }, [isOpen, availableMajorCategories])

  const handleMove = async () => {
    if (selectedMajorCategory) {
      try {
        await onMove(selectedMajorCategory)
        // 성공 시에만 팝업을 닫음
        onClose()
      } catch (error) {
        // 실패 시에는 팝업을 닫지 않음 (오류 처리는 상위 컴포넌트에서)
        console.error('대분류 이동 실패:', error)
      }
    }
  }

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  const handleEscapeKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose()
    }
  }

  if (!isOpen || !task) return null

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={handleBackdropClick}
      onKeyDown={handleEscapeKey}
      tabIndex={-1}
    >
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            🔄 대분류 이동
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-2">
            현재 소분류: <span className="font-medium text-gray-800">{task.minorCategory}</span>
          </p>
          <p className="text-sm text-gray-600 mb-4">
            현재 대분류: <span className="font-medium text-gray-800">{task.majorCategory}</span>
          </p>
        </div>

        {availableMajorCategories.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">이동할 수 있는 다른 대분류가 없습니다.</p>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                이동할 대분류 선택
              </label>
              <select
                value={selectedMajorCategory}
                onChange={(e) => setSelectedMajorCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">대분류를 선택하세요</option>
                {availableMajorCategories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
              <p className="text-sm text-yellow-800">
                <strong>⚠️ 주의:</strong> 이 작업은 선택된 소분류의 모든 하위 업무들의 대분류를 변경합니다.
              </p>
            </div>

            <div className="flex gap-3 justify-end">
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
              >
                취소
              </button>
              <button
                onClick={handleMove}
                disabled={!selectedMajorCategory}
                className="px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                이동
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default MoveMajorCategoryPopup

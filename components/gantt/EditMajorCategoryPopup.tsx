import React, { useState, useEffect, useRef } from 'react'
import { Task } from '../../types/task'
import { usePopupPosition } from '../../hooks/popup/usePopupPosition'
import { useDragHandler } from '../../hooks/popup/useDragHandler'

interface EditMajorCategoryPopupProps {
  isOpen: boolean
  position: { x: number; y: number }
  task: Task
  onClose: () => void
  onSave: (oldCategory: string, newCategory: string) => Promise<void>
}

const EditMajorCategoryPopup: React.FC<EditMajorCategoryPopupProps> = ({
  isOpen,
  position,
  task,
  onClose,
  onSave
}) => {
  const [newCategory, setNewCategory] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const popupRef = useRef<HTMLDivElement>(null)

  // 커스텀 훅들 사용
  const { currentPosition, updatePosition } = usePopupPosition({
    initialPosition: position,
    popupRef
  })

  const { handleMouseDown } = useDragHandler({
    onPositionChange: updatePosition
  })

  // 팝업이 열릴 때 초기값 설정
  useEffect(() => {
    if (isOpen && task.majorCategory) {
      setNewCategory(task.majorCategory)
    }
  }, [isOpen, task.majorCategory])

  // ESC 키로 닫기
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
      return () => document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose])

  // 폼 제출 처리
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    console.log(`🎯 EditMajorCategoryPopup: 폼 제출 시작`)
    console.log(`📋 현재 작업:`, task)
    console.log(`📝 새 카테고리:`, newCategory.trim())
    
    if (!newCategory.trim()) {
      alert('대분류를 입력해주세요.')
      return
    }

    if (newCategory.trim() === task.majorCategory) {
      alert('기존 대분류와 동일합니다.')
      return
    }

    setIsLoading(true)
    try {
      console.log(`🚀 onSave 함수 호출: "${task.majorCategory}" → "${newCategory.trim()}"`)
      await onSave(task.majorCategory || '', newCategory.trim())
      console.log(`✅ onSave 완료`)
      // 성공 - 별도의 팝업 없이 조용히 처리
      onClose()
    } catch (error) {
      console.error('❌ 대분류 수정 실패:', error)
      alert(`대분류 수정에 실패했습니다: ${error instanceof Error ? error.message : '알 수 없는 오류'}`)
    } finally {
      setIsLoading(false)
    }
  }

  // 취소 처리
  const handleCancel = () => {
    setNewCategory(task.majorCategory || '')
    onClose()
  }

  if (!isOpen) return null

  return (
    <>
      {/* 배경 오버레이 */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-30 z-40"
        onClick={onClose}
      />
      
      {/* 팝업 */}
      <div 
        ref={popupRef}
        className="fixed bg-white rounded-lg shadow-xl border-2 border-blue-200 z-50 max-w-md w-full"
        style={{
          left: currentPosition.x + 'px',
          top: currentPosition.y + 'px',
        }}
      >
        <form onSubmit={handleSubmit} className="p-6">
          {/* 드래그 가능한 헤더 */}
          <div 
            className="flex justify-between items-center mb-4 cursor-move"
            onMouseDown={handleMouseDown}
          >
            <h3 className="text-lg font-semibold text-blue-800 pointer-events-none">
              ✏️ 대분류 수정
            </h3>
            <button
              type="button"
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-xl font-bold pointer-events-auto"
              aria-label="닫기"
            >
              ×
            </button>
          </div>

          {/* 안내 메시지 */}
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800 font-medium mb-1">
              🔄 대분류 수정 안내
            </p>
            <p className="text-sm text-blue-700">
              현재 대분류: <strong>{task.majorCategory}</strong>
            </p>
            <p className="text-xs text-blue-600 mt-1">
              ⚠️ 대분류를 수정하면 하위 모든 상세업무의 대분류가 함께 변경됩니다.
            </p>
          </div>

          {/* 입력 필드 */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              새 대분류명 *
            </label>
            <input
              type="text"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="새로운 대분류명을 입력하세요"
              required
              autoFocus
            />
          </div>

          {/* 버튼 */}
          <div className="flex gap-3 justify-end">
            <button
              type="button"
              onClick={handleCancel}
              disabled={isLoading}
              className="px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={isLoading || !newCategory.trim()}
              className="px-4 py-2 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? '수정 중...' : '✏️ 수정'}
            </button>
          </div>
        </form>
      </div>
    </>
  )
}

export default EditMajorCategoryPopup

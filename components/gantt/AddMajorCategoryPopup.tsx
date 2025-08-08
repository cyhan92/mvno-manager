import React, { useState, useEffect, useRef } from 'react'
import { Task } from '../../types/task'

interface AddMajorCategoryPopupProps {
  isOpen: boolean
  onClose: () => void
  onAdd: (majorCategory: string) => Promise<void>
}

const AddMajorCategoryPopup: React.FC<AddMajorCategoryPopupProps> = ({
  isOpen,
  onClose,
  onAdd
}) => {
  const [majorCategory, setMajorCategory] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  // 팝업이 열릴 때 입력 필드에 포커스
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!majorCategory.trim()) {
      alert('대분류명을 입력해주세요.')
      return
    }

    setIsLoading(true)
    try {
      await onAdd(majorCategory.trim())
      setMajorCategory('')
      onClose()
    } catch (error) {
      console.error('대분류 추가 실패:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    setMajorCategory('')
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-96 max-w-md mx-4">
        <h2 className="text-xl font-bold mb-4 text-gray-800">대분류 추가</h2>
        
        {/* 가이드 메시지 */}
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800 font-medium mb-2">📋 대분류 생성 가이드</p>
          <p className="text-xs text-blue-700">
            대분류명 앞에 다음 구분자를 추가해주세요:<br/>
            <span className="font-mono bg-blue-100 px-1 rounded">
              A: 재무&정산, B: 사업&기획, C: 고객관련, D: 개발&연동, O: Beta오픈, S: 정보보안&법무
            </span>
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="majorCategory" className="block text-sm font-medium text-gray-700 mb-2">
              대분류명 *
            </label>
            <input
              ref={inputRef}
              id="majorCategory"
              type="text"
              value={majorCategory}
              onChange={(e) => setMajorCategory(e.target.value)}
              placeholder="예: A: 재무시스템 구축"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isLoading}
            />
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
              disabled={isLoading}
            >
              취소
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
              disabled={isLoading || !majorCategory.trim()}
            >
              {isLoading ? '추가 중...' : '추가'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddMajorCategoryPopup

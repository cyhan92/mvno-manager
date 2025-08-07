import React, { useRef, useEffect } from 'react'
import { Task } from '../../types/task'
import { usePopupPosition } from '../../hooks/popup/usePopupPosition'
import { useAddActionForm } from '../../hooks/popup/useAddActionForm'

// 필드 컴포넌트들 import
import TextInputField from './popup/fields/TextInputField'
import CategoryFields from './popup/fields/CategoryFields'
import DateRangeFields from './popup/fields/DateRangeFields'
import ResourceFields from './popup/fields/ResourceFields'
import ProgressSliderField from './popup/fields/ProgressSliderField'

interface AddActionItemPopupProps {
  isOpen: boolean
  position: { x: number; y: number }
  parentTask: Task
  onClose: () => void
  onAdd: (newTask: Partial<Task>) => void
}

const AddActionItemPopupModular: React.FC<AddActionItemPopupProps> = ({
  isOpen,
  position,
  parentTask,
  onClose,
  onAdd
}) => {
  const popupRef = useRef<HTMLDivElement>(null)

  // 커스텀 훅들 사용
  const { currentPosition } = usePopupPosition({
    initialPosition: position,
    popupRef
  })

  const {
    formData,
    updateField,
    validateForm,
    createNewTask,
    resetForm
  } = useAddActionForm({ parentTask })

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
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const errorMessage = validateForm()
    if (errorMessage) {
      alert(errorMessage)
      return
    }

    const newTask = createNewTask()
    onAdd(newTask)
    resetForm()
    onClose()
  }

  // 취소 처리
  const handleCancel = () => {
    resetForm()
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
        className="fixed bg-white rounded-lg shadow-xl border-2 border-gray-200 z-50 max-w-lg w-full"
        style={{
          transform: `translate(${currentPosition.x}px, ${currentPosition.y}px)`
        }}
      >
        <form onSubmit={handleSubmit} className="p-6">
          {/* 헤더 */}
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              ➕ Action Item 추가
            </h3>
            <button
              type="button"
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-xl font-bold"
              aria-label="닫기"
            >
              ×
            </button>
          </div>

          {/* 폼 필드 */}
          <div className="space-y-4">
            {/* 카테고리 필드들 */}
            <CategoryFields
              majorCategory={formData.majorCategory}
              middleCategory={formData.middleCategory}
              minorCategory={formData.minorCategory}
              onMajorChange={(value) => updateField('majorCategory', value)}
              onMiddleChange={(value) => updateField('middleCategory', value)}
              onMinorChange={(value) => updateField('minorCategory', value)}
            />

            {/* 세부업무명 */}
            <TextInputField
              label="세부업무명"
              value={formData.taskName}
              onChange={(value) => updateField('taskName', value)}
              placeholder="세부업무명을 입력하세요"
              required
            />

            {/* 날짜 필드들 */}
            <DateRangeFields
              startDate={formData.startDate}
              endDate={formData.endDate}
              onStartDateChange={(value) => updateField('startDate', value)}
              onEndDateChange={(value) => updateField('endDate', value)}
            />

            {/* 담당자 및 부서 */}
            <ResourceFields
              resource={formData.resource}
              department={formData.department}
              onResourceChange={(value) => updateField('resource', value)}
              onDepartmentChange={(value) => updateField('department', value)}
            />

            {/* 진행률 */}
            <ProgressSliderField
              label="진행률"
              value={formData.percentComplete}
              onChange={(value) => updateField('percentComplete', value)}
            />
          </div>

          {/* 버튼 */}
          <div className="flex gap-3 justify-end mt-6 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              취소
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
            >
              ➕ 추가
            </button>
          </div>
        </form>
      </div>
    </>
  )
}

export default AddActionItemPopupModular

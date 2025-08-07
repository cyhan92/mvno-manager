import React, { useEffect, useRef } from 'react'
import { Task } from '../../types/task'
import { usePopupPosition } from '../../hooks/popup/usePopupPosition'
import { useActionItemForm } from '../../hooks/forms/useActionItemForm'
import ActionItemPopupHeader from './actionItem/ActionItemPopupHeader'
import ActionItemForm from './actionItem/ActionItemForm'

interface AddActionItemPopupProps {
  isOpen: boolean
  position: { x: number; y: number }
  parentTask: Task // 소분류 작업 (우클릭된 작업)
  onClose: () => void
  onAdd: (newTask: Partial<Task>) => void
}

const AddActionItemPopupRefactored: React.FC<AddActionItemPopupProps> = ({
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
    updateFormData,
    handleSubmit
  } = useActionItemForm({
    parentTask,
    onAdd,
    onClose
  })

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
          left: currentPosition.x + 'px',
          top: currentPosition.y + 'px',
        }}
      >
        {/* 헤더 */}
        <ActionItemPopupHeader
          parentTask={parentTask}
          onClose={onClose}
        />

        {/* 폼 */}
        <div className="p-4">
          <ActionItemForm
            formData={formData}
            onFieldChange={updateFormData}
            onSubmit={handleSubmit}
            onCancel={onClose}
          />
        </div>
      </div>
    </>
  )
}

export default AddActionItemPopupRefactored

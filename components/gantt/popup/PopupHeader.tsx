import React from 'react'
import { Task } from '../../../types/task'
import styles from '../../../styles/task-detail-popup.module.css'

interface PopupHeaderProps {
  task: Task
  isEditing: boolean
  onEdit: () => void
  onDelete: () => void
  onClose: () => void
  onMouseDown: (e: React.MouseEvent<HTMLDivElement>) => void
}

const PopupHeader: React.FC<PopupHeaderProps> = ({
  task,
  isEditing,
  onEdit,
  onDelete,
  onClose,
  onMouseDown
}) => {
  const isEditableTask = task.level === 2 || (!task.isGroup && !task.hasChildren)

  return (
    <div 
      className={`${styles.dragHandle} flex justify-between items-center mb-4 p-2 -m-2 rounded-t cursor-move`}
      onMouseDown={onMouseDown}
      data-draggable
    >
      <h3 className="text-lg font-semibold text-gray-900 pointer-events-none">
        📋 작업 상세 정보 {isEditing && '(편집 모드)'}
      </h3>
      <div className="flex gap-2 pointer-events-auto">
        {!isEditing && isEditableTask && (
          <>
            <button
              onClick={onEdit}
              className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              ✏️ 편집
            </button>
            <button
              onClick={onDelete}
              className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
            >
              🗑️ 삭제
            </button>
          </>
        )}
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 text-xl font-bold"
          aria-label="닫기"
        >
          ×
        </button>
      </div>
    </div>
  )
}

export default PopupHeader

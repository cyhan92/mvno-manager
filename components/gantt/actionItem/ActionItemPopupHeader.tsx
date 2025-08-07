import React from 'react'
import { Task } from '../../../types/task'

interface ActionItemPopupHeaderProps {
  parentTask: Task
  onClose: () => void
}

const ActionItemPopupHeader: React.FC<ActionItemPopupHeaderProps> = ({
  parentTask,
  onClose
}) => {
  return (
    <div className="flex justify-between items-center p-4 border-b border-gray-200 bg-blue-50 rounded-t-lg">
      <div>
        <h3 className="text-lg font-semibold text-gray-900">
          ➕ 세부업무 추가
        </h3>
        <p className="text-sm text-gray-600 mt-1">
          {parentTask.name}에 새로운 세부업무를 추가합니다
        </p>
      </div>
      <button
        onClick={onClose}
        className="text-gray-400 hover:text-gray-600 text-xl font-bold p-1 rounded hover:bg-gray-200 transition-colors"
        aria-label="닫기"
      >
        ×
      </button>
    </div>
  )
}

export default ActionItemPopupHeader

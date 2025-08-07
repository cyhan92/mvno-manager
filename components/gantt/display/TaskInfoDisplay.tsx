import React from 'react'
import { Task } from '../../../types/task'

interface TaskInfoDisplayProps {
  task: Task
  onEdit: () => void
  onDelete: () => void
}

export const TaskInfoDisplay: React.FC<TaskInfoDisplayProps> = ({
  task,
  onEdit,
  onDelete
}) => {
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    })
  }

  const getProgressColor = (progress: number) => {
    if (progress >= 100) return 'bg-green-500'
    if (progress >= 75) return 'bg-blue-500'
    if (progress >= 50) return 'bg-yellow-500'
    if (progress >= 25) return 'bg-orange-500'
    return 'bg-red-500'
  }

  const getProgressTextColor = (progress: number) => {
    if (progress >= 100) return 'text-green-600'
    if (progress >= 75) return 'text-blue-600'
    if (progress >= 50) return 'text-yellow-600'
    if (progress >= 25) return 'text-orange-600'
    return 'text-red-600'
  }

  return (
    <div>
      <div className="space-y-3">
        <div>
          <span className="text-sm font-medium text-gray-700">작업명:</span>
          <p className="mt-1 text-gray-900 font-medium">{task.name}</p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <span className="text-sm font-medium text-gray-700">시작일:</span>
            <p className="mt-1 text-gray-900">{formatDate(task.start)}</p>
          </div>
          <div>
            <span className="text-sm font-medium text-gray-700">종료일:</span>
            <p className="mt-1 text-gray-900">{formatDate(task.end)}</p>
          </div>
        </div>

        <div>
          <span className="text-sm font-medium text-gray-700">진행률:</span>
          <div className="mt-2">
            <div className="flex items-center justify-between mb-1">
              <span className={`text-sm font-medium ${getProgressTextColor(task.percentComplete || 0)}`}>
                {task.percentComplete || 0}% 완료
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(task.percentComplete || 0)}`}
                style={{ width: `${task.percentComplete || 0}%` }}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <span className="text-sm font-medium text-gray-700">담당자:</span>
            <p className="mt-1 text-gray-900">{task.resource || '미지정'}</p>
          </div>
          <div>
            <span className="text-sm font-medium text-gray-700">부서:</span>
            <p className="mt-1 text-gray-900">{task.department || '미지정'}</p>
          </div>
        </div>

        {task.majorCategory && (
          <div>
            <span className="text-sm font-medium text-gray-700">대분류:</span>
            <p className="mt-1 text-gray-900">{task.majorCategory}</p>
          </div>
        )}

        {task.minorCategory && (
          <div>
            <span className="text-sm font-medium text-gray-700">소분류:</span>
            <p className="mt-1 text-gray-900">{task.minorCategory}</p>
          </div>
        )}
      </div>

      <div className="flex space-x-2 mt-4">
        <button
          onClick={onEdit}
          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          수정
        </button>
        <button
          onClick={onDelete}
          className="flex-1 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
        >
          삭제
        </button>
      </div>
    </div>
  )
}

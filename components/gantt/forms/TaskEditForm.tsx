import React from 'react'
import { Task } from '../../../types/task'

interface TaskEditFormProps {
  editData: {
    startDate: string
    endDate: string
    percentComplete: number
    resource: string
    department: string
  }
  onEditDataChange: (field: string, value: string | number) => void
  onSave: () => void
  onCancel: () => void
  isLoading: boolean
}

export const TaskEditForm: React.FC<TaskEditFormProps> = ({
  editData,
  onEditDataChange,
  onSave,
  onCancel,
  isLoading
}) => {
  return (
    <div>
      <div className="space-y-3">
        <div>
          <label className="text-sm font-medium text-gray-700 block mb-1">시작일</label>
          <input
            type="date"
            value={editData.startDate}
            onChange={(e) => onEditDataChange('startDate', e.target.value)}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700 block mb-1">종료일</label>
          <input
            type="date"
            value={editData.endDate}
            onChange={(e) => onEditDataChange('endDate', e.target.value)}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700 block mb-1">
            진행률: {editData.percentComplete}%
          </label>
          <input
            type="range"
            min="0"
            max="100"
            step="5"
            value={editData.percentComplete}
            onChange={(e) => onEditDataChange('percentComplete', Number(e.target.value))}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>0%</span>
            <span>50%</span>
            <span>100%</span>
          </div>
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700 block mb-1">담당자</label>
          <input
            type="text"
            value={editData.resource}
            onChange={(e) => onEditDataChange('resource', e.target.value)}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="담당자명을 입력하세요"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700 block mb-1">부서</label>
          <input
            type="text"
            value={editData.department}
            onChange={(e) => onEditDataChange('department', e.target.value)}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="부서명을 입력하세요"
          />
        </div>
      </div>

      <div className="flex space-x-2 mt-4">
        <button
          onClick={onSave}
          disabled={isLoading}
          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? '저장 중...' : '저장'}
        </button>
        <button
          onClick={onCancel}
          disabled={isLoading}
          className="flex-1 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 disabled:opacity-50"
        >
          취소
        </button>
      </div>
    </div>
  )
}

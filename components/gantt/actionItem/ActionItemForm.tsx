import React from 'react'

interface FormData {
  majorCategory: string
  middleCategory: string
  minorCategory: string
  taskName: string
  startDate: string
  endDate: string
  resource: string
  department: string
  percentComplete: number
}

interface ActionItemFormProps {
  formData: FormData
  onFieldChange: (field: keyof FormData, value: string | number) => void
  onSubmit: (e: React.FormEvent) => void
  onCancel: () => void
}

const ActionItemForm: React.FC<ActionItemFormProps> = ({
  formData,
  onFieldChange,
  onSubmit,
  onCancel
}) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {/* 카테고리 정보 (읽기 전용) */}
      <div className="bg-gray-50 p-3 rounded-md">
        <div className="text-sm text-gray-600 mb-1">카테고리 정보</div>
        <div className="text-sm font-medium text-gray-800">
          {formData.majorCategory} → {formData.middleCategory} → {formData.minorCategory}
        </div>
      </div>

      {/* 세부업무명 */}
      <div>
        <label htmlFor="taskName" className="block text-sm font-medium text-gray-700 mb-1">
          세부업무명 *
        </label>
        <input
          type="text"
          id="taskName"
          value={formData.taskName}
          onChange={(e) => onFieldChange('taskName', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="세부업무명을 입력하세요"
          required
        />
      </div>

      {/* 날짜 */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
            시작일 *
          </label>
          <input
            type="date"
            id="startDate"
            value={formData.startDate}
            onChange={(e) => onFieldChange('startDate', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
            종료일 *
          </label>
          <input
            type="date"
            id="endDate"
            value={formData.endDate}
            onChange={(e) => onFieldChange('endDate', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
      </div>

      {/* 담당자 및 부서 */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="resource" className="block text-sm font-medium text-gray-700 mb-1">
            담당자
          </label>
          <input
            type="text"
            id="resource"
            value={formData.resource}
            onChange={(e) => onFieldChange('resource', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="담당자명"
          />
        </div>
        <div>
          <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-1">
            부서
          </label>
          <input
            type="text"
            id="department"
            value={formData.department}
            onChange={(e) => onFieldChange('department', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="부서명"
          />
        </div>
      </div>

      {/* 진행률 */}
      <div>
        <label htmlFor="percentComplete" className="block text-sm font-medium text-gray-700 mb-1">
          진행률: {formData.percentComplete}%
        </label>
        <input
          type="range"
          id="percentComplete"
          min="0"
          max="100"
          value={formData.percentComplete}
          onChange={(e) => onFieldChange('percentComplete', parseInt(e.target.value))}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>0%</span>
          <span>50%</span>
          <span>100%</span>
        </div>
      </div>

      {/* 버튼 */}
      <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
        >
          취소
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
        >
          ✅ 추가
        </button>
      </div>
    </form>
  )
}

export default ActionItemForm

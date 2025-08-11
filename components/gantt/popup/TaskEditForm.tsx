import React from 'react'
import CategoryEditor from './fields/CategoryEditor'

interface TaskEditData {
  name: string
  startDate: string
  endDate: string
  percentComplete: number
  resource: string
  department: string
  majorCategory: string
  middleCategory: string
  minorCategory: string
  detail: string
}

interface TaskEditFormProps {
  editData: TaskEditData
  onEditDataChange: (data: TaskEditData) => void
  onSave: () => void
  onCancel: () => void
  isLoading: boolean
}

const TaskEditForm: React.FC<TaskEditFormProps> = ({
  editData,
  onEditDataChange,
  onSave,
  onCancel,
  isLoading
}) => {
  const handleFieldChange = (field: keyof TaskEditData, value: string | number) => {
    onEditDataChange({
      ...editData,
      [field]: value
    })
  }

  return (
    <div className="space-y-3">
      {/* 세부업무명 */}
      <div>
        <label className="text-sm font-medium text-gray-600">세부업무명</label>
        <input
          type="text"
          value={editData.name}
          onChange={(e) => handleFieldChange('name', e.target.value)}
          className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="세부업무명을 입력하세요"
          title="세부업무명을 입력하세요"
        />
      </div>
      
      {/* 카테고리 편집 */}
      <CategoryEditor
        majorCategory={editData.majorCategory}
        middleCategory={editData.middleCategory}
        minorCategory={editData.minorCategory}
        onMajorChange={(value) => handleFieldChange('majorCategory', value)}
        onMiddleChange={(value) => handleFieldChange('middleCategory', value)}
        onMinorChange={(value) => handleFieldChange('minorCategory', value)}
      />
      
      {/* 날짜 필드들 */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-gray-600">시작일</label>
          <input
            type="date"
            value={editData.startDate}
            onChange={(e) => handleFieldChange('startDate', e.target.value)}
            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            title="시작일을 선택하세요"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-600">종료일</label>
          <input
            type="date"
            value={editData.endDate}
            onChange={(e) => handleFieldChange('endDate', e.target.value)}
            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            title="종료일을 선택하세요"
          />
        </div>
      </div>
      
      <div>
        <label className="text-sm font-medium text-gray-600">진행률</label>
        <div className="mt-1">
          <input
            type="range"
            min="0"
            max="100"
            value={editData.percentComplete}
            onChange={(e) => handleFieldChange('percentComplete', parseInt(e.target.value))}
            className="w-full"
            title="진행률을 조정하세요"
          />
          <div className="flex justify-between text-xs text-gray-600 mt-1">
            <span>0%</span>
            <span className="font-medium text-gray-800">{editData.percentComplete}%</span>
            <span>100%</span>
          </div>
        </div>
      </div>
      
      <div>
        <label className="text-sm font-medium text-gray-600">담당자</label>
        <input
          type="text"
          value={editData.resource}
          onChange={(e) => handleFieldChange('resource', e.target.value)}
          className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="담당자명을 입력하세요"
          title="담당자명을 입력하세요"
        />
      </div>

      <div>
        <label className="text-sm font-medium text-gray-600">부서</label>
        <input
          type="text"
          value={editData.department}
          onChange={(e) => handleFieldChange('department', e.target.value)}
          className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="부서명을 입력하세요"
          title="부서명을 입력하세요"
        />
      </div>

      {/* 상세 설명 */}
      <div>
        <label className="text-sm font-medium text-gray-600">상세 설명</label>
        <textarea
          value={editData.detail}
          onChange={(e) => handleFieldChange('detail', e.target.value)}
          className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-vertical"
          placeholder="상세 설명을 입력하세요"
          rows={5}
          title="상세 설명을 입력하세요"
        />
      </div>

      {/* 편집 모드 버튼들 */}
      <div className="mt-6 pt-4 border-t border-gray-200 flex gap-2 justify-end">
        <button
          onClick={onCancel}
          disabled={isLoading}
          className="px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50"
        >
          취소
        </button>
        <button
          onClick={onSave}
          disabled={isLoading}
          className="px-4 py-2 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors disabled:opacity-50"
        >
          {isLoading ? '저장 중...' : '💾 저장'}
        </button>
      </div>
    </div>
  )
}

export default TaskEditForm

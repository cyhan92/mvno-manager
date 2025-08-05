import React from 'react'
import { ViewMode, DateUnit } from '../../types/task'
import { DATE_UNIT_OPTIONS } from '../../constants'

interface GanttControlPanelProps {
  viewMode: ViewMode
  dateUnit: DateUnit
  onViewModeChange: (mode: ViewMode) => void
  onDateUnitChange: (unit: DateUnit) => void
  showAssigneeInfo: boolean // 담당자 정보 표시 여부
  onShowAssigneeInfoChange: (show: boolean) => void // 담당자 정보 표시 토글
  onExpandAll?: () => void // 전체 확장
  onCollapseAll?: () => void // 전체 축소  
  onExpandToLevel?: (level: number) => void // 레벨별 확장
}

const GanttControlPanel: React.FC<GanttControlPanelProps> = ({
  viewMode,
  dateUnit,
  onViewModeChange,
  onDateUnitChange,
  showAssigneeInfo,
  onShowAssigneeInfoChange,
  onExpandAll,
  onCollapseAll,
  onExpandToLevel
}) => {
  const handleDateUnitChange = (unit: DateUnit) => {
    onDateUnitChange(unit)
  }
  
  return (
    <div className="bg-white rounded-lg shadow-sm border p-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h3 className="text-lg font-semibold text-gray-900">
          📊 간트 차트 - 프로젝트 진행 현황
        </h3>
        
        <div className="flex items-center space-x-4">
          {/* 담당자 정보 표시 토글 */}
          <div className="flex items-center space-x-2">
            <label className="text-sm text-gray-700">담당자 정보</label>
            <button
              onClick={() => onShowAssigneeInfoChange(!showAssigneeInfo)}
              title={showAssigneeInfo ? '담당자 정보 숨기기' : '담당자 정보 표시'}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                showAssigneeInfo ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  showAssigneeInfo ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
          
          {/* 날짜 단위 선택 */}
          <div className="flex bg-gray-100 rounded-lg p-1">
            {DATE_UNIT_OPTIONS.map((option) => (
              <button
                key={option.key}
                onClick={() => handleDateUnitChange(option.key)}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  dateUnit === option.key
                    ? 'bg-white text-gray-900 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>

          {/* 트리 확장/축소 컨트롤 */}
          <div className="flex gap-2">
            <button
              onClick={() => onCollapseAll?.()}
              className="px-3 py-1.5 text-sm font-medium text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-md border transition-colors"
              title="전체 축소 (대분류만 표시)"
            >
              전체 축소
            </button>
            <button
              onClick={() => onExpandToLevel?.(1)}
              className="px-3 py-1.5 text-sm font-medium text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-md border transition-colors"
              title="1단계 확장 (대분류, 소분류까지 표시)"
            >
              1단계 확장
            </button>
            <button
              onClick={() => onExpandAll?.()}
              className="px-3 py-1.5 text-sm font-medium text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-md border transition-colors"
              title="전체 확장 (모든 항목 표시)"
            >
              전체 확장
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default GanttControlPanel

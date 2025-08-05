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
}

const GanttControlPanel: React.FC<GanttControlPanelProps> = ({
  viewMode,
  dateUnit,
  onViewModeChange,
  onDateUnitChange,
  showAssigneeInfo,
  onShowAssigneeInfoChange
}) => {
  console.log(`🎮 [DEBUG] GanttControlPanel render - dateUnit: ${dateUnit}`)
  
  const handleDateUnitChange = (unit: DateUnit) => {
    console.log(`🎮 [DEBUG] Date unit changing from ${dateUnit} to ${unit}`)
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
        </div>
      </div>
    </div>
  )
}

export default GanttControlPanel

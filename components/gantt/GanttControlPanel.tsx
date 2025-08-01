import React from 'react'
import { ViewMode, GroupBy, DateUnit } from '../../types/task'
import { GROUP_BY_OPTIONS, DATE_UNIT_OPTIONS } from '../../constants'

interface GanttControlPanelProps {
  viewMode: ViewMode
  groupBy?: GroupBy
  dateUnit: DateUnit
  onViewModeChange: (mode: ViewMode) => void
  onGroupByChange: (groupBy: GroupBy) => void
  onDateUnitChange: (unit: DateUnit) => void
}

const GanttControlPanel: React.FC<GanttControlPanelProps> = ({
  viewMode,
  groupBy,
  dateUnit,
  onViewModeChange,
  onGroupByChange,
  onDateUnitChange
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border p-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h3 className="text-lg font-semibold text-gray-900">
          📊 간트 차트 - 프로젝트 진행 현황
        </h3>
        
        <div className="flex items-center space-x-4">
          {/* 그룹핑 기준 선택 */}
          <div className="flex bg-gray-100 rounded-lg p-1">
            {GROUP_BY_OPTIONS.map((option) => (
              <button
                key={option.key}
                onClick={() => onGroupByChange(option.key)}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  groupBy === option.key
                    ? 'bg-white text-gray-900 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>

          {/* 날짜 단위 선택 */}
          <div className="flex bg-gray-100 rounded-lg p-1">
            {DATE_UNIT_OPTIONS.map((option) => (
              <button
                key={option.key}
                onClick={() => onDateUnitChange(option.key)}
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

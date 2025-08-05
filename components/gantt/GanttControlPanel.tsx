import React from 'react'
import { ViewMode, DateUnit } from '../../types/task'
import { DATE_UNIT_OPTIONS } from '../../constants'

interface GanttControlPanelProps {
  viewMode: ViewMode
  dateUnit: DateUnit
  onViewModeChange: (mode: ViewMode) => void
  onDateUnitChange: (unit: DateUnit) => void
}

const GanttControlPanel: React.FC<GanttControlPanelProps> = ({
  viewMode,
  dateUnit,
  onViewModeChange,
  onDateUnitChange
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

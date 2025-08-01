import React from 'react'
import { ViewMode, GroupBy, Task } from '../../types/task'

interface GanttGroupSelectorProps {
  viewMode: ViewMode
  groupBy?: GroupBy
  groupedTasks: Record<string, Task[]>
  expandedGroups: Set<string>
  onToggleGroup: (groupName: string) => void
  onExpandAll: () => void
  onCollapseAll: () => void
}

const GanttGroupSelector: React.FC<GanttGroupSelectorProps> = ({
  viewMode,
  groupBy,
  groupedTasks,
  expandedGroups,
  onToggleGroup,
  onExpandAll,
  onCollapseAll
}) => {
  if (viewMode !== 'detailed') {
    return null
  }

  const getGroupTypeLabel = () => {
    switch (groupBy) {
      case 'resource': return '담당자별'
      case 'major': return '대분류별'
      case 'middle': return '중분류별'
      case 'minor': return '소분류별'
      default: return '카테고리별'
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border p-4">
      <h4 className="text-md font-semibold text-gray-900 mb-3">
        🔍 세부 보기 - {getGroupTypeLabel()} 그룹 선택
      </h4>
      <div className="flex flex-wrap gap-2">
        {Object.entries(groupedTasks).map(([groupName, groupTasks]) => (
          <button
            key={groupName}
            onClick={() => onToggleGroup(groupName)}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              expandedGroups.has(groupName)
                ? 'bg-blue-100 text-blue-800 border-blue-200'
                : 'bg-gray-100 text-gray-700 border-gray-200'
            } border hover:shadow-sm`}
          >
            {expandedGroups.has(groupName) ? '🔽' : '▶️'} {groupName} ({groupTasks.length})
          </button>
        ))}
        <button
          onClick={onExpandAll}
          className="px-3 py-2 rounded-lg text-sm font-medium bg-green-100 text-green-800 border border-green-200 hover:shadow-sm"
        >
          📖 모두 펼치기
        </button>
        <button
          onClick={onCollapseAll}
          className="px-3 py-2 rounded-lg text-sm font-medium bg-red-100 text-red-800 border border-red-200 hover:shadow-sm"
        >
          📕 모두 접기
        </button>
      </div>
    </div>
  )
}

export default GanttGroupSelector

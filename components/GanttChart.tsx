'use client'
import React from 'react'
import { Task, ViewMode, GroupBy } from '../types/task'
import { useGanttChart } from '../hooks/useGanttChart'
import GanttControlPanel from './gantt/GanttControlPanel'
import CustomGanttChart from './gantt/CustomGanttChart'
import GanttTaskDetail from './gantt/GanttTaskDetail'

interface GanttChartProps {
  tasks: Task[]
  viewMode: ViewMode
  groupBy?: GroupBy
  onViewModeChange: (mode: ViewMode) => void
  onGroupByChange: (groupBy: GroupBy) => void
  onTaskUpdate?: (updatedTask: Task) => void
}

export default function GanttChart({ 
  tasks, 
  viewMode, 
  groupBy, 
  onViewModeChange, 
  onGroupByChange,
  onTaskUpdate
}: GanttChartProps) {
  const {
    selectedTask,
    setSelectedTask,
    expandedGroups,
    groupedTasks,
    filteredTasks,
    chartData,
    dateUnit,
    setDateUnit,
    toggleGroup,
    expandAllGroups,
    collapseAllGroups,
    handleTaskSelect,
    popupPosition,
    setPopupPosition
  } = useGanttChart(tasks, viewMode, groupBy)

  const [showAssigneeInfo, setShowAssigneeInfo] = React.useState(true) // 담당자 정보 표시 상태 - 기본값 ON

  return (
    <div className="space-y-4">
      <GanttControlPanel
        viewMode={viewMode}
        dateUnit={dateUnit}
        onViewModeChange={onViewModeChange}
        onDateUnitChange={setDateUnit}
        showAssigneeInfo={showAssigneeInfo}
        onShowAssigneeInfoChange={setShowAssigneeInfo}
      />

      <CustomGanttChart
        tasks={viewMode === 'overview' ? tasks : filteredTasks}
        viewMode={viewMode}
        dateUnit={dateUnit}
        onDateUnitChange={setDateUnit}
        chartData={chartData}
        groupedTasks={groupedTasks}
        onTaskSelect={handleTaskSelect}
        onTaskUpdate={onTaskUpdate}
        groupBy={groupBy}
        showAssigneeInfo={showAssigneeInfo}
      />

      <GanttTaskDetail
        selectedTask={selectedTask}
        onClose={() => {
          setSelectedTask(null)
          setPopupPosition(null)
        }}
        position={popupPosition || undefined}
        isPopup={!!popupPosition}
      />
    </div>
  )
}

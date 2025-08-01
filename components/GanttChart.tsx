'use client'
import React from 'react'
import { Task, ViewMode, GroupBy } from '../types/task'
import { useGanttChart } from '../hooks/useGanttChart'
import GanttControlPanel from './gantt/GanttControlPanel'
import GanttGroupSelector from './gantt/GanttGroupSelector'
import CustomGanttChart from './gantt/CustomGanttChart'
import GanttTaskDetail from './gantt/GanttTaskDetail'

interface GanttChartProps {
  tasks: Task[]
  viewMode: ViewMode
  groupBy?: GroupBy
  onViewModeChange: (mode: ViewMode) => void
  onGroupByChange: (groupBy: GroupBy) => void
}

export default function GanttChart({ 
  tasks, 
  viewMode, 
  groupBy, 
  onViewModeChange, 
  onGroupByChange 
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
    handleTaskSelect
  } = useGanttChart(tasks, viewMode, groupBy)

  return (
    <div className="space-y-4">
      <GanttControlPanel
        viewMode={viewMode}
        groupBy={groupBy}
        dateUnit={dateUnit}
        onViewModeChange={onViewModeChange}
        onGroupByChange={onGroupByChange}
        onDateUnitChange={setDateUnit}
      />

      <GanttGroupSelector
        viewMode={viewMode}
        groupBy={groupBy}
        groupedTasks={groupedTasks}
        expandedGroups={expandedGroups}
        onToggleGroup={toggleGroup}
        onExpandAll={expandAllGroups}
        onCollapseAll={collapseAllGroups}
      />

      <CustomGanttChart
        tasks={viewMode === 'overview' ? tasks : filteredTasks}
        viewMode={viewMode}
        dateUnit={dateUnit}
        chartData={chartData}
        groupedTasks={groupedTasks}
        onTaskSelect={handleTaskSelect}
        groupBy={groupBy}
      />

      <GanttTaskDetail
        selectedTask={selectedTask}
        onClose={() => setSelectedTask(null)}
      />
    </div>
  )
}

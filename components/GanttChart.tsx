'use client'
import React from 'react'
import { Task, ViewMode, GroupBy } from '../types/task'
import { useGanttChart } from '../hooks/useGanttChart'
import GanttControlPanel from './gantt/GanttControlPanel'
import CustomGanttChartModular from './gantt/CustomGanttChartModular'
import GanttTaskDetail from './gantt/GanttTaskDetail'

interface GanttChartProps {
  tasks: Task[]
  viewMode: ViewMode
  groupBy?: GroupBy
  onViewModeChange: (mode: ViewMode) => void
  onGroupByChange: (groupBy: GroupBy) => void
  onTaskUpdate?: (updatedTask: Task) => void
  onTaskAdd?: (newTask: Partial<Task>) => Promise<void> // 새로운 Task 추가 콜백
  onTaskDelete?: (taskId: string) => Promise<void> // 작업 삭제 콜백
  onDataRefresh?: () => void // 전체 데이터 다시 로드 함수
  onMajorCategoryUpdate?: (oldCategory: string, newCategory: string) => Promise<void> // 대분류 수정 콜백
  onSubCategoryUpdate?: (taskId: string, middleCategory: string, subCategory: string) => Promise<void> // 중분류,소분류 수정 콜백
  onMoveMajorCategory?: (currentMajorCategory: string, currentMinorCategory: string, targetMajorCategory: string) => Promise<{ success: boolean; updatedCount: number }> // 대분류 이동 콜백
}

export default function GanttChart({ 
  tasks, 
  viewMode, 
  groupBy, 
  onViewModeChange, 
  onGroupByChange,
  onTaskUpdate,
  onTaskAdd,
  onTaskDelete,
  onDataRefresh,
  onMajorCategoryUpdate,
  onSubCategoryUpdate,
  onMoveMajorCategory
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
  
  // 트리 상태 관리 함수들
  const [treeControls, setTreeControls] = React.useState<{
    expandAll: () => void
    collapseAll: () => void
    expandToLevel: (level: number) => void
  } | null>(null)

  // 트리 컨트롤 함수들을 안전하게 래핑
  const handleExpandAll = React.useCallback(() => {
    if (treeControls?.expandAll) {
      treeControls.expandAll()
    }
  }, [treeControls])

  const handleCollapseAll = React.useCallback(() => {
    if (treeControls?.collapseAll) {
      treeControls.collapseAll()
    }
  }, [treeControls])

  const handleExpandToLevel = React.useCallback((level: number) => {
    if (treeControls?.expandToLevel) {
      treeControls.expandToLevel(level)
    }
  }, [treeControls])

  return (
    <div className="space-y-4">
      <GanttControlPanel
        viewMode={viewMode}
        dateUnit={dateUnit}
        onViewModeChange={onViewModeChange}
        onDateUnitChange={setDateUnit}
        showAssigneeInfo={showAssigneeInfo}
        onShowAssigneeInfoChange={setShowAssigneeInfo}
        onExpandAll={treeControls ? handleExpandAll : undefined}
        onCollapseAll={treeControls ? handleCollapseAll : undefined}
        onExpandToLevel={treeControls ? handleExpandToLevel : undefined}
      />

      <CustomGanttChartModular
        tasks={viewMode === 'overview' ? tasks : filteredTasks}
        viewMode={viewMode}
        dateUnit={dateUnit}
        onDateUnitChange={setDateUnit}
        chartData={chartData}
        groupedTasks={groupedTasks}
        onTaskSelect={handleTaskSelect}
        onTaskUpdate={onTaskUpdate}
        onTaskAdd={onTaskAdd}
        onTaskDelete={onTaskDelete}
        onDataRefresh={onDataRefresh}
        onMajorCategoryUpdate={onMajorCategoryUpdate}
        onSubCategoryUpdate={onSubCategoryUpdate}
        onMoveMajorCategory={onMoveMajorCategory}
        groupBy={groupBy}
        showAssigneeInfo={showAssigneeInfo}
        onTreeStateChange={setTreeControls}
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

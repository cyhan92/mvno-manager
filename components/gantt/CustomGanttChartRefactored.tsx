'use client'
import React from 'react'
import { Task, ViewMode, DateUnit } from '../../types/task'
import { useCustomGanttChart } from '../../hooks/useCustomGanttChart'
import { useGanttPopup } from '../../hooks/useGanttPopup'
import { useGanttScroll } from '../../hooks/useGanttScroll'
import { useGanttHeight } from '../../hooks/useGanttHeight'
import { 
  useGanttTreeState, 
  useGanttRenderTrigger, 
  useGanttSyncRendering, 
  useGanttTreeToggle 
} from '../../hooks'
import TaskDetailPopup from './TaskDetailPopup'
import EmptyState from './EmptyState'
import GanttChartHeader from './chart/GanttChartHeader'
import GanttChartArea from './chart/GanttChartArea'

interface CustomGanttChartProps {
  tasks: Task[]
  viewMode: ViewMode
  dateUnit: DateUnit
  onDateUnitChange: (dateUnit: DateUnit) => void
  chartData: any[]
  groupedTasks: Record<string, Task[]>
  onTaskSelect: (selection: any) => void
  onTaskUpdate?: (updatedTask: Task) => void
  onTaskAdd?: (newTask: Partial<Task>) => void
  onTaskDelete?: (taskId: string) => void
  onDataRefresh?: () => void
  groupBy?: string
  showAssigneeInfo: boolean
  onTreeStateChange?: (state: {
    expandAll: () => void
    collapseAll: () => void
    expandToLevel: (level: number) => void
  }) => void
}

const CustomGanttChartRefactored: React.FC<CustomGanttChartProps> = ({
  tasks,
  viewMode,
  dateUnit,
  onDateUnitChange,
  chartData,
  groupedTasks,
  onTaskSelect,
  onTaskUpdate,
  onTaskAdd,
  onTaskDelete,
  onDataRefresh,
  groupBy,
  showAssigneeInfo,
  onTreeStateChange
}) => {
  // 렌더링 트리거 관리
  const { renderTrigger, triggerRender } = useGanttRenderTrigger()
  
  // 팝업 상태 관리
  const popup = useGanttPopup()
  
  // 스크롤 관리
  const scroll = useGanttScroll()
  
  // 트리 상태 관리
  const { taskTree, treeState, flattenedTasks } = useGanttTreeState({
    tasks,
    onTreeStateChange
  })

  // 높이 관리
  useGanttHeight({
    taskTree,
    displayTasks: flattenedTasks,
    actionItemScrollRef: scroll.actionItemScrollRef,
    ganttChartScrollRef: scroll.ganttChartScrollRef
  })

  const {
    canvasRef,
    containerRef,
    isLoading,
    displayTasks,
    handleCanvasClick,
    handleCanvasDoubleClick,
    renderChart,
    chartWidth
  } = useCustomGanttChart({
    tasks: flattenedTasks,
    viewMode,
    dateUnit,
    groupedTasks,
    onTaskSelect,
    onTaskDoubleClick: popup.openPopup,
    groupBy,
    setInitialScrollPosition: scroll.setInitialScrollPosition
  })

  // Action Item과 Gantt Chart에서 동일한 데이터 사용 보장
  const synchronizedTasks = flattenedTasks

  // 동기화 렌더링 관리
  useGanttSyncRendering({
    displayTasks,
    expandedNodes: treeState.expandedNodes,
    renderChart,
    canvasRef,
    triggerRender
  })

  // 트리 토글 핸들러
  const { handleTreeToggle } = useGanttTreeToggle({
    actionItemScrollRef: scroll.actionItemScrollRef,
    ganttChartScrollRef: scroll.ganttChartScrollRef,
    toggleNode: treeState.toggleNode,
    renderChart,
    triggerRender
  })

  if (!flattenedTasks || flattenedTasks.length === 0) {
    return (
      <EmptyState 
        totalTasks={tasks.length}
        treeNodesCount={taskTree.length}
        expandedNodesCount={treeState.expandedNodes.size}
      />
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      {/* 차트 헤더 */}
      <GanttChartHeader 
        flattenedTasksLength={flattenedTasks.length}
        dateUnit={dateUnit}
      />
      
      {/* 차트 영역 */}
      <GanttChartArea 
        synchronizedTasks={synchronizedTasks}
        treeState={treeState}
        dateUnit={dateUnit}
        onTaskSelect={onTaskSelect}
        openPopupFromEvent={popup.openPopupFromEvent}
        handleTreeToggle={handleTreeToggle}
        showAssigneeInfo={showAssigneeInfo}
        onTaskAdd={onTaskAdd}
        actionItemScrollRef={scroll.actionItemScrollRef}
        headerScrollRef={scroll.headerScrollRef}
        ganttChartScrollRef={scroll.ganttChartScrollRef}
        handleActionItemScroll={scroll.handleActionItemScroll}
        handleHeaderScroll={scroll.handleHeaderScroll}
        handleGanttChartScroll={scroll.handleGanttChartScroll}
        canvasRef={canvasRef}
        containerRef={containerRef}
        isLoading={isLoading}
        handleCanvasClick={handleCanvasClick}
        handleCanvasDoubleClick={handleCanvasDoubleClick}
        renderTrigger={renderTrigger}
        chartWidth={chartWidth}
      />

      {/* 세부업무 상세 팝업 */}
      {popup.isOpen && (
        <TaskDetailPopup 
          task={popup.selectedTaskDetail!}
          position={popup.popupPosition!}
          onClose={popup.closePopup}
          onTaskUpdate={(updatedTask: Task) => {
            if (onTaskUpdate) {
              onTaskUpdate(updatedTask)
            }
            popup.closePopup()
          }}
          onTaskDelete={onTaskDelete}
          onDataRefresh={onDataRefresh}
        />
      )}
    </div>
  )
}

export default CustomGanttChartRefactored

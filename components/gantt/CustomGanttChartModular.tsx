'use client'
import React from 'react'
import { Task, ViewMode, DateUnit } from '../../types/task'
import { useGanttChartManager } from '../../hooks/gantt/useGanttChartManager'
import { styles } from '../../styles'

// 컴포넌트들 import
import ActionItemList from './ActionItemList'
import TaskDetailPopupRefactored from './TaskDetailPopupRefactored'
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
  onTaskAdd?: (newTask: Partial<Task>) => Promise<void>
  onTaskDelete?: (taskId: string) => Promise<void>
  onDataRefresh?: () => void
  onMajorCategoryUpdate?: (oldCategory: string, newCategory: string) => Promise<void>
  onSubCategoryUpdate?: (taskId: string, middleCategory: string, subCategory: string) => Promise<void>
  onMoveMajorCategory?: (currentMajorCategory: string, currentMinorCategory: string, targetMajorCategory: string) => Promise<{ success: boolean; updatedCount: number }>
  groupBy?: string
  showAssigneeInfo: boolean
  onTreeStateChange?: (state: {
    expandAll: () => void
    collapseAll: () => void
    expandToLevel: (level: number) => void
  }) => void
}

const CustomGanttChartModular: React.FC<CustomGanttChartProps> = ({
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
  onMajorCategoryUpdate,
  onSubCategoryUpdate,
  onMoveMajorCategory,
  groupBy,
  showAssigneeInfo,
  onTreeStateChange
}) => {
  // 통합 간트 차트 관리 훅 사용
  const {
    taskTree,
    treeState,
    flattenedTasks,
    handleTreeToggle,
    renderTrigger,
    canvasRef,
    containerRef,
    isLoading,
    displayTasks,
    handleCanvasClick,
    handleCanvasDoubleClick,
    chartWidth,
    dateRange,
    todayX,
    todayDate,
    popup,
    scroll,
    synchronizedTasks
  } = useGanttChartManager({
    tasks,
    viewMode,
    dateUnit,
    groupedTasks,
    onTaskSelect,
    groupBy,
    onTreeStateChange
  })

  // 빈 상태 처리
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
      {/* 헤더 */}
      <GanttChartHeader 
        flattenedTasksLength={flattenedTasks.length}
        dateUnit={dateUnit}
      />
      
      {/* 구조적 분리: Action Item 영역과 Gantt Chart 영역을 완전히 분리 */}
      <div className={styles.ganttFlexContainer}>
        {/* Action Item 영역 - 고정 크기 */}
        <ActionItemList 
          displayTasks={synchronizedTasks}
          treeState={treeState}
          onTaskSelect={onTaskSelect}
          onTaskDoubleClick={popup.openPopupFromEvent}
          onTreeToggle={handleTreeToggle}
          scrollRef={scroll.actionItemScrollRef}
          onScroll={scroll.handleActionItemScroll}
          showAssigneeInfo={showAssigneeInfo}
          onTaskAdd={onTaskAdd}
          onMajorCategoryUpdate={onMajorCategoryUpdate}
          onSubCategoryUpdate={onSubCategoryUpdate}
          onTaskUpdate={onTaskUpdate}
          onTaskDelete={onTaskDelete}
          onDataRefresh={onDataRefresh}
          onOpenTaskDetailPopup={popup.openPopup}
          onMoveMajorCategory={onMoveMajorCategory}
        />
        
        {/* Gantt Chart 영역 - 동적 크기 */}
        <GanttChartArea
          synchronizedTasks={synchronizedTasks}
          dateUnit={dateUnit}
          expandedNodesSize={treeState.expandedNodes.size}
          scrollRefs={{
            headerScrollRef: scroll.headerScrollRef,
            ganttChartScrollRef: scroll.ganttChartScrollRef
          }}
          renderTrigger={renderTrigger}
          containerRef={containerRef}
          chartWidth={chartWidth}
          dateRange={dateRange}
          todayX={todayX}
          todayDate={todayDate}
          canvasRef={canvasRef}
          isLoading={isLoading}
          onHeaderScroll={scroll.handleHeaderScroll}
          onGanttScroll={scroll.handleGanttChartScroll}
          onCanvasClick={handleCanvasClick}
          onCanvasDoubleClick={handleCanvasDoubleClick}
          onAfterHeaderRender={() => {
            try {
              // 헤더 렌더 직후 강제 재동기화 시도 (내부 리프레시 타이밍 대응)
              // 다중 재동기화로 스크롤 위치 확실히 맞추기
              scroll.resyncHorizontal?.()
              
              // 추가 재동기화 (내부 리프레시로 인한 레이아웃 변경 대응)
              setTimeout(() => {
                scroll.resyncHorizontal?.()
              }, 50)
              
              setTimeout(() => {
                scroll.resyncHorizontal?.()
              }, 150)
            } catch {}
          }}
        />
      </div>

      {/* 세부업무 상세 팝업 */}
      {popup.isOpen && (
        <TaskDetailPopupRefactored 
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
          tasks={tasks}
        />
      )}
    </div>
  )
}

export default CustomGanttChartModular

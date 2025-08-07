import React from 'react'
import { Task, DateUnit } from '../../../types/task'
import ActionItemList from '../ActionItemList'
import GanttHeader from '../GanttHeader'
import GanttCanvas from '../GanttCanvas'
import { TreeState } from '../../../types/task'
import { styles } from '../../../styles'

interface GanttChartAreaProps {
  synchronizedTasks: Task[]
  treeState: TreeState
  dateUnit: DateUnit
  onTaskSelect: (selection: any) => void
  openPopupFromEvent: (task: Task, event: React.MouseEvent) => void
  handleTreeToggle: (nodeId: string) => void
  showAssigneeInfo: boolean
  onTaskAdd?: (newTask: Partial<Task>) => void
  
  // 스크롤 관련
  actionItemScrollRef: React.RefObject<HTMLDivElement | null>
  headerScrollRef: React.RefObject<HTMLDivElement | null>
  ganttChartScrollRef: React.RefObject<HTMLDivElement | null>
  handleActionItemScroll: (e: React.UIEvent<HTMLDivElement>) => void
  handleHeaderScroll: (e: React.UIEvent<HTMLDivElement>) => void
  handleGanttChartScroll: (e: React.UIEvent<HTMLDivElement>) => void
  
  // 차트 관련
  canvasRef: React.RefObject<HTMLCanvasElement | null>
  containerRef: React.RefObject<HTMLDivElement | null>
  isLoading: boolean
  handleCanvasClick: (event: React.MouseEvent<HTMLCanvasElement>) => void
  handleCanvasDoubleClick: (event: React.MouseEvent<HTMLCanvasElement>) => void
  renderTrigger: number
  chartWidth: number
}

const GanttChartArea = ({
  synchronizedTasks,
  treeState,
  dateUnit,
  onTaskSelect,
  openPopupFromEvent,
  handleTreeToggle,
  showAssigneeInfo,
  onTaskAdd,
  actionItemScrollRef,
  headerScrollRef,
  ganttChartScrollRef,
  handleActionItemScroll,
  handleHeaderScroll,
  handleGanttChartScroll,
  canvasRef,
  containerRef,
  isLoading,
  handleCanvasClick,
  handleCanvasDoubleClick,
  renderTrigger,
  chartWidth
}: GanttChartAreaProps) => {
  return (
    <div className={styles.ganttFlexContainer}>
      {/* Action Item 영역 - 고정 크기 */}
      <ActionItemList 
        displayTasks={synchronizedTasks}
        treeState={treeState}
        onTaskSelect={onTaskSelect}
        onTaskDoubleClick={openPopupFromEvent}
        onTreeToggle={handleTreeToggle}
        scrollRef={actionItemScrollRef}
        onScroll={handleActionItemScroll}
        showAssigneeInfo={showAssigneeInfo}
        onTaskAdd={onTaskAdd}
      />
      
      {/* Gantt Chart 영역 - 동적 크기 */}
      <div className={styles.ganttChartArea}>
        {/* Gantt Chart 헤더 - 날짜 표시 */}
        <GanttHeader 
          displayTasks={synchronizedTasks}
          dateUnit={dateUnit}
          expandedNodesSize={treeState.expandedNodes.size}
          scrollRef={headerScrollRef}
          renderTrigger={renderTrigger}
          containerRef={containerRef}
          chartWidth={chartWidth}
          onScroll={handleHeaderScroll}
        />
        
        {/* Gantt Chart 내용 */}
        <GanttCanvas 
          canvasRef={canvasRef}
          containerRef={containerRef}
          isLoading={isLoading}
          onCanvasClick={handleCanvasClick}
          onCanvasDoubleClick={handleCanvasDoubleClick}
          scrollRef={ganttChartScrollRef}
          onScroll={handleGanttChartScroll}
        />
      </div>
    </div>
  )
}

export default GanttChartArea

import React from 'react'
import { Task, DateUnit } from '../../../types/task'
import { styles } from '../../../styles'
import GanttHeader from '../GanttHeader'
import GanttCanvas from '../GanttCanvas'

interface GanttChartAreaProps {
  synchronizedTasks: Task[]
  dateUnit: DateUnit
  expandedNodesSize: number
  scrollRefs: {
    headerScrollRef: React.RefObject<HTMLDivElement | null>
    ganttChartScrollRef: React.RefObject<HTMLDivElement | null>
  }
  renderTrigger: number
  containerRef: React.RefObject<HTMLDivElement | null>
  chartWidth: number
  canvasRef: React.RefObject<HTMLCanvasElement | null>
  isLoading: boolean
  onHeaderScroll: (e: React.UIEvent<HTMLDivElement>) => void
  onGanttScroll: (e: React.UIEvent<HTMLDivElement>) => void
  onCanvasClick: (event: React.MouseEvent<HTMLCanvasElement>) => void
  onCanvasDoubleClick: (event: React.MouseEvent<HTMLCanvasElement>) => void
}

const GanttChartArea: React.FC<GanttChartAreaProps> = ({
  synchronizedTasks,
  dateUnit,
  expandedNodesSize,
  scrollRefs,
  renderTrigger,
  containerRef,
  chartWidth,
  canvasRef,
  isLoading,
  onHeaderScroll,
  onGanttScroll,
  onCanvasClick,
  onCanvasDoubleClick
}) => {
  return (
    <div className={styles.ganttChartArea}>
      {/* Gantt Chart 헤더 - 날짜 표시 */}
      <GanttHeader 
        displayTasks={synchronizedTasks}
        dateUnit={dateUnit}
        expandedNodesSize={expandedNodesSize}
        scrollRef={scrollRefs.headerScrollRef}
        renderTrigger={renderTrigger}
        containerRef={containerRef}
        chartWidth={chartWidth}
        onScroll={onHeaderScroll}
      />
      
      {/* Gantt Chart 내용 */}
      <GanttCanvas 
        canvasRef={canvasRef}
        containerRef={containerRef}
        isLoading={isLoading}
        onCanvasClick={onCanvasClick}
        onCanvasDoubleClick={onCanvasDoubleClick}
        scrollRef={scrollRefs.ganttChartScrollRef}
        onScroll={onGanttScroll}
      />
    </div>
  )
}

export default GanttChartArea

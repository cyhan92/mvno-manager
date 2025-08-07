'use client'
import React, { useRef } from 'react'
import { Task, DateUnit } from '../../types/task'
import { styles } from '../../styles'
import { useHeaderChartWidth } from '../../hooks/gantt/useHeaderChartWidth'
import { useHeaderRendering } from '../../hooks/gantt/useHeaderRendering'
import { useDOMObserver } from '../../hooks/gantt/useDOMObserver'

interface GanttHeaderProps {
  displayTasks: Task[]
  dateUnit: DateUnit
  expandedNodesSize: number
  scrollRef: React.RefObject<HTMLDivElement | null>
  renderTrigger: number
  containerRef?: React.RefObject<HTMLDivElement | null>
  chartWidth?: number
  onScroll?: (e: React.UIEvent<HTMLDivElement>) => void
}

const GanttHeaderModular: React.FC<GanttHeaderProps> = ({
  displayTasks,
  dateUnit,
  expandedNodesSize,
  scrollRef,
  renderTrigger,
  containerRef,
  chartWidth,
  onScroll
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // 차트 너비 계산
  const finalChartWidth = useHeaderChartWidth({ dateUnit, chartWidth })

  // 헤더 렌더링 관리
  const { handleRender } = useHeaderRendering({
    canvasRef,
    displayTasks,
    dateUnit,
    chartWidth: finalChartWidth,
    expandedNodesSize,
    renderTrigger
  })

  // DOM 변경 감지 및 리렌더링
  useDOMObserver({
    scrollRef,
    onContentChange: handleRender
  })

  return (
    <div 
      ref={scrollRef}
      className={`${styles.ganttChartHeader} flex-shrink-0`}
      onScroll={onScroll}
    >
      <canvas 
        ref={canvasRef}
        key={`header-${displayTasks.length}-${expandedNodesSize}-${dateUnit}`}
        className="block"
      />
    </div>
  )
}

export default GanttHeaderModular

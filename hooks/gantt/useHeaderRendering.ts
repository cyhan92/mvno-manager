import { useEffect, useRef } from 'react'
import { Task, DateUnit } from '../../types/task'
import { renderHeader } from '../../utils/gantt/header/headerRenderer'

interface UseHeaderRenderingProps {
  canvasRef: React.RefObject<HTMLCanvasElement | null>
  displayTasks: Task[]
  dateUnit: DateUnit
  chartWidth: number
  expandedNodesSize: number
  renderTrigger: number
}

export const useHeaderRendering = ({
  canvasRef,
  displayTasks,
  dateUnit,
  chartWidth,
  expandedNodesSize,
  renderTrigger
}: UseHeaderRenderingProps) => {
  const renderTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // 헤더 렌더링 함수
  const handleRender = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    renderHeader({
      canvas,
      displayTasks,
      dateUnit,
      chartWidth
    })
  }

  // 초기 렌더링 및 주요 props 변경 시 렌더링
  useEffect(() => {
    const syncRender = () => {
      requestAnimationFrame(() => {
        handleRender()
      })
    }
    
    const timer = setTimeout(syncRender, 120)
    
    return () => {
      clearTimeout(timer)
    }
  }, [displayTasks.length, dateUnit, expandedNodesSize, chartWidth])

  // 렌더링 트리거 변경 시
  useEffect(() => {
    if (renderTimeoutRef.current) {
      clearTimeout(renderTimeoutRef.current)
    }
    
    renderTimeoutRef.current = setTimeout(() => {
      requestAnimationFrame(() => {
        handleRender()
      })
    }, 100)

    return () => {
      if (renderTimeoutRef.current) {
        clearTimeout(renderTimeoutRef.current)
      }
    }
  }, [renderTrigger])

  return { handleRender }
}

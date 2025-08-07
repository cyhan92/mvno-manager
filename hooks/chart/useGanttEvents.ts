import { useCallback } from 'react'
import { Task } from '../../types/task'
import { CHART_CONFIG } from '../../utils/canvas'

interface UseGanttEventsProps {
  displayTasks: Task[]
  currentChartWidth: number
  onTaskSelect: (selection: any, position?: { x: number; y: number }) => void
  onTaskDoubleClick?: (task: Task, position: { x: number; y: number }) => void
  getCanvas: () => HTMLCanvasElement | null
}

export const useGanttEvents = ({
  displayTasks,
  currentChartWidth,
  onTaskSelect,
  onTaskDoubleClick,
  getCanvas
}: UseGanttEventsProps) => {

  // 클릭된 행 인덱스 계산
  const calculateRowIndex = (y: number): number => {
    const rowHeight = CHART_CONFIG.DIMENSIONS.ROW_HEIGHT
    return Math.floor(y / rowHeight)
  }

  // 캔버스 클릭 핸들러
  const handleCanvasClick = useCallback((event: MouseEvent) => {
    const canvas = getCanvas()
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top

    const rowIndex = calculateRowIndex(y)
    
    if (rowIndex >= 0 && rowIndex < displayTasks.length) {
      const clickedTask = displayTasks[rowIndex]
      onTaskSelect(clickedTask, { x: event.clientX, y: event.clientY })
    }
  }, [displayTasks, onTaskSelect, getCanvas])

  // 캔버스 더블클릭 핸들러
  const handleCanvasDoubleClick = useCallback((event: MouseEvent) => {
    if (!onTaskDoubleClick) return
    
    const canvas = getCanvas()
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top

    const rowIndex = calculateRowIndex(y)
    
    if (rowIndex >= 0 && rowIndex < displayTasks.length) {
      const clickedTask = displayTasks[rowIndex]
      onTaskDoubleClick(clickedTask, { x: event.clientX, y: event.clientY })
    }
  }, [displayTasks, onTaskDoubleClick, getCanvas])

  // 이벤트 리스너 설정
  const setupEventListeners = useCallback(() => {
    const canvas = getCanvas()
    if (!canvas) return () => {}

    canvas.addEventListener('click', handleCanvasClick)
    canvas.addEventListener('dblclick', handleCanvasDoubleClick)

    return () => {
      canvas.removeEventListener('click', handleCanvasClick)
      canvas.removeEventListener('dblclick', handleCanvasDoubleClick)
    }
  }, [handleCanvasClick, handleCanvasDoubleClick, getCanvas])

  return {
    handleCanvasClick,
    handleCanvasDoubleClick,
    setupEventListeners
  }
}

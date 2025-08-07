import { useEffect } from 'react'
import { Task, ViewMode, DateUnit } from '../../types/task'
import { useGanttCanvas } from './useGanttCanvas'
import { useGanttState } from './useGanttState'
import { useGanttRenderer } from './useGanttRenderer'
import { useGanttEvents } from './useGanttEvents'

interface UseCustomGanttChartProps {
  tasks: Task[]
  viewMode: ViewMode
  dateUnit: DateUnit
  groupedTasks: Record<string, Task[]>
  onTaskSelect: (selection: any, position?: { x: number; y: number }) => void
  onTaskDoubleClick?: (task: Task, position: { x: number; y: number }) => void
  groupBy?: string
  setInitialScrollPosition?: (scrollLeft: number) => void
}

export const useCustomGanttChartRefactored = ({
  tasks,
  viewMode,
  dateUnit,
  groupedTasks,
  onTaskSelect,
  onTaskDoubleClick,
  groupBy,
  setInitialScrollPosition
}: UseCustomGanttChartProps) => {
  
  // 분리된 훅들 사용
  const {
    canvasRef,
    containerRef,
    currentChartWidth,
    getCanvas,
    getContainer,
    getContext,
    updateChartWidth
  } = useGanttCanvas()

  const {
    displayTasks,
    tasksKey,
    isLoading,
    updateLoadingState,
    shouldThrottleRender
  } = useGanttState({ tasks, viewMode, dateUnit })

  const { renderChart } = useGanttRenderer({
    displayTasks,
    dateUnit,
    shouldThrottleRender,
    getCanvas,
    getContainer,
    getContext,
    updateChartWidth,
    updateLoadingState
  })

  const { setupEventListeners } = useGanttEvents({
    displayTasks,
    currentChartWidth,
    onTaskSelect,
    onTaskDoubleClick,
    getCanvas
  })

  // 차트 렌더링 효과
  useEffect(() => {
    renderChart()
  }, [renderChart, tasksKey])

  // 이벤트 리스너 설정
  useEffect(() => {
    const cleanup = setupEventListeners()
    return cleanup
  }, [setupEventListeners])

  // 컨테이너 크기 변경 감지
  useEffect(() => {
    const container = getContainer()
    if (!container) return

    const resizeObserver = new ResizeObserver(() => {
      renderChart()
    })

    resizeObserver.observe(container)
    return () => resizeObserver.disconnect()
  }, [renderChart, getContainer])

  return {
    canvasRef,
    containerRef,
    isLoading,
    currentChartWidth,
    displayTasks
  }
}

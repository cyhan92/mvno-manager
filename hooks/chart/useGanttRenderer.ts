import { useCallback } from 'react'
import { Task, DateUnit } from '../../types/task'
import { validateTasks } from '../../utils/gantt'
import { calculateDateRange, calculateInitialViewport, calculateCanvasDimensions, CHART_CONFIG } from '../../utils/canvas'
import {
  drawBackground,
  drawGridLines,
  drawGanttBar,
  drawChartBorder,
  drawTodayLine
} from '../../utils/canvas'

interface UseGanttRendererProps {
  displayTasks: Task[]
  dateUnit: DateUnit
  shouldThrottleRender: () => boolean
  getCanvas: () => HTMLCanvasElement | null
  getContainer: () => HTMLDivElement | null
  getContext: () => CanvasRenderingContext2D | null
  updateChartWidth: (width: number) => void
  updateLoadingState: (loading: boolean) => void
}

export const useGanttRenderer = ({
  displayTasks,
  dateUnit,
  shouldThrottleRender,
  getCanvas,
  getContainer,
  getContext,
  updateChartWidth,
  updateLoadingState
}: UseGanttRendererProps) => {

  const renderChart = useCallback(() => {
    // 스로틀링 체크
    if (shouldThrottleRender()) {
      return
    }
    
    const canvas = getCanvas()
    const container = getContainer()
    const ctx = getContext()
    
    if (!canvas || !container || !ctx || displayTasks.length === 0) {
      return
    }

    // 날짜 범위 계산
    const validTasks = validateTasks(displayTasks)
    if (validTasks.length === 0) return
    
    const fullDateRange = calculateDateRange(validTasks)
    if (!fullDateRange) return

    // 초기 뷰포트 계산
    const initialViewport = calculateInitialViewport(fullDateRange)
    const { startDate, endDate, timeRange } = fullDateRange

    // 캔버스 크기 계산
    let containerWidth = container.clientWidth
    
    // 고정된 최소 너비 사용
    if (dateUnit === 'month') {
      containerWidth = 1000
    } else {
      containerWidth = 1200
    }
    
    const dimensions = calculateCanvasDimensions(containerWidth, displayTasks.length, dateUnit, fullDateRange)
    const rowHeight = CHART_CONFIG.DIMENSIONS.ROW_HEIGHT
    
    // 차트 너비 저장
    updateChartWidth(dimensions.chartWidth)
    
    // 캔버스 설정
    canvas.width = dimensions.width
    canvas.height = dimensions.height
    canvas.style.width = dimensions.width + 'px'
    canvas.style.height = dimensions.height + 'px'

    // 배경 그리기
    drawBackground({ ctx, canvas, width: canvas.width, height: canvas.height })

    // 그리드 라인 그리기
    drawGridLines(ctx, dateUnit, startDate, endDate, timeRange, dimensions.chartWidth, canvas.height)

    // 각 작업에 대해 Gantt 바 그리기
    displayTasks.forEach((task, index) => {
      const y = index * rowHeight + (rowHeight / 2)
      drawGanttBar(ctx, task, startDate, timeRange, dimensions.chartWidth, y, dateUnit)
    })

    // 오늘 날짜 표시선
    drawTodayLine(ctx, startDate, timeRange, dimensions.chartWidth, canvas.height)

    // 차트 테두리
    drawChartBorder(ctx, canvas.width, canvas.height, 0, 0)

    updateLoadingState(false)
  }, [
    displayTasks,
    dateUnit,
    shouldThrottleRender,
    getCanvas,
    getContainer,
    getContext,
    updateChartWidth,
    updateLoadingState
  ])

  return {
    renderChart
  }
}

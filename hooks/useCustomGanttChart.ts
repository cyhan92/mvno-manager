import { useRef, useEffect, useState, useMemo, useCallback } from 'react'
import { Task, ViewMode, DateUnit } from '../types/task'
import { calculateDisplayTasks, calculateClickedRowIndex, validateTasks } from '../utils/gantt'
import { calculateDateRange, calculateInitialViewport, calculateCanvasDimensions, CHART_CONFIG } from '../utils/canvas'
import {
  drawBackground,
  drawGridLines,
  drawGanttBar,
  drawChartBorder,
  drawTodayLine
} from '../utils/canvas'

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

export const useCustomGanttChart = ({
  tasks,
  viewMode,
  dateUnit,
  groupedTasks,
  onTaskSelect,
  onTaskDoubleClick,
  groupBy,
  setInitialScrollPosition
}: UseCustomGanttChartProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [currentChartWidth, setCurrentChartWidth] = useState<number>(0)
  const lastRenderTimeRef = useRef<number>(0)

  // 실제 렌더링할 데이터 계산
  const displayTasks = useMemo(() => {
    return tasks
  }, [tasks])

  // displayTasks의 안정적인 키 생성
  const tasksKey = useMemo(() => {
    return `${displayTasks.length}-${dateUnit}-${viewMode}`
  }, [displayTasks.length, dateUnit, viewMode])

  // 차트 렌더링 함수
  const renderChart = useCallback(() => {
    const now = Date.now()
    
    // 스로틀링 (50ms)
    if (now - lastRenderTimeRef.current < 50) {
      return
    }
    
    if (!canvasRef.current || !containerRef.current || displayTasks.length === 0) {
      return
    }
    
    lastRenderTimeRef.current = now

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // 날짜 범위 계산
    const validTasks = validateTasks(displayTasks)
    if (validTasks.length === 0) return
    
    const fullDateRange = calculateDateRange(validTasks)
    if (!fullDateRange) return

    // 초기 뷰포트 계산 (오늘 날짜 기준 왼쪽 1달까지만 표시)
    const initialViewport = calculateInitialViewport(fullDateRange)
    const { startDate, endDate, timeRange } = fullDateRange

    // 캔버스 크기 계산
    const container = containerRef.current
    let containerWidth = container.clientWidth
    
    // 고정된 최소 너비 사용 - 화면 크기에 관계없이 일정한 비율 유지
    if (dateUnit === 'month') {
      // 월별 모드: 고정된 최소 너비 사용 (1000px)
      containerWidth = 1000
    } else {
      // 주별 모드: 더 큰 고정 너비 사용 (1200px)
      containerWidth = 1200
    }
    
    const dimensions = calculateCanvasDimensions(containerWidth, displayTasks.length, dateUnit, fullDateRange)
    
    // 차트 너비 저장
    setCurrentChartWidth(dimensions.chartWidth)
    
    // 캔버스 설정
    canvas.width = dimensions.width
    canvas.height = dimensions.height
    
    const canvasParent = canvas.parentElement
    
    // 모든 스타일을 강제로 초기화 (매우 중요!)
    canvas.removeAttribute('style')
    if (canvasParent) {
      // 부모 스타일도 초기화
      canvasParent.removeAttribute('style')
      
      // 기본 높이 설정
      const actionItemHeight = displayTasks.length * 40
      canvasParent.style.height = `${actionItemHeight}px`
      canvasParent.style.minHeight = `${actionItemHeight}px`
      canvasParent.style.maxHeight = `${actionItemHeight}px`
    }
    
    if (dateUnit === 'week') {
      canvas.style.width = `${dimensions.width}px`
      canvas.style.height = `${dimensions.height}px`
      canvas.style.minWidth = '1800px'
      canvas.style.maxWidth = 'none'
      
      if (canvasParent) {
        canvasParent.style.width = 'max-content'
        canvasParent.style.minWidth = '1800px'
        canvasParent.style.overflowX = 'auto'
      }
    } else {
      canvas.style.width = `${dimensions.containerWidth}px`
      canvas.style.height = `${dimensions.height}px`
      canvas.style.minWidth = `${dimensions.containerWidth}px` // 고정 최소 너비 설정
      canvas.style.maxWidth = 'none'
      
      if (canvasParent) {
        canvasParent.style.width = 'max-content' // 스크롤 가능하도록 설정
        canvasParent.style.minWidth = `${dimensions.containerWidth}px`
        canvasParent.style.overflowX = 'auto'
      }
    }

    // 캔버스 클리어
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    
    // 배경 그리기
    const context = { ctx, canvas, width: dimensions.width, height: dimensions.height }
    drawBackground(context)

    // 간트바 그리기
    displayTasks.forEach((task, index) => {
      const y = index * CHART_CONFIG.DIMENSIONS.ROW_HEIGHT

      // 행 배경
      ctx.fillStyle = index % 2 === 0 ? CHART_CONFIG.COLORS.ROW_EVEN : CHART_CONFIG.COLORS.ROW_ODD
      ctx.fillRect(0, y, dimensions.width, CHART_CONFIG.DIMENSIONS.ROW_HEIGHT)

      // 행 구분선
      ctx.strokeStyle = '#f0f0f0'
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(0, y + CHART_CONFIG.DIMENSIONS.ROW_HEIGHT)
      ctx.lineTo(dimensions.width, y + CHART_CONFIG.DIMENSIONS.ROW_HEIGHT)
      ctx.stroke()

      // 간트바
      drawGanttBar(ctx, task, startDate, timeRange, dimensions.chartWidth, y, dateUnit)
    })

    // 그리드 라인
    drawGridLines(ctx, dateUnit, startDate, endDate, timeRange, dimensions.chartWidth, dimensions.height, 0)

    // 차트 테두리
    drawChartBorder(ctx, 0, 0, dimensions.chartWidth, dimensions.chartHeight)

    // 오늘 날짜 선
    drawTodayLine(ctx, startDate, timeRange, dimensions.chartWidth, dimensions.chartHeight, 0)

    setIsLoading(false)
  }, [tasksKey, displayTasks, dateUnit]) // 안정적인 의존성 배열

  // 초기 스크롤 위치 설정을 위한 별도 useEffect
  useEffect(() => {
    if (!setInitialScrollPosition || displayTasks.length === 0) return
    
    const validTasks = validateTasks(displayTasks)
    if (validTasks.length === 0) return
    
    const fullDateRange = calculateDateRange(validTasks)
    const initialViewport = calculateInitialViewport(fullDateRange)
    
    if (initialViewport.scrollOffset && initialViewport.scrollOffset > 0) {
      const container = containerRef.current
      if (!container) return
      
      let containerWidth = container.clientWidth
      if (dateUnit === 'month') {
        containerWidth = 1000
      } else {
        containerWidth = 1200
      }
      
      const dimensions = calculateCanvasDimensions(containerWidth, displayTasks.length, dateUnit, fullDateRange)
      const pixelsPerMs = dimensions.chartWidth / fullDateRange.timeRange
      const scrollLeft = (initialViewport.scrollOffset / (24 * 60 * 60 * 1000)) * pixelsPerMs
      
      // 렌더링 후 스크롤 위치 설정
      const timer = setTimeout(() => {
        setInitialScrollPosition(Math.max(0, scrollLeft))
      }, 200) // 렌더링 완료 후 설정
      
      return () => clearTimeout(timer)
    }
  }, [displayTasks, dateUnit, setInitialScrollPosition])

  // useEffect - 단순화
  useEffect(() => {
    const timer = setTimeout(() => {
      renderChart()
    }, 100) // 50ms에서 100ms로 증가 (더 안정적인 디바운싱)

    return () => clearTimeout(timer)
  }, [renderChart])

  // 클릭 이벤트
  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const rect = canvas.getBoundingClientRect()
    
    const clickedRow = calculateClickedRowIndex(
      event.clientY,
      rect,
      CHART_CONFIG.MARGINS.TOP,
      CHART_CONFIG.DIMENSIONS.ROW_HEIGHT
    )

    if (clickedRow >= 0 && clickedRow < displayTasks.length) {
      const task = displayTasks[clickedRow]
      
      const clickPosition = {
        x: event.clientX,
        y: event.clientY
      }

      if (task.hasChildren) {
        const groupKey = task.majorCategory || task.category || 'default'
        const groupTasks = groupedTasks[groupKey] || []
        onTaskSelect({ group: groupKey, tasks: groupTasks }, clickPosition)
      } else {
        onTaskSelect({ task }, clickPosition)
      }
    }
  }

  // 더블클릭 이벤트
  const handleCanvasDoubleClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current || !onTaskDoubleClick) return

    const canvas = canvasRef.current
    const rect = canvas.getBoundingClientRect()
    
    const clickedRow = calculateClickedRowIndex(
      event.clientY,
      rect,
      CHART_CONFIG.MARGINS.TOP,
      CHART_CONFIG.DIMENSIONS.ROW_HEIGHT
    )
    
    if (clickedRow >= 0 && clickedRow < displayTasks.length) {
      const task = displayTasks[clickedRow]
      
      if (!task.hasChildren) {
        const clickPosition = {
          x: event.clientX,
          y: event.clientY
        }
        
        onTaskDoubleClick(task, clickPosition)
      }
    }
  }

  return {
    canvasRef,
    containerRef,
    isLoading,
    displayTasks,
    handleCanvasClick,
    handleCanvasDoubleClick,
    renderChart,
    chartWidth: currentChartWidth
  }
}

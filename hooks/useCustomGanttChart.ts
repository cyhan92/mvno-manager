import { useRef, useEffect, useState, useMemo, useCallback } from 'react'
import { Task, ViewMode, DateUnit } from '../types/task'
import { calculateDisplayTasks, calculateClickedRowIndex, validateTasks } from '../utils/gantt'
import { calculateDateRange, calculateCanvasDimensions, CHART_CONFIG } from '../utils/canvas'
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
}

export const useCustomGanttChart = ({
  tasks,
  viewMode,
  dateUnit,
  groupedTasks,
  onTaskSelect,
  onTaskDoubleClick,
  groupBy
}: UseCustomGanttChartProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [currentChartWidth, setCurrentChartWidth] = useState<number>(0)
  const lastRenderTimeRef = useRef<number>(0)

  // 실제 렌더링할 데이터 계산
  const displayTasks = useMemo(() => {
    console.log(`📊 [DEBUG] displayTasks calculated - tasks: ${tasks.length}, dateUnit: ${dateUnit}`)
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
      console.log(`⏸️ [DEBUG] renderChart throttled - ${now - lastRenderTimeRef.current}ms ago`)
      return
    }
    
    console.log(`🔍 [DEBUG] renderChart called - dateUnit: ${dateUnit}, tasks: ${displayTasks.length}, timestamp: ${now}`)
    
    if (!canvasRef.current || !containerRef.current || displayTasks.length === 0) {
      console.log('❌ [DEBUG] Early return - missing refs or no tasks')
      return
    }
    
    lastRenderTimeRef.current = now

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // 날짜 범위 계산
    const validTasks = validateTasks(displayTasks)
    if (validTasks.length === 0) return
    
    const dateRange = calculateDateRange(validTasks)
    if (!dateRange) return

    const { startDate, endDate, timeRange } = dateRange
    console.log(`📅 [DEBUG] Date range: ${startDate.toISOString().split('T')[0]} to ${endDate.toISOString().split('T')[0]}, dateUnit: ${dateUnit}`)

    // 캔버스 크기 계산
    const container = containerRef.current
    let containerWidth = container.clientWidth
    
    // 고정된 최소 너비 사용 - 화면 크기에 관계없이 일정한 비율 유지
    if (dateUnit === 'month') {
      // 월별 모드: 고정된 최소 너비 사용 (1000px)
      containerWidth = 1000
      console.log(`🔧 [DEBUG] MONTH mode - using fixed width: ${containerWidth}px (screen will scroll if needed)`)
    } else {
      // 주별 모드: 더 큰 고정 너비 사용 (1200px)
      containerWidth = 1200
      console.log(`🔧 [DEBUG] WEEK mode - using fixed width: ${containerWidth}px (will be expanded further)`)
    }
    
    const dimensions = calculateCanvasDimensions(containerWidth, displayTasks.length, dateUnit)
    console.log(`📐 [DEBUG] Canvas dimensions - dateUnit: ${dateUnit}, input width: ${containerWidth}px, final width: ${dimensions.width}px, chartWidth: ${dimensions.chartWidth}px`)
    
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
      console.log(`🔧 [DEBUG] Setting WEEK mode styles - canvas width: ${dimensions.width}px`)
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
      console.log(`🔧 [DEBUG] Setting MONTH mode styles - canvas width: ${dimensions.containerWidth}px`)
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
    drawBackground(ctx, dimensions.width, dimensions.height)

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

    console.log(`✅ [DEBUG] renderChart completed - ${displayTasks.length} tasks rendered`)
    setIsLoading(false)
  }, [tasksKey, displayTasks, dateUnit]) // 안정적인 의존성 배열

  // useEffect - 단순화
  useEffect(() => {
    console.log(`🔄 [DEBUG] useEffect triggered - key: ${tasksKey}`)
    
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

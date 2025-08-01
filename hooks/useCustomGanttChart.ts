import { useRef, useEffect, useState, useMemo } from 'react'
import { Task, ViewMode, DateUnit } from '../types/task'
import { calculateDisplayTasks, calculateClickedRowIndex, validateTasks } from '../utils/gantt'
import { calculateDateRange, calculateCanvasDimensions, CHART_CONFIG } from '../utils/canvas'
import {
  drawBackground,
  drawGridLines,
  drawGanttBar,
  drawChartBorder
} from '../utils/canvas'

interface UseCustomGanttChartProps {
  tasks: Task[]
  viewMode: ViewMode
  dateUnit: DateUnit
  groupedTasks: Record<string, Task[]>
  onTaskSelect: (selection: any) => void
  groupBy?: string
}

export const useCustomGanttChart = ({
  tasks,
  viewMode,
  dateUnit,
  groupedTasks,
  onTaskSelect,
  groupBy
}: UseCustomGanttChartProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [isLoading, setIsLoading] = useState(true)

  // 실제 렌더링할 데이터 계산
  const displayTasks = useMemo(() => {
    // 트리 구조에서 전달받은 flattenedTasks를 직접 사용
    // 더 이상 calculateDisplayTasks를 통해 그룹 요약을 생성하지 않음
    const tasksWithGroupFlag = tasks.map(task => ({ 
      ...task, 
      isGroup: task.hasChildren || false // TreeNode의 hasChildren 속성 사용
    }))
    
    return tasksWithGroupFlag
  }, [tasks])

  // 차트 렌더링 함수
  const renderChart = () => {
    if (!canvasRef.current || !containerRef.current || displayTasks.length === 0) {
      return
    }

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // 날짜 범위 계산
    const validTasks = validateTasks(displayTasks)
    if (validTasks.length === 0) return
    
    const dateRange = calculateDateRange(validTasks)
    if (!dateRange) return

    const { startDate, endDate, timeRange } = dateRange

    // 캔버스 크기 계산
    const container = containerRef.current
    const containerWidth = container.clientWidth
    const dimensions = calculateCanvasDimensions(containerWidth, displayTasks.length, dateUnit)
    
    // 캔버스 실제 크기 설정 (항상 실제 렌더링 크기)
    canvas.width = dimensions.width
    canvas.height = dimensions.height
    
    if (dateUnit === 'week') {
      // 주별: 캔버스는 실제 크기로 설정하되, CSS로 컨테이너 스크롤 제어
      canvas.style.width = `${dimensions.width}px`
      canvas.style.height = `${dimensions.height}px`
      canvas.style.minWidth = '1200px' // 최소 너비 보장
      canvas.style.maxWidth = 'none'   // 최대 너비 제한 해제
      
      // 캔버스 부모 컨테이너도 확장
      const canvasParent = canvas.parentElement
      if (canvasParent) {
        canvasParent.style.width = 'max-content'
        canvasParent.style.minWidth = '1200px'
      }
    } else {
      // 월별: 컨테이너 너비에 맞춰 표시
      canvas.style.width = `${dimensions.containerWidth}px`
      canvas.style.height = `${dimensions.height}px`
      canvas.style.minWidth = 'auto'
      canvas.style.maxWidth = '100%'
      
      // 캔버스 부모 컨테이너 복원
      const canvasParent = canvas.parentElement
      if (canvasParent) {
        canvasParent.style.width = '100%'
        canvasParent.style.minWidth = '100%'
      }
    }

    // 배경 그리기
    drawBackground(
      ctx,
      dimensions.width,
      dimensions.height
    )

    // 그리드 라인 그리기
    drawGridLines(
      ctx,
      dateUnit,
      startDate,
      endDate,
      timeRange,
      dimensions.chartWidth,
      dimensions.height
    )

    // 작업별 간트바와 행 배경 그리기
    displayTasks.forEach((task, index) => {
      const y = index * CHART_CONFIG.DIMENSIONS.ROW_HEIGHT

      // 행 배경 그리기 - Action Item과 동일한 배경색
      ctx.fillStyle = index % 2 === 0 ? CHART_CONFIG.COLORS.ROW_EVEN : CHART_CONFIG.COLORS.ROW_ODD
      ctx.fillRect(0, y, dimensions.width, CHART_CONFIG.DIMENSIONS.ROW_HEIGHT)

      // 행 구분선 - Action Item과 동일한 구분선
      ctx.strokeStyle = '#f0f0f0' // Action Item의 border-bottom과 동일
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(0, y + CHART_CONFIG.DIMENSIONS.ROW_HEIGHT)
      ctx.lineTo(dimensions.width, y + CHART_CONFIG.DIMENSIONS.ROW_HEIGHT)
      ctx.stroke()

      // 간트바 그리기 - 위치 정확히 맞춤
      drawGanttBar(
        ctx,
        task,
        startDate,
        timeRange,
        dimensions.chartWidth,
        y,
        dateUnit
      )
    })

    // 차트 테두리 그리기
    drawChartBorder(
      ctx,
      0, // leftMargin 제거
      0, // topMargin 제거
      dimensions.chartWidth,
      dimensions.chartHeight
    )

    setIsLoading(false)
  }

  // 차트 초기화 및 리사이즈 처리
  useEffect(() => {
    renderChart()

    const handleResize = () => {
      setTimeout(renderChart, 100)
    }

    window.addEventListener('resize', handleResize)
    
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [displayTasks, dateUnit, viewMode, tasks])

  // tasks 배열이 변경될 때마다 강제로 다시 렌더링
  useEffect(() => {
    const timer = setTimeout(() => {
      renderChart()
    }, 50)
    
    return () => clearTimeout(timer)
  }, [tasks.length, tasks])

  // 클릭 이벤트 처리
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
      onTaskSelect([{ row: clickedRow }])
    }
  }

  return {
    canvasRef,
    containerRef,
    isLoading,
    displayTasks,
    handleCanvasClick,
    renderChart // 외부에서 강제 리렌더링이 필요한 경우
  }
}

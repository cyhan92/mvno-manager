import { useRef, useEffect, useState, useMemo } from 'react'
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

  // 실제 렌더링할 데이터 계산
  const displayTasks = useMemo(() => {
    // 트리 구조에서 전달받은 flattenedTasks를 직접 사용
    // TreeNode의 속성들을 Task 인터페이스에 맞게 매핑
    const tasksWithTreeProps = tasks.map(task => ({ 
      ...task,
      isGroup: task.hasChildren || false, // TreeNode의 hasChildren 속성 사용
      level: task.level || 0, // TreeNode의 level 속성 사용
      hasChildren: task.hasChildren || false // 트리 토글 버튼용
    }))
    
    return tasksWithTreeProps
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
    
    // 캔버스 컨테이너 크기를 정확히 설정하여 스크롤 높이 일치
    const canvasParent = canvas.parentElement
    if (canvasParent) {
      // Action Item과 정확히 일치하는 높이 설정 (헤더 제외)
      const actionItemHeight = displayTasks.length * 40 // ROW_HEIGHT = 40px
      canvasParent.style.height = `${actionItemHeight}px`
      canvasParent.style.minHeight = `${actionItemHeight}px`
      canvasParent.style.maxHeight = `${actionItemHeight}px`
    }
    
    if (dateUnit === 'week') {
      // 주별: 캔버스는 실제 크기로 설정하되, CSS로 컨테이너 스크롤 제어
      canvas.style.width = `${dimensions.width}px`
      canvas.style.height = `${dimensions.height}px`
      canvas.style.minWidth = '1200px' // 최소 너비 보장
      canvas.style.maxWidth = 'none'   // 최대 너비 제한 해제
      
      // 캔버스 부모 컨테이너도 확장
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

    // 오늘 날짜 세로선 그리기
    drawTodayLine(
      ctx,
      startDate,
      timeRange,
      dimensions.chartWidth,
      dimensions.chartHeight,
      0 // leftMargin 제거
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

  // 클릭 이벤트 처리 (단일 클릭 시에는 작업 선택만, 팝업 없음)
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
      // 단일 클릭 시에는 작업 선택만 하고 팝업은 표시하지 않음
      // onTaskSelect([{ row: clickedRow }], clickPosition) // 주석 처리
      
      // 필요한 경우 작업 선택 상태만 업데이트
      // console.log('Task selected:', displayTasks[clickedRow])
    }
  }

  // 더블클릭 이벤트 처리
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
      
      // 세부업무(leaf node)만 더블클릭 처리
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
    renderChart // 외부에서 강제 리렌더링이 필요한 경우
  }
}

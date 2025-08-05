import { Task, DateUnit } from '../../types/task'

// 날짜 범위 계산
export const calculateDateRange = (tasks: Task[]) => {
  if (tasks.length === 0) {
    const today = new Date()
    const startDate = new Date(today.getFullYear(), today.getMonth(), 1)
    const endDate = new Date(today.getFullYear(), today.getMonth() + 3, 0)
    return {
      startDate,
      endDate,
      timeRange: endDate.getTime() - startDate.getTime()
    }
  }

  const startDate = new Date(Math.min(...tasks.map(task => task.start.getTime())))
  const endDate = new Date(Math.max(...tasks.map(task => task.end.getTime())))
  
  // 시작일을 월 첫째 날로, 끝날을 월 마지막 날로 조정
  startDate.setDate(1)
  endDate.setMonth(endDate.getMonth() + 1, 0)
  
  return { 
    startDate, 
    endDate,
    timeRange: endDate.getTime() - startDate.getTime()
  }
}

// 캔버스 차원 계산
export const calculateCanvasDimensions = (
  containerWidth: number,
  taskCount: number,
  dateUnit: DateUnit
) => {
  const rowHeight = 40 // Action Item과 일치하도록 40px로 변경
  const headerHeight = 80
  // leftMargin을 0으로 설정 - 캔버스는 간트차트 영역만 차지
  const leftMargin = 0
  
  // 안전한 컨테이너 너비 보장
  const safeContainerWidth = Math.max(300, Math.min(containerWidth, 50000))
  
  // taskCount와 정확히 일치하는 높이 계산 (헤더 높이 제외)
  const contentHeight = taskCount * rowHeight
  
  // chartWidth 계산 - dateUnit에 따라 다르게 처리
  let chartWidth = safeContainerWidth
  
  if (dateUnit === 'week') {
    // 주별 표시시 대폭 확대 - 더 넓은 간격 제공
    chartWidth = Math.max(safeContainerWidth * 6, 1800) // 최소 1800px 보장
    console.log(`📏 [DEBUG] WEEK mode - chartWidth: ${chartWidth}px (from ${safeContainerWidth}px)`)
  } else {
    // 월별 모드에서는 적절한 너비 유지 (스크롤 가능한 고정 너비)
    chartWidth = Math.max(safeContainerWidth, 1000) // 최소 1000px 보장
    console.log(`📏 [DEBUG] MONTH mode - chartWidth: ${chartWidth}px (from ${safeContainerWidth}px, minimum 1000px)`)
  }
  
  return {
    width: chartWidth, // leftMargin 제거
    height: contentHeight, // 헤더 높이 제외하여 Action Item과 정확히 일치
    chartWidth,
    chartHeight: contentHeight,
    leftMargin,
    topMargin: 0, // 헤더 영역은 별도 컴포넌트에서 처리
    containerWidth: chartWidth // leftMargin 제거
  }
}

// 차트 설정 상수
export const CHART_CONFIG = {
  MARGINS: {
    LEFT_RATIO: 0.35,
    MIN_LEFT: 350,
    TOP: 80,
    RIGHT: 50,
    BOTTOM: 50
  },
  DIMENSIONS: {
    ROW_HEIGHT: 40, // Action Item과 일치하도록 40px로 변경
    MIN_HEIGHT: 500,
    BAR_PADDING: 8,
    MIN_BAR_WIDTH: 2,
    TEXT_PADDING: 15,
    PROGRESS_TEXT_MIN_WIDTH: 40
  },
  SCALING: {
    WEEK_SCALE_MULTIPLIER: 6, // 4에서 6으로 증가
    MIN_WEEK_CHART_WIDTH: 1800 // 1200에서 1800으로 증가
  },
  COLORS: {
    BACKGROUND: '#ffffff',
    HEADER_BG: '#f7f7f7',
    ACTION_ITEM_BG: '#f9fafb',
    ROW_EVEN: '#ffffff',
    ROW_ODD: '#f9fafb',
    BORDER: '#e5e7eb',
    GRID_LINE: '#f0f0f0',
    TEXT_PRIMARY: '#1f2937',
    TEXT_SECONDARY: '#6b7280'
  }
}

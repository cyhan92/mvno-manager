import { DateUnit } from '../../types/task'
import { CANVAS_CONFIG } from './config'

// 월별 헤더 생성 (임시 구현)
const generateMonthHeaders = (startDate: Date, endDate: Date) => {
  const months = []
  const current = new Date(startDate.getFullYear(), startDate.getMonth(), 1)
  
  while (current <= endDate) {
    months.push({
      start: current.getTime(),
      label: `${current.getFullYear()}-${String(current.getMonth() + 1).padStart(2, '0')}`
    })
    current.setMonth(current.getMonth() + 1)
  }
  
  return months
}

// 주별 헤더 생성 (임시 구현)
const generateWeekHeaders = (startDate: Date, endDate: Date) => {
  const weeks = []
  const current = new Date(startDate)
  
  while (current <= endDate) {
    weeks.push({
      start: current.getTime(),
      label: `Week ${Math.ceil((current.getTime() - startDate.getTime()) / (7 * 24 * 60 * 60 * 1000)) + 1}`
    })
    current.setDate(current.getDate() + 7)
  }
  
  return weeks
}

export const drawGridLines = (
  ctx: CanvasRenderingContext2D,
  dateUnit: DateUnit,
  startDate: Date,
  endDate: Date,
  timeRange: number,
  chartWidth: number,
  canvasHeight: number
) => {
  if (dateUnit === 'month') {
    const months = generateMonthHeaders(startDate, endDate)
    
    months.forEach(month => {
      const x = ((month.start - startDate.getTime()) / timeRange) * chartWidth
      
      // 월 구분선
      ctx.strokeStyle = CANVAS_CONFIG.COLORS.GRID_LINE || '#e5e7eb'
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x, canvasHeight)
      ctx.stroke()
    })
  } else {
    const weeks = generateWeekHeaders(startDate, endDate)
    
    weeks.forEach((week, index) => {
      const x = ((week.start - startDate.getTime()) / timeRange) * chartWidth
      
      // 주 구분선
      ctx.strokeStyle = index % 2 === 0 ? (CANVAS_CONFIG.COLORS.GRID_LINE || '#e5e7eb') : '#9ca3af'
      ctx.lineWidth = index % 2 === 0 ? 2 : 1
      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x, canvasHeight)
      ctx.stroke()
    })
  }
}

export const drawActionItemHeader = (
  ctx: CanvasRenderingContext2D,
  topMargin: number,
  leftMargin: number
) => {
  // 헤더 배경
  ctx.fillStyle = CANVAS_CONFIG.COLORS.HEADER_BG || '#f9fafb'
  ctx.fillRect(0, 0, leftMargin, topMargin)
  
  // 헤더 테두리
  ctx.strokeStyle = CANVAS_CONFIG.COLORS.BORDER || '#d1d5db'
  ctx.lineWidth = 1
  ctx.strokeRect(0, 0, leftMargin, topMargin)
  
  // 헤더 텍스트
  ctx.fillStyle = CANVAS_CONFIG.COLORS.TEXT_PRIMARY || '#1f2937'
  ctx.font = CANVAS_CONFIG.FONTS.HEADER || '14px Arial'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText('Action Items', leftMargin / 2, topMargin / 2)
}

export const drawTaskRow = (
  ctx: CanvasRenderingContext2D,
  task: any,
  y: number,
  leftMargin: number,
  rowHeight: number,
  isGroup: boolean = false
) => {
  // 행 배경
  ctx.fillStyle = isGroup ? (CANVAS_CONFIG.COLORS.GROUP_BG || '#f3f4f6') : CANVAS_CONFIG.COLORS.BACKGROUND
  ctx.fillRect(0, y, leftMargin, rowHeight)
  
  // 행 테두리
  ctx.strokeStyle = CANVAS_CONFIG.COLORS.BORDER || '#d1d5db'
  ctx.lineWidth = 0.5
  ctx.strokeRect(0, y, leftMargin, rowHeight)
  
  // 작업 이름
  ctx.fillStyle = CANVAS_CONFIG.COLORS.TEXT_PRIMARY || '#1f2937'
  ctx.font = isGroup ? (CANVAS_CONFIG.FONTS.BOLD || 'bold 12px Arial') : (CANVAS_CONFIG.FONTS.REGULAR || '12px Arial')
  ctx.textAlign = 'left'
  ctx.textBaseline = 'middle'
  
  const padding = 8
  const maxWidth = leftMargin - padding * 2
  const text = task.name || 'Unnamed Task'
  
  ctx.fillText(text, padding, y + rowHeight / 2, maxWidth)
}

export const drawGanttBar = (
  ctx: CanvasRenderingContext2D,
  task: any,
  startDate: Date,
  timeRange: number,
  chartWidth: number,
  y: number,
  dateUnit: DateUnit = 'month'
) => {
  // 간단한 바 위치 계산
  const taskStart = task.start.getTime()
  const taskEnd = task.end.getTime()
  const startDateMs = startDate.getTime()
  
  const x = ((taskStart - startDateMs) / timeRange) * chartWidth
  const width = ((taskEnd - taskStart) / timeRange) * chartWidth
  const height = 20 // 기본 바 높이
  
  const isGroup = task.isGroup || task.level < 3
  
  if (isGroup) {
    // 그룹 바
    ctx.fillStyle = CANVAS_CONFIG.COLORS.GROUP_BAR
    ctx.fillRect(x, y + 5, width, height)
  } else {
    // 작업 바
    const progress = task.percentComplete || 0
    const progressWidth = (width * progress) / 100
    
    // 전체 바 배경
    ctx.fillStyle = CANVAS_CONFIG.COLORS.TASK_BAR_BG
    ctx.fillRect(x, y + 5, width, height)
    
    // 진행된 부분
    ctx.fillStyle = CANVAS_CONFIG.COLORS.TASK_BAR
    ctx.fillRect(x, y + 5, progressWidth, height)
  }
  
  // 바 테두리
  ctx.strokeStyle = CANVAS_CONFIG.COLORS.BORDER
  ctx.lineWidth = 1
  ctx.strokeRect(x, y + 5, width, height)
}

export const drawChartBorder = (
  ctx: CanvasRenderingContext2D,
  x: number = 0,
  y: number = 0,
  width: number,
  height: number
) => {
  ctx.strokeStyle = CANVAS_CONFIG.COLORS.BORDER || '#d1d5db'
  ctx.lineWidth = 2
  ctx.strokeRect(x, y, width, height)
}

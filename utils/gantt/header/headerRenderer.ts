import { DateUnit } from '../../../types/task'
import { calculateDateRange } from '../../canvas'
import { generateHeaders } from './headerGenerators'

interface RenderHeaderParams {
  canvas: HTMLCanvasElement
  displayTasks: any[]
  dateUnit: DateUnit
  chartWidth: number
}

interface HeaderRenderStyle {
  fontSize: string
  textY: number
  lineColor: string
  lineWidth: number
  lineDash: number[]
}

// 날짜 단위별 스타일 설정
const getHeaderStyle = (dateUnit: DateUnit): HeaderRenderStyle => {
  if (dateUnit === 'week') {
    return {
      fontSize: '12px Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      textY: 30,
      lineColor: '#d1d5db',
      lineWidth: 1,
      lineDash: [2, 2]
    }
  } else {
    return {
      fontSize: '14px Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      textY: 40,
      lineColor: '#e5e7eb',
      lineWidth: 1,
      lineDash: [2, 2]
    }
  }
}

// 캔버스 설정
export const setupCanvas = (canvas: HTMLCanvasElement, chartWidth: number, dateUnit: DateUnit) => {
  canvas.width = chartWidth
  canvas.height = 80

  // 모든 스타일을 강제로 초기화
  canvas.removeAttribute('style')
  
  // 기본 스타일 설정
  canvas.style.width = `${chartWidth}px`
  canvas.style.height = '80px'

  if (dateUnit === 'week') {
    canvas.style.minWidth = '1800px'
    canvas.style.maxWidth = 'none'
  } else {
    canvas.style.minWidth = `${chartWidth}px`
    canvas.style.maxWidth = 'none'
  }
}

// 배경 그리기
export const drawBackground = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
  ctx.fillStyle = '#f7f7f7'
  ctx.fillRect(0, 0, width, height)
}

// 헤더 구분선과 라벨 그리기
export const drawHeaders = (
  ctx: CanvasRenderingContext2D,
  headers: any[],
  startDate: Date,
  timeRange: number,
  chartWidth: number,
  dateUnit: DateUnit
) => {
  const style = getHeaderStyle(dateUnit)
  const leftMargin = 0

  ctx.font = style.fontSize
  ctx.fillStyle = '#374151'
  ctx.textAlign = 'center'

  headers.forEach((header) => {
    const x = leftMargin + ((header.start - startDate.getTime()) / timeRange) * chartWidth
    const width = ((header.end - header.start) / timeRange) * chartWidth
    
    // 헤더 라벨 그리기
    ctx.fillText(header.label, x + width / 2, style.textY)

    // 세로선 그리기 - 구간 끝에만
    const endX = leftMargin + ((header.end - startDate.getTime()) / timeRange) * chartWidth
    ctx.strokeStyle = style.lineColor
    ctx.lineWidth = style.lineWidth
    
    // 점선 패턴 설정
    ctx.setLineDash(style.lineDash)
    
    ctx.beginPath()
    ctx.moveTo(endX, 0)
    ctx.lineTo(endX, 80)
    ctx.stroke()
    
    // 점선 패턴 리셋
    ctx.setLineDash([])
  })
}

// 오늘 날짜 표시선 그리기
export const drawTodayLine = (
  ctx: CanvasRenderingContext2D,
  startDate: Date,
  endDate: Date,
  timeRange: number,
  chartWidth: number
) => {
  const today = new Date()
  today.setHours(0, 0, 0, 0) // 시간을 00:00:00으로 정규화
  const todayMs = today.getTime()
  const startDateMs = startDate.getTime()
  
  // 오늘 날짜가 차트 범위 내에 있는지 확인
  if (todayMs >= startDateMs && todayMs <= (startDateMs + timeRange)) {
    const leftMargin = 0
    // 간트차트와 동일한 계산 방식 사용
    const todayX = leftMargin + ((todayMs - startDateMs) / timeRange) * chartWidth
    
    ctx.strokeStyle = '#ef4444'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(todayX, 0)
    ctx.lineTo(todayX, 80)
    ctx.stroke()
    
    console.log('Header today line drawn at:', todayX, 'startDate:', startDate.toISOString(), 'timeRange:', timeRange)
  }
}

// 메인 헤더 렌더링 함수
export const renderHeader = ({ canvas, displayTasks, dateUnit, chartWidth }: RenderHeaderParams) => {
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  // 캔버스 설정
  setupCanvas(canvas, chartWidth, dateUnit)

  const validTasks = displayTasks.filter(task => task.start && task.end)
  if (validTasks.length === 0) return

  const dateRange = calculateDateRange(validTasks)
  if (!dateRange) return

  const { startDate, endDate, timeRange } = dateRange
  if (timeRange <= 0) return

  // 배경 그리기
  drawBackground(ctx, canvas.width, canvas.height)

  // 헤더 생성 및 그리기
  const headers = generateHeaders(dateUnit, startDate, endDate)
  drawHeaders(ctx, headers, startDate, timeRange, chartWidth, dateUnit)

  // 오늘 날짜 선 그리기
  drawTodayLine(ctx, startDate, endDate, timeRange, chartWidth)
}

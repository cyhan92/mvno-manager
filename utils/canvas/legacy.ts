import { DateUnit } from '../../types/task'
import { CANVAS_CONFIG } from './config'

// 월별 헤더 생성 (임시 구현)
const generateMonthHeaders = (startDate: Date, endDate: Date) => {
  const months = []
  const current = new Date(startDate.getFullYear(), startDate.getMonth(), 1)
  
  while (current <= endDate) {
    const monthStart = new Date(current)
    const monthEnd = new Date(current.getFullYear(), current.getMonth() + 1, 0) // 해당 월의 마지막 날
    
    months.push({
      start: monthStart.getTime(),
      end: monthEnd.getTime(),
      label: `${current.getFullYear()}-${String(current.getMonth() + 1).padStart(2, '0')}`
    })
    current.setMonth(current.getMonth() + 1)
  }
  
  return months
}

// 주별 헤더 생성 (개선된 구현)
const generateWeekHeaders = (startDate: Date, endDate: Date) => {
  const weeks = []
  const current = new Date(startDate)
  
  // 시작 날짜를 주의 시작일(월요일)로 조정
  const dayOfWeek = current.getDay()
  const adjustedStart = new Date(current)
  adjustedStart.setDate(current.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1))
  
  let weekStart = new Date(adjustedStart)
  let weekNumber = 1
  
  while (weekStart < endDate) {
    const weekEnd = new Date(weekStart)
    weekEnd.setDate(weekStart.getDate() + 6) // 일주일 끝
    
    // 더 명확한 주별 라벨 생성
    const startMonth = weekStart.getMonth() + 1
    const startDay = weekStart.getDate()
    const endMonth = weekEnd.getMonth() + 1
    const endDay = weekEnd.getDate()
    
    let weekLabel = ''
    if (startMonth === endMonth) {
      // 같은 달 내의 주
      weekLabel = `${startMonth}/${startDay}-${endDay}`
    } else {
      // 월을 넘나드는 주
      weekLabel = `${startMonth}/${startDay}~${endMonth}/${endDay}`
    }
    
    weeks.push({
      start: weekStart.getTime(),
      end: weekEnd.getTime(),
      label: weekLabel,
      weekNumber: weekNumber
    })
    
    // 다음 주로 이동
    weekStart = new Date(weekStart)
    weekStart.setDate(weekStart.getDate() + 7)
    weekNumber++
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
  canvasHeight: number,
  leftMargin: number = 0  // leftMargin을 0으로 변경
) => {
  if (dateUnit === 'month') {
    const months = generateMonthHeaders(startDate, endDate)
    
    months.forEach(month => {
      // 월 끝 지점 점선만 표시 (가독성을 위해 시작 지점 제거)
      const endX = leftMargin + ((month.end - startDate.getTime()) / timeRange) * chartWidth
      ctx.strokeStyle = '#d1d5db' // 연한 회색
      ctx.lineWidth = 1
      ctx.setLineDash([4, 4]) // 점선 패턴
      ctx.beginPath()
      ctx.moveTo(endX, 0)
      ctx.lineTo(endX, canvasHeight)
      ctx.stroke()
      
      // 점선 패턴 리셋
      ctx.setLineDash([])
    })
  } else if (dateUnit === 'week') {
    const weeks = generateWeekHeaders(startDate, endDate)
    
    weeks.forEach((week, index) => {
      // 주 끝 지점에 점선만 표시 (시작 지점 실선 제거)
      const endX = leftMargin + ((week.end - startDate.getTime()) / timeRange) * chartWidth
      
      // 주 끝선 - 점선으로 구분 (점선만 유지)
      ctx.strokeStyle = '#d1d5db' // 연한 회색
      ctx.lineWidth = 1
      ctx.setLineDash([2, 2]) // 점선 패턴
      ctx.beginPath()
      ctx.moveTo(endX, 0)
      ctx.lineTo(endX, canvasHeight)
      ctx.stroke()
      
      // 점선 패턴 리셋
      ctx.setLineDash([])
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
  dateUnit: DateUnit = 'month',
  leftMargin: number = 0  // leftMargin을 0으로 변경
) => {
  // 간단한 바 위치 계산
  const taskStart = task.start.getTime()
  const taskEnd = task.end.getTime()
  const startDateMs = startDate.getTime()
  
  const x = leftMargin + ((taskStart - startDateMs) / timeRange) * chartWidth
  const width = ((taskEnd - taskStart) / timeRange) * chartWidth
  const height = 20 // 기본 바 높이
  
  // ROW_HEIGHT(40px)의 중앙에 바 위치 맞춤
  const barY = y + 10 // (40 - 20) / 2 = 10px 오프셋으로 중앙 정렬
  
  // isGroup 판별을 더 정확하게 - hasChildren이 있거나 명시적으로 isGroup인 경우만
  const isGroup = task.isGroup || task.hasChildren || false
  const progress = task.percentComplete || 0
  
  if (isGroup) {
    // 그룹 바 - 단순한 색상 사용
    ctx.fillStyle = '#e5e7eb' // 밝은 회색 배경
    ctx.fillRect(x, barY, width, height)
    
    // 그룹 진행률 표시 - 단순한 색상 사용
    if (progress > 0) {
      const progressWidth = (width * progress) / 100
      ctx.fillStyle = '#6b7280' // 단순한 회색 진행률
      ctx.fillRect(x, barY, progressWidth, height)
    }
  } else {
    // 작업 바
    const progressWidth = (width * progress) / 100
    
    // 전체 바 배경 - 0% 작업도 명확히 보이도록 배경색 조정
    if (progress === 0) {
      ctx.fillStyle = '#f3f4f6' // 0% 작업은 밝은 회색으로 변경 (텍스트 가독성 향상)
    } else {
      ctx.fillStyle = CANVAS_CONFIG.COLORS.TASK_BAR_BG
    }
    ctx.fillRect(x, barY, width, height)
    
    // 진행된 부분
    if (progress > 0) {
      if (progress >= 100) {
        ctx.fillStyle = '#22c55e' // 완료된 작업 색상
      } else if (progress >= 50) {
        ctx.fillStyle = '#3b82f6' // 진행 중 작업 색상
      } else {
        ctx.fillStyle = '#f59e0b' // 시작 단계 작업 색상
      }
      ctx.fillRect(x, barY, progressWidth, height)
    }
  }
  
  // 바 테두리
  ctx.strokeStyle = CANVAS_CONFIG.COLORS.BORDER
  ctx.lineWidth = 1
  ctx.strokeRect(x, barY, width, height)
  
  // 진행률 텍스트 표시 - 0%도 포함하여 표시
  if (progress >= 0) { // 0% 이상 모든 진행률 표시
    const progressText = `${Math.round(progress)}%`
    
    // 텍스트 스타일 설정 - 폰트 크기 증가
    ctx.font = dateUnit === 'week' ? 'bold 14px Arial' : 'bold 13px Arial'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    
    // 텍스트 위치 계산 - barY 사용
    const textX = x + width / 2
    const textY = barY + height / 2
    
    if (width > 20) {
      // 바 안에 텍스트 표시 - 배경색에 따른 대비 색상 로직
      let textColor = '#1f2937' // 기본 어두운 색상
      
      if (isGroup) {
        // 그룹 바: 진행률에 따른 배경색을 고려한 텍스트 색상
        if (progress >= 80) {
          // 진한 회색 배경(#6b7280)에는 흰색 텍스트
          textColor = '#ffffff'
        } else {
          // 밝은 배경에는 어두운 텍스트
          textColor = '#1f2937'
        }
      } else {
        // 개별 작업 바: 진행률과 배경색에 따른 텍스트 색상
        if (progress >= 100) {
          // 완료된 작업(#22c55e, 녹색)에는 흰색 텍스트
          textColor = '#ffffff'
        } else if (progress >= 80) {
          // 높은 진행률(#3b82f6, 파란색)에는 흰색 텍스트
          textColor = '#ffffff'
        } else if (progress >= 50) {
          // 중간 진행률(#3b82f6, 파란색)에는 흰색 텍스트
          textColor = '#ffffff'
        } else if (progress > 0) {
          // 낮은 진행률(#f59e0b, 주황색)에는 어두운 텍스트
          textColor = '#1f2937'
        } else {
          // 0% 진행률(#f3f4f6, 밝은 회색)에는 어두운 텍스트
          textColor = '#1f2937'
        }
      }
      
      // 텍스트 그리기 - 그림자 효과 제거
      ctx.fillStyle = textColor
      ctx.fillText(progressText, textX, textY)
    } else if (width > 10) {
      // 작은 바의 경우 바 오른쪽에 텍스트 표시 - 폰트 크기 증가
      ctx.font = 'bold 11px Arial'
      ctx.textAlign = 'left'
      ctx.fillStyle = '#1f2937' // 외부 텍스트는 항상 진한 색상
      ctx.fillText(progressText, x + width + 2, textY)
    }
  }
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

/**
 * 오늘 날짜를 나타내는 빨간 세로선 그리기
 */
export const drawTodayLine = (
  ctx: CanvasRenderingContext2D,
  startDate: Date,
  timeRange: number,
  chartWidth: number,
  chartHeight: number,
  leftMargin: number = 0
) => {
  const today = new Date()
  today.setHours(0, 0, 0, 0) // 시간을 00:00:00으로 정규화
  const todayMs = today.getTime()
  const startDateMs = startDate.getTime()
  
  // 오늘 날짜가 차트 범위 내에 있는지 확인
  if (todayMs >= startDateMs && todayMs <= (startDateMs + timeRange)) {
    // 오늘 날짜의 x 위치 계산
    const x = leftMargin + ((todayMs - startDateMs) / timeRange) * chartWidth
    
    // 빨간 세로선 그리기
    ctx.beginPath()
    ctx.strokeStyle = '#ef4444' // 빨간색
    ctx.lineWidth = 2
    ctx.moveTo(x, 0)
    ctx.lineTo(x, chartHeight)
    ctx.stroke()
    
    // 오늘 날짜 라벨 추가
    ctx.fillStyle = '#ef4444'
    ctx.font = 'bold 12px Arial'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'top'
    
    const todayLabel = '오늘'
    const labelY = 5
    
    // 라벨 배경 (가독성을 위해)
    const labelWidth = ctx.measureText(todayLabel).width + 8
    const labelHeight = 16
    ctx.fillStyle = 'rgba(239, 68, 68, 0.9)'
    ctx.fillRect(x - labelWidth / 2, labelY, labelWidth, labelHeight)
    
    // 라벨 텍스트
    ctx.fillStyle = '#ffffff'
    ctx.fillText(todayLabel, x, labelY + 3)
  }
}

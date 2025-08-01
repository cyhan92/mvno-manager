import { Task } from '../../types/task'
import { GanttBarStyle, ProgressBarConfig, RenderOptions } from './types'
import { CANVAS_CONFIG, getProgressColor, getGroupStyle } from './config'
import { drawTextWithShadow, applyTextStyle } from './drawing'

/**
 * 간트 바 위치 계산
 */
export const calculateBarPosition = (
  task: Task,
  startDate: Date,
  endDate: Date,
  timeRange: number,
  chartWidth: number,
  y: number,
  rowHeight: number
): GanttBarStyle => {
  const taskStart = Math.max(task.start.getTime(), startDate.getTime())
  const taskEnd = Math.min(task.end.getTime(), endDate.getTime())
  
  const x = ((taskStart - startDate.getTime()) / timeRange) * chartWidth
  const width = ((taskEnd - taskStart) / timeRange) * chartWidth
  
  return {
    x: Math.max(0, x),
    y: y + 5,
    width: Math.max(1, width),
    height: rowHeight - 10,
    backgroundColor: '#e5e7eb',
    borderColor: '#d1d5db'
  }
}

/**
 * 그룹 간트 바 그리기
 */
export const drawGroupBar = (
  ctx: CanvasRenderingContext2D,
  task: Task,
  style: GanttBarStyle,
  level: number
): void => {
  const groupStyle = getGroupStyle(level)
  
  // 배경
  ctx.fillStyle = groupStyle.bg
  ctx.fillRect(style.x, style.y, style.width, style.height)
  
  // 진행률 표시
  if (task.percentComplete && task.percentComplete > 0) {
    const progressWidth = (style.width * task.percentComplete) / 100
    ctx.fillStyle = groupStyle.progress
    ctx.fillRect(style.x, style.y, progressWidth, style.height)
  }
  
  // 테두리
  ctx.strokeStyle = groupStyle.border
  ctx.lineWidth = 2
  ctx.strokeRect(style.x, style.y, style.width, style.height)
}

/**
 * 개별 작업 간트 바 그리기
 */
export const drawTaskBar = (
  ctx: CanvasRenderingContext2D,
  task: Task,
  style: GanttBarStyle
): void => {
  // 기본 배경
  ctx.fillStyle = style.backgroundColor
  ctx.fillRect(style.x, style.y, style.width, style.height)
  
  // 진행률 표시
  if (task.percentComplete && task.percentComplete > 0) {
    const progressWidth = (style.width * task.percentComplete) / 100
    
    if (task.percentComplete >= 100) {
      // 100% 완료: 전체 바를 초록색으로
      ctx.fillStyle = CANVAS_CONFIG.COLORS.PROGRESS.COMPLETED
      ctx.fillRect(style.x, style.y, style.width, style.height)
      
      // 상단 하이라이트
      ctx.fillStyle = '#22c55e'
      ctx.fillRect(style.x, style.y, style.width, style.height * 0.3)
    } else {
      // 부분 완료: 진행률만큼 색칠
      const progressColor = getProgressColor(task.percentComplete)
      ctx.fillStyle = progressColor
      ctx.fillRect(style.x, style.y, progressWidth, style.height)
      
      // 상단 하이라이트
      const highlightColor = task.percentComplete >= 50 ? '#60a5fa' : '#fbbf24'
      ctx.fillStyle = highlightColor
      ctx.fillRect(style.x, style.y, progressWidth, style.height * 0.3)
    }
  }
  
  // 테두리
  ctx.strokeStyle = style.borderColor
  ctx.lineWidth = 1
  ctx.strokeRect(style.x, style.y, style.width, style.height)
}

/**
 * 진행률 텍스트 그리기
 */
export const drawProgressText = (
  ctx: CanvasRenderingContext2D,
  task: Task,
  style: GanttBarStyle,
  config: ProgressBarConfig,
  dateUnit: 'week' | 'month',
  isGroup: boolean = false
): void => {
  const progress = task.percentComplete || 0
  const text = `${progress.toFixed(0)}%`
  
  // 바 내부에 텍스트를 그릴 수 있는지 확인
  if (style.width > config.minWidthForInternalText) {
    drawInternalProgressText(ctx, task, style, text, dateUnit, isGroup, config.minWidthForInternalText)
  } else {
    drawExternalProgressText(ctx, task, style, text, config.externalTextOffset, dateUnit, isGroup)
  }
}

/**
 * 바 내부 진행률 텍스트
 */
const drawInternalProgressText = (
  ctx: CanvasRenderingContext2D,
  task: Task,
  style: GanttBarStyle,
  text: string,
  dateUnit: 'week' | 'month',
  isGroup: boolean,
  minWidth: number
): void => {
  const progress = task.percentComplete || 0
  
  // 텍스트 스타일 설정
  let textColor: string
  let fontSize: string
  
  if (isGroup) {
    textColor = CANVAS_CONFIG.COLORS.TEXT_PRIMARY
    fontSize = dateUnit === 'week' ? 'bold 12px Arial' : CANVAS_CONFIG.FONTS.PROGRESS
  } else {
    if (progress >= 100) {
      textColor = '#ffffff'
      fontSize = dateUnit === 'week' ? 'bold 13px Arial' : 'bold 14px Arial'
    } else if (progress > 0) {
      textColor = '#ffffff'
      fontSize = dateUnit === 'week' ? 'bold 12px Arial' : CANVAS_CONFIG.FONTS.PROGRESS
    } else {
      textColor = CANVAS_CONFIG.COLORS.TEXT_SECONDARY
      fontSize = dateUnit === 'week' ? '11px Arial' : '12px Arial'
    }
  }
  
  applyTextStyle(ctx, {
    color: textColor,
    font: fontSize,
    align: 'center',
    baseline: 'middle'
  })
  
  const textX = style.x + style.width / 2
  const textY = style.y + style.height / 2
  
  if (progress > 0 || (progress === 0 && style.width > minWidth * 1.5)) {
    if (!isGroup && progress > 0) {
      drawTextWithShadow(ctx, text, textX, textY, textColor)
    } else {
      ctx.fillText(text, textX, textY)
    }
  }
}

/**
 * 바 외부 진행률 텍스트
 */
const drawExternalProgressText = (
  ctx: CanvasRenderingContext2D,
  task: Task,
  style: GanttBarStyle,
  text: string,
  offset: number,
  dateUnit: 'week' | 'month',
  isGroup: boolean
): void => {
  const progress = task.percentComplete || 0
  
  // 텍스트 색상 결정
  let textColor: string
  if (isGroup) {
    textColor = CANVAS_CONFIG.COLORS.TEXT_PRIMARY
  } else {
    textColor = getProgressColor(progress)
  }
  
  const fontSize = dateUnit === 'week' ? 'bold 11px Arial' : 'bold 12px Arial'
  
  applyTextStyle(ctx, {
    color: textColor,
    font: fontSize,
    align: 'left',
    baseline: 'middle'
  })
  
  const rightText = `(${text})`
  const textX = style.x + style.width + offset
  const textY = style.y + style.height / 2
  
  ctx.fillText(rightText, textX, textY)
}

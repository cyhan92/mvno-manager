import { Task } from '../../types/task'
import { GanttBarStyle, ProgressBarConfig, RenderOptions } from './types'
import { CANVAS_CONFIG, getProgressColor, getGroupStyle } from './config'
import { drawTextWithShadow, applyTextStyle } from './drawing'

/**
 * 둥근 모서리 사각형 그리기 (브라우저 호환성을 위한 폴리필)
 */
const drawRoundedRect = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
): void => {
  if (width < 2 * radius) radius = width / 2
  if (height < 2 * radius) radius = height / 2
  
  ctx.beginPath()
  ctx.moveTo(x + radius, y)
  ctx.arcTo(x + width, y, x + width, y + height, radius)
  ctx.arcTo(x + width, y + height, x, y + height, radius)
  ctx.arcTo(x, y + height, x, y, radius)
  ctx.arcTo(x, y, x + width, y, radius)
  ctx.closePath()
}

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
 * 그룹 간트 바 그리기 (대분류/소분류별로 차별화)
 */
export const drawGroupBar = (
  ctx: CanvasRenderingContext2D,
  task: Task,
  style: GanttBarStyle,
  level: number
): void => {
  const groupStyle = getGroupStyle(level)
  
  if (level === 0) {
    // 대분류 (level 0): 높이가 큰 직사각형 바 + 그룹 표시 패턴
    const barHeight = style.height * 0.8 // 기본 높이의 80%
    const barY = style.y + (style.height - barHeight) / 2 // 중앙 정렬
    
    // 배경 (회색 그라데이션 효과)
    const gradient = ctx.createLinearGradient(style.x, barY, style.x, barY + barHeight)
    gradient.addColorStop(0, '#f3f4f6')
    gradient.addColorStop(1, '#e5e7eb')
    ctx.fillStyle = gradient
    ctx.fillRect(style.x, barY, style.width, barHeight)
    
    // 진행률 표시 (파란색 계열)
    if (task.percentComplete && task.percentComplete > 0) {
      const progressWidth = (style.width * task.percentComplete) / 100
      const progressGradient = ctx.createLinearGradient(style.x, barY, style.x, barY + barHeight)
      progressGradient.addColorStop(0, '#3b82f6')
      progressGradient.addColorStop(1, '#1d4ed8')
      ctx.fillStyle = progressGradient
      ctx.fillRect(style.x, barY, progressWidth, barHeight)
    }
    
    // 두꺼운 테두리
    ctx.strokeStyle = '#374151'
    ctx.lineWidth = 3
    ctx.strokeRect(style.x, barY, style.width, barHeight)
    
    // 대분류 그룹 표시 패턴 (상단에 작은 사각형들)
    ctx.fillStyle = '#6b7280'
    const patternSize = 3
    const patternSpacing = 6
    for (let i = 0; i < Math.min(style.width / patternSpacing, 10); i++) {
      ctx.fillRect(style.x + i * patternSpacing + 2, barY - 2, patternSize, 2)
    }
    
  } else if (level === 1) {
    // 소분류 (level 1): 중간 높이의 모서리가 둥근 바 + 그룹 표시 아이콘
    const barHeight = style.height * 0.6 // 기본 높이의 60%
    const barY = style.y + (style.height - barHeight) / 2 // 중앙 정렬
    const cornerRadius = 4
    
    // 둥근 모서리 배경
    ctx.fillStyle = '#f9fafb'
    drawRoundedRect(ctx, style.x, barY, style.width, barHeight, cornerRadius)
    ctx.fill()
    
    // 진행률 표시 (초록색 계열)
    if (task.percentComplete && task.percentComplete > 0) {
      const progressWidth = (style.width * task.percentComplete) / 100
      ctx.fillStyle = '#10b981'
      drawRoundedRect(ctx, style.x, barY, progressWidth, barHeight, cornerRadius)
      ctx.fill()
    }
    
    // 중간 두께 테두리
    ctx.strokeStyle = '#6b7280'
    ctx.lineWidth = 2
    drawRoundedRect(ctx, style.x, barY, style.width, barHeight, cornerRadius)
    ctx.stroke()
    
    // 소분류 그룹 표시 아이콘 (우측에 작은 폴더 모양)
    if (style.width > 20) {
      ctx.fillStyle = '#9ca3af'
      const iconX = style.x + style.width - 12
      const iconY = barY + 2
      // 간단한 폴더 아이콘
      ctx.fillRect(iconX, iconY, 8, 6)
      ctx.fillRect(iconX + 1, iconY - 1, 3, 2)
    }
    
  } else {
    // 기존 코드 (level 2 이상 - 세부업무는 기존 drawTaskBar 사용)
    ctx.fillStyle = groupStyle.bg
    ctx.fillRect(style.x, style.y, style.width, style.height)
    
    if (task.percentComplete && task.percentComplete > 0) {
      const progressWidth = (style.width * task.percentComplete) / 100
      ctx.fillStyle = groupStyle.progress
      ctx.fillRect(style.x, style.y, progressWidth, style.height)
    }
    
    ctx.strokeStyle = groupStyle.border
    ctx.lineWidth = 2
    ctx.strokeRect(style.x, style.y, style.width, style.height)
  }
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

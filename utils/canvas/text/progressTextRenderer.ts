/**
 * 진행률 텍스트 렌더링 유틸리티
 */

import { Task } from '../../../types/task'
import { GanttBarStyle, ProgressBarConfig } from '../types'
import { CANVAS_CONFIG, getProgressColor } from '../config'
import { drawTextWithShadow, applyTextStyle } from '../drawing'

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
export const drawInternalProgressText = (
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
export const drawExternalProgressText = (
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

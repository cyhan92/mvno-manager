/**
 * 캔버스 UI 요소 렌더링 유틸리티
 * 헤더, 작업 행, 차트 테두리 등의 UI 요소를 담당
 */

import { CANVAS_CONFIG } from '../config'

/**
 * Action Item 헤더 그리기
 */
export const drawActionItemHeader = (
  ctx: CanvasRenderingContext2D,
  topMargin: number,
  leftMargin: number
): void => {
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

/**
 * 작업 행 그리기
 */
export const drawTaskRow = (
  ctx: CanvasRenderingContext2D,
  task: any,
  y: number,
  leftMargin: number,
  rowHeight: number,
  isGroup: boolean = false
): void => {
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

/**
 * 차트 테두리 그리기
 */
export const drawChartBorder = (
  ctx: CanvasRenderingContext2D,
  x: number = 0,
  y: number = 0,
  width: number,
  height: number
): void => {
  ctx.strokeStyle = CANVAS_CONFIG.COLORS.BORDER || '#d1d5db'
  ctx.lineWidth = 2
  ctx.strokeRect(x, y, width, height)
}

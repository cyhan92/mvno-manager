import { CanvasRenderContext, TextStyle } from './types'
import { CANVAS_CONFIG } from './config'

/**
 * 캔버스 배경 그리기
 */
export const drawBackground = (context: CanvasRenderContext): void => {
  const { ctx, width, height } = context
  ctx.fillStyle = CANVAS_CONFIG.COLORS.BACKGROUND
  ctx.fillRect(0, 0, width, height)
}

/**
 * 텍스트 스타일 적용
 */
export const applyTextStyle = (ctx: CanvasRenderingContext2D, style: TextStyle): void => {
  ctx.fillStyle = style.color
  ctx.font = style.font
  ctx.textAlign = style.align
  ctx.textBaseline = style.baseline
}

/**
 * 텍스트 그리기 (그림자 효과 포함)
 */
export const drawTextWithShadow = (
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  textColor: string,
  shadowColor: string = 'rgba(0, 0, 0, 0.3)',
  shadowOffset: number = 1
): void => {
  // 그림자 그리기
  ctx.fillStyle = shadowColor
  ctx.fillText(text, x + shadowOffset, y + shadowOffset)
  
  // 실제 텍스트 그리기
  ctx.fillStyle = textColor
  ctx.fillText(text, x, y)
}

/**
 * 둥근 모서리 사각형 그리기
 */
export const drawRoundedRect = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
): void => {
  ctx.beginPath()
  ctx.moveTo(x + radius, y)
  ctx.lineTo(x + width - radius, y)
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius)
  ctx.lineTo(x + width, y + height - radius)
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height)
  ctx.lineTo(x + radius, y + height)
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius)
  ctx.lineTo(x, y + radius)
  ctx.quadraticCurveTo(x, y, x + radius, y)
  ctx.closePath()
}

/**
 * 그라데이션 생성
 */
export const createLinearGradient = (
  ctx: CanvasRenderingContext2D,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  colorStops: { position: number; color: string }[]
): CanvasGradient => {
  const gradient = ctx.createLinearGradient(x1, y1, x2, y2)
  colorStops.forEach(stop => {
    gradient.addColorStop(stop.position, stop.color)
  })
  return gradient
}

/**
 * 텍스트 너비 측정
 */
export const measureText = (ctx: CanvasRenderingContext2D, text: string): number => {
  return ctx.measureText(text).width
}

/**
 * 텍스트를 지정된 너비에 맞게 자르기
 */
export const truncateText = (
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
  ellipsis: string = '...'
): string => {
  if (measureText(ctx, text) <= maxWidth) {
    return text
  }
  
  let truncated = text
  while (measureText(ctx, truncated + ellipsis) > maxWidth && truncated.length > 0) {
    truncated = truncated.slice(0, -1)
  }
  
  return truncated + ellipsis
}

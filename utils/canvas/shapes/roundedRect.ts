/**
 * 둥근 모서리 그리기 유틸리티
 */

/**
 * 둥근 모서리 사각형 그리기 (브라우저 호환성을 위한 폴리필)
 */
export const drawRoundedRect = (
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

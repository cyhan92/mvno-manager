// Canvas 렌더링 모듈의 공개 API
export * from './types'
export * from './config'
export * from './drawing'
export * from './gantt'
export * from './chart'

// Legacy functions - fully migrated to new modules
export { 
  drawGridLines,
  drawActionItemHeader,
  drawTaskRow,
  drawGanttBar,
  drawChartBorder 
} from './legacy'

// Legacy drawBackground wrapper for backward compatibility
export const drawBackground = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number
) => {
  const context = { ctx, width, height }
  const { drawBackground: newDrawBackground } = require('./drawing')
  newDrawBackground(context)
}

// 주요 함수들의 단축 export
export {
  drawTextWithShadow,
  applyTextStyle,
  truncateText
} from './drawing'

export {
  calculateBarPosition,
  drawGroupBar,
  drawTaskBar,
  drawProgressText
} from './gantt'

export {
  CANVAS_CONFIG,
  getStatusColors,
  getProgressColor,
  getGroupStyle
} from './config'

// Chart utilities
export {
  calculateDateRange,
  calculateCanvasDimensions,
  CHART_CONFIG
} from './chart'

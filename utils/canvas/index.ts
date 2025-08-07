// Canvas 렌더링 모듈의 공개 API
export * from './types'
export * from './config'
export * from './drawing'
export * from './chart'

// 리팩토링된 모듈들에서 함수 import
export { 
  drawGridLines,
  drawActionItemHeader,
  drawTaskRow,
  drawLegacyGanttBar as drawGanttBar,
  drawChartBorder,
  drawTodayLine,
  calculateBarPosition,
  drawGroupBar,
  drawTaskBar,
  drawProgressText
} from './refactored'

export {
  CANVAS_CONFIG,
  getStatusColors,
  getProgressColor,
  getGroupStyle
} from './config'

// Chart utilities
export {
  calculateDateRange,
  calculateInitialViewport,
  calculateCanvasDimensions,
  CHART_CONFIG
} from './chart'

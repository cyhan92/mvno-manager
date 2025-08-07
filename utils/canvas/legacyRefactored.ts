/**
 * 리팩토링된 Legacy 캔버스 유틸리티
 * 기존 legacy.ts를 기능별로 분리하여 재구성한 모듈
 */

import { DateUnit } from '../../types/task'
import { 
  generateMonthHeaders, 
  generateWeekHeaders,
  drawGridLines,
  drawActionItemHeader,
  drawTaskRow,
  drawChartBorder,
  drawTodayLine,
  drawLegacyGanttBar
} from './refactored'

// 기존 호환성을 위한 모든 함수 재내보내기
export {
  generateMonthHeaders,
  generateWeekHeaders,
  drawGridLines,
  drawActionItemHeader,
  drawTaskRow,
  drawChartBorder,
  drawTodayLine,
  drawLegacyGanttBar as drawGanttBar
}

// 기존 legacy.ts와 동일한 인터페이스 유지
export const drawGridLines_legacy = drawGridLines
export const drawActionItemHeader_legacy = drawActionItemHeader
export const drawTaskRow_legacy = drawTaskRow
export const drawGanttBar_legacy = drawLegacyGanttBar
export const drawChartBorder_legacy = drawChartBorder
export const drawTodayLine_legacy = drawTodayLine

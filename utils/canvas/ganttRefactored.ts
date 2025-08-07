/**
 * 리팩토링된 Gantt 캔버스 유틸리티
 * 기존 gantt.ts를 기능별로 분리하여 재구성한 모듈
 */

import { Task } from '../../types/task'
import { GanttBarStyle, ProgressBarConfig } from './types'
import { 
  calculateBarPosition,
  drawGroupBar,
  drawTaskBar,
  drawProgressText,
  drawRoundedRect
} from './refactored'

// 기존 호환성을 위한 모든 함수 재내보내기
export {
  calculateBarPosition,
  drawGroupBar,
  drawTaskBar,
  drawProgressText,
  drawRoundedRect
}

// 기존 gantt.ts와 동일한 인터페이스 유지
export const calculateBarPosition_refactored = calculateBarPosition
export const drawGroupBar_refactored = drawGroupBar
export const drawTaskBar_refactored = drawTaskBar
export const drawProgressText_refactored = drawProgressText

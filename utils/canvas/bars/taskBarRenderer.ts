/**
 * 개별 작업 간트 바 렌더링 유틸리티
 */

import { Task } from '../../../types/task'
import { GanttBarStyle } from '../types'
import { CANVAS_CONFIG, getProgressColor } from '../config'

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

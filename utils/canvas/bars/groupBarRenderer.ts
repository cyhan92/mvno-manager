/**
 * 그룹 간트 바 렌더링 유틸리티
 */

import { Task } from '../../../types/task'
import { GanttBarStyle } from '../types'
import { getGroupStyle } from '../config'
import { drawRoundedRect } from '../shapes/roundedRect'

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

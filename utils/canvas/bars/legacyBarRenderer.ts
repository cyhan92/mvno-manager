/**
 * 레거시 간트 바 렌더링 유틸리티
 * 기존 legacy.ts의 drawGanttBar 로직을 포함
 */

import { DateUnit } from '../../../types/task'
import { CANVAS_CONFIG } from '../config'

/**
 * 레거시 간트 바 그리기 (기존 구현 유지)
 */
export const drawLegacyGanttBar = (
  ctx: CanvasRenderingContext2D,
  task: any,
  startDate: Date,
  timeRange: number,
  chartWidth: number,
  y: number,
  dateUnit: DateUnit = 'month',
  leftMargin: number = 0
): void => {
  // 간단한 바 위치 계산
  const taskStart = task.start.getTime()
  const taskEnd = task.end.getTime()
  const startDateMs = startDate.getTime()
  
  const x = leftMargin + ((taskStart - startDateMs) / timeRange) * chartWidth
  const width = ((taskEnd - taskStart) / timeRange) * chartWidth
  const height = 20 // 기본 바 높이
  
  // ROW_HEIGHT(40px)의 중앙에 바 위치 맞춤
  const barY = y + 10 // (40 - 20) / 2 = 10px 오프셋으로 중앙 정렬
  
  // isGroup 판별을 더 정확하게 - hasChildren이 있거나 명시적으로 isGroup인 경우만
  const isGroup = task.isGroup || task.hasChildren || false
  const progress = task.percentComplete || 0
  
  if (isGroup) {
    // 그룹 바 - 새로운 drawGroupBar 함수 사용
    const { drawGroupBar, calculateBarPosition } = require('../gantt')
    const style = calculateBarPosition(task, startDate, new Date(startDate.getTime() + timeRange), timeRange, chartWidth, y, 40)
    // leftMargin 보정
    style.x += leftMargin
    drawGroupBar(ctx, task, style, task.level || 0)
  } else {
    // 작업 바
    const progressWidth = (width * progress) / 100
    
    // 전체 바 배경 - 0% 작업도 명확히 보이도록 배경색 조정
    if (progress === 0) {
      ctx.fillStyle = '#f3f4f6' // 0% 작업은 밝은 회색으로 변경 (텍스트 가독성 향상)
    } else {
      ctx.fillStyle = CANVAS_CONFIG.COLORS.TASK_BAR_BG
    }
    ctx.fillRect(x, barY, width, height)
    
    // 진행된 부분
    if (progress > 0) {
      if (progress >= 100) {
        ctx.fillStyle = '#22c55e' // 완료된 작업 색상
      } else if (progress >= 50) {
        ctx.fillStyle = '#3b82f6' // 진행 중 작업 색상
      } else {
        ctx.fillStyle = '#f59e0b' // 시작 단계 작업 색상
      }
      ctx.fillRect(x, barY, progressWidth, height)
    }
  }
  
  // 바 테두리
  ctx.strokeStyle = CANVAS_CONFIG.COLORS.BORDER
  ctx.lineWidth = 1
  ctx.strokeRect(x, barY, width, height)
  
  // 진행률 텍스트 표시 - 0%도 포함하여 표시
  if (progress >= 0) { // 0% 이상 모든 진행률 표시
    const progressText = progress >= 100 ? `${Math.round(progress)}% - 완료` : `${Math.round(progress)}%`
    
    // 텍스트 스타일 설정 - 폰트 크기 증가
    ctx.font = dateUnit === 'week' ? 'bold 14px Arial' : 'bold 13px Arial'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    
    // 텍스트 위치 계산 - barY 사용
    const textX = x + width / 2
    const textY = barY + height / 2
    
    // 100% 완료 텍스트는 더 넓은 공간이 필요하므로 조건 조정
    const minWidthForInternalText = progress >= 100 ? 60 : 30
    
    if (width > minWidthForInternalText) {
      // 바 안에 텍스트 표시 - 배경색에 따른 대비 색상 로직
      let textColor = '#1f2937' // 기본 어두운 색상
      
      if (isGroup) {
        // 그룹 바: 진행률에 따른 배경색을 고려한 텍스트 색상
        if (progress >= 80) {
          // 진한 회색 배경(#6b7280)에는 흰색 텍스트
          textColor = '#ffffff'
        } else {
          // 밝은 배경에는 어두운 텍스트
          textColor = '#1f2937'
        }
      } else {
        // 개별 작업 바: 진행률과 배경색에 따른 텍스트 색상
        if (progress >= 100) {
          // 완료된 작업(#22c55e, 녹색)에는 흰색 텍스트
          textColor = '#ffffff'
        } else if (progress >= 80) {
          // 높은 진행률(#3b82f6, 파란색)에는 흰색 텍스트
          textColor = '#ffffff'
        } else if (progress >= 50) {
          // 중간 진행률(#3b82f6, 파란색)에는 흰색 텍스트
          textColor = '#ffffff'
        } else if (progress > 0) {
          // 낮은 진행률(#f59e0b, 주황색)에는 어두운 텍스트
          textColor = '#1f2937'
        } else {
          // 0% 진행률(#f3f4f6, 밝은 회색)에는 어두운 텍스트
          textColor = '#1f2937'
        }
      }
      
      // 텍스트 그리기 - 그림자 효과 제거
      ctx.fillStyle = textColor
      ctx.fillText(progressText, textX, textY)
    } else {
      // 작은 바의 경우 바 오른쪽에 텍스트 표시 - 폰트 크기 증가
      ctx.font = dateUnit === 'week' ? 'bold 12px Arial' : 'bold 11px Arial'
      ctx.textAlign = 'left'
      
      // 100% 완료인 경우 진한 녹색, 그 외는 진한 회색
      const externalTextColor = progress >= 100 ? '#166534' : '#374151' // 진한 녹색 또는 진한 회색
      ctx.fillStyle = externalTextColor
      
      ctx.fillText(`(${progressText})`, x + width + 3, textY)
    }
  }
}

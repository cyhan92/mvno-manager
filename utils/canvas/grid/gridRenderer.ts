/**
 * 캔버스 그리드 라인 렌더링 유틸리티
 */

import { DateUnit } from '../../../types/task'
import { generateMonthHeaders, generateWeekHeaders, HeaderItem } from '../headers/headerGenerators'

/**
 * 그리드 라인 그리기
 */
export const drawGridLines = (
  ctx: CanvasRenderingContext2D,
  dateUnit: DateUnit,
  startDate: Date,
  endDate: Date,
  timeRange: number,
  chartWidth: number,
  canvasHeight: number,
  leftMargin: number = 0
): void => {
  if (dateUnit === 'month') {
    const months = generateMonthHeaders(startDate, endDate)
    
    months.forEach((month: HeaderItem) => {
      // 월 끝 지점 점선만 표시 (가독성을 위해 시작 지점 제거)
      const endX = leftMargin + ((month.end - startDate.getTime()) / timeRange) * chartWidth
      ctx.strokeStyle = '#d1d5db' // 연한 회색
      ctx.lineWidth = 1
      ctx.setLineDash([4, 4]) // 점선 패턴
      ctx.beginPath()
      ctx.moveTo(endX, 0)
      ctx.lineTo(endX, canvasHeight)
      ctx.stroke()
      
      // 점선 패턴 리셋
      ctx.setLineDash([])
    })
  } else if (dateUnit === 'week') {
    const weeks = generateWeekHeaders(startDate, endDate)
    
    weeks.forEach((week: HeaderItem, index: number) => {
      // 주 끝 지점에 점선만 표시 (시작 지점 실선 제거)
      const endX = leftMargin + ((week.end - startDate.getTime()) / timeRange) * chartWidth
      
      // 주 끝선 - 점선으로 구분 (점선만 유지)
      ctx.strokeStyle = '#d1d5db' // 연한 회색
      ctx.lineWidth = 1
      ctx.setLineDash([2, 2]) // 점선 패턴
      ctx.beginPath()
      ctx.moveTo(endX, 0)
      ctx.lineTo(endX, canvasHeight)
      ctx.stroke()
      
      // 점선 패턴 리셋
      ctx.setLineDash([])
    })
  }
}

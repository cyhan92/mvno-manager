/**
 * 오늘 날짜 표시 유틸리티
 */

/**
 * 오늘 날짜를 나타내는 빨간 세로선 그리기
 */
export const drawTodayLine = (
  ctx: CanvasRenderingContext2D,
  startDate: Date,
  timeRange: number,
  chartWidth: number,
  chartHeight: number,
  leftMargin: number = 0
): void => {
  const today = new Date()
  today.setHours(0, 0, 0, 0) // 시간을 00:00:00으로 정규화
  const todayMs = today.getTime()
  const startDateMs = startDate.getTime()
  
  // 오늘 날짜가 차트 범위 내에 있는지 확인
  if (todayMs >= startDateMs && todayMs <= (startDateMs + timeRange)) {
    // 오늘 날짜의 x 위치 계산
    const x = leftMargin + ((todayMs - startDateMs) / timeRange) * chartWidth
    
    // 빨간 세로선 그리기
    ctx.beginPath()
    ctx.strokeStyle = '#ef4444' // 빨간색
    ctx.lineWidth = 2
    ctx.moveTo(x, 0)
    ctx.lineTo(x, chartHeight)
    ctx.stroke()
    
    // 오늘 날짜 라벨 추가
    ctx.fillStyle = '#ef4444'
    ctx.font = 'bold 12px Arial'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'top'
    
    const todayLabel = '오늘'
    const labelY = 5
    
    // 라벨 배경 (가독성을 위해)
    const labelWidth = ctx.measureText(todayLabel).width + 8
    const labelHeight = 16
    ctx.fillStyle = 'rgba(239, 68, 68, 0.9)'
    ctx.fillRect(x - labelWidth / 2, labelY, labelWidth, labelHeight)
    
    // 라벨 텍스트
    ctx.fillStyle = '#ffffff'
    ctx.fillText(todayLabel, x, labelY + 3)
  }
}

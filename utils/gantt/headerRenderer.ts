import { DateUnit } from '../../types/task'

interface HeaderItem {
  label: string
  start: number
  end: number
  weekNumber?: number
}

interface RenderHeaderParams {
  canvas: HTMLCanvasElement
  ctx: CanvasRenderingContext2D
  dateUnit: DateUnit
  headers: HeaderItem[]
  chartWidth: number
  startTime: number
  endTime: number
}

export const renderHeaderToCanvas = ({
  canvas,
  ctx,
  dateUnit,
  headers,
  chartWidth,
  startTime,
  endTime
}: RenderHeaderParams) => {
  // 캔버스 설정
  canvas.width = chartWidth
  canvas.height = 80

  // 모든 스타일을 강제로 초기화 (매우 중요!)
  canvas.removeAttribute('style')
  
  // 기본 스타일 설정
  canvas.style.width = `${chartWidth}px`
  canvas.style.height = '80px'

  if (dateUnit === 'week') {
    canvas.style.minWidth = '1800px'
    canvas.style.maxWidth = 'none'
  } else {
    canvas.style.minWidth = `${chartWidth}px` // 고정 최소 너비 설정
    canvas.style.maxWidth = 'none'
  }

  // 배경 클리어
  ctx.clearRect(0, 0, chartWidth, 80)

  // 배경색 설정
  ctx.fillStyle = '#f8fafc'
  ctx.fillRect(0, 0, chartWidth, 80)

  const timeRange = endTime - startTime

  headers.forEach((header, index) => {
    const startPosition = ((header.start - startTime) / timeRange) * chartWidth
    const endPosition = ((header.end - startTime) / timeRange) * chartWidth
    const width = endPosition - startPosition

    // 헤더 셀 배경
    ctx.fillStyle = index % 2 === 0 ? '#ffffff' : '#f1f5f9'
    ctx.fillRect(startPosition, 0, width, 80)

    // 헤더 셀 테두리
    ctx.strokeStyle = '#e2e8f0'
    ctx.lineWidth = 1
    ctx.strokeRect(startPosition, 0, width, 80)

    // 텍스트 렌더링
    ctx.fillStyle = '#374151'
    ctx.font = dateUnit === 'week' ? 'bold 12px -apple-system, BlinkMacSystemFont, sans-serif' : 'bold 14px -apple-system, BlinkMacSystemFont, sans-serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'

    const textX = startPosition + width / 2
    const textY = 40

    // 긴 텍스트 처리 (주별 모드에서 텍스트가 길 경우)
    if (dateUnit === 'week' && width < 80) {
      // 너비가 좁으면 축약된 형태로 표시
      const shortLabel = header.label.replace('월 ', '/').replace('일', '')
      ctx.fillText(shortLabel, textX, textY)
    } else {
      ctx.fillText(header.label, textX, textY)
    }
  })

  // 전체 테두리
  ctx.strokeStyle = '#d1d5db'
  ctx.lineWidth = 2
  ctx.strokeRect(0, 0, chartWidth, 80)
}

export const calculateChartDimensions = (dateUnit: DateUnit, chartWidth?: number) => {
  let finalChartWidth: number
  
  if (chartWidth && chartWidth > 0) {
    // 메인 차트에서 이미 계산된 최종 너비 사용 (중복 확장 방지)
    finalChartWidth = chartWidth
  } else {
    // fallback: 자체 계산 - 고정 너비 사용 (메인 차트와 동일한 로직)
    if (dateUnit === 'month') {
      // 월별 모드: 고정된 최소 너비 사용 (1000px)
      finalChartWidth = 1000
    } else {
      // 주별 모드: 기본 너비를 확장할 예정이므로 1200px 사용
      finalChartWidth = 1200
    }
  }

  return finalChartWidth
}

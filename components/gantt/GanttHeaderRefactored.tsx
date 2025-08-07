import { useEffect, useRef } from 'react'
import { generateWeekHeaders, generateMonthHeaders } from '../../utils/gantt/headerGenerators'
import { renderHeaderToCanvas, calculateChartDimensions } from '../../utils/gantt/headerRenderer'
import type { DateUnit } from '../../types/task'

interface GanttHeaderProps {
  dateUnit: DateUnit
  startTime: number
  endTime: number
  chartWidth?: number
}

const GanttHeaderRefactored = ({ dateUnit, startTime, endTime, chartWidth }: GanttHeaderProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // 헤더 데이터 생성 (timestamp를 Date로 변환)
    const startDate = new Date(startTime)
    const endDate = new Date(endTime)
    
    let headers
    switch (dateUnit) {
      case 'week':
        headers = generateWeekHeaders(startDate, endDate)
        break
      case 'month':
        headers = generateMonthHeaders(startDate, endDate)
        break
      default:
        headers = generateWeekHeaders(startDate, endDate)
    }
    
    // 차트 너비 계산
    const finalChartWidth = calculateChartDimensions(dateUnit, chartWidth)

    // 캔버스에 헤더 렌더링
    renderHeaderToCanvas({
      canvas,
      ctx,
      dateUnit,
      headers,
      chartWidth: finalChartWidth,
      startTime,
      endTime
    })
  }, [dateUnit, startTime, endTime, chartWidth])

  return (
    <div className="flex-shrink-0">
      <canvas 
        ref={canvasRef}
        className="border border-gray-300 bg-slate-50 block"
      />
    </div>
  )
}

export default GanttHeaderRefactored

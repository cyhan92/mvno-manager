import React, { useEffect, useRef } from 'react'
import { DateUnit } from '../../types/task'
import { styles } from '../../styles'
import { calculateDateRange } from '../../utils/canvas'

// 월별 헤더 생성 함수 (legacy.ts와 동일한 로직)
const generateMonthHeaders = (startDate: Date, endDate: Date) => {
  const months = []
  const current = new Date(startDate.getFullYear(), startDate.getMonth(), 1)
  
  while (current <= endDate) {
    const monthStart = new Date(current)
    const monthEnd = new Date(current.getFullYear(), current.getMonth() + 1, 0) // 해당 월의 마지막 날
    
    months.push({
      start: monthStart.getTime(),
      end: monthEnd.getTime(),
      label: `${current.getFullYear()}.${String(current.getMonth() + 1).padStart(2, '0')}`
    })
    current.setMonth(current.getMonth() + 1)
  }
  
  return months
}

interface GanttHeaderProps {
  displayTasks: any[]
  dateUnit: DateUnit
  expandedNodesSize: number
  scrollRef: React.RefObject<HTMLDivElement | null>
}

const GanttHeader: React.FC<GanttHeaderProps> = ({
  displayTasks,
  dateUnit,
  expandedNodesSize,
  scrollRef
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const renderTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // 헤더 렌더링 함수
  const renderHeader = () => {
    const canvas = canvasRef.current
    if (!canvas || displayTasks.length === 0) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // 헤더 캔버스 크기 설정
    const container = scrollRef.current
    if (!container) return

    const containerWidth = container.clientWidth
    canvas.width = containerWidth
    canvas.height = 80
    canvas.style.width = `${containerWidth}px`
    canvas.style.height = '80px'

    // 주별 표시시 캔버스 확장
    let canvasWidth = containerWidth
    if (dateUnit === 'week') {
      canvasWidth = Math.max(containerWidth * 4, 1200)
      canvas.width = canvasWidth
      canvas.style.width = `${canvasWidth}px`
    }

    // 날짜 헤더 그리기
    const validTasks = displayTasks.filter(t => t && t.start && t.end)
    if (validTasks.length > 0) {
      // calculateDateRange 함수를 사용하여 일관된 날짜 범위 계산
      const { startDate, endDate, timeRange } = calculateDateRange(validTasks)
      
      // 간트 바와 동일한 chartWidth 계산 방식 사용
      const leftMargin = 0  // leftMargin을 0으로 변경
      let chartWidth = containerWidth
      
      // 주별 표시시 확대 (간트 바와 동일한 로직)
      if (dateUnit === 'week') {
        chartWidth = Math.max(chartWidth * 4, 1200)
      }
      
      // 배경
      ctx.fillStyle = '#f9fafb'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      
      // 날짜 헤더 그리기
      if (dateUnit === 'month') {
        // 월별 헤더 - legacy.ts와 동일한 generateMonthHeaders 사용
        const months = generateMonthHeaders(startDate, endDate)
        
        ctx.font = 'bold 14px Arial'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillStyle = '#1f2937'
        
        months.forEach((month, index) => {
          const x = leftMargin + ((month.start - startDate.getTime()) / timeRange) * chartWidth
          const width = ((month.end - month.start) / timeRange) * chartWidth
          ctx.fillText(month.label, x + width / 2, 40)
          
          // 월 끝 지점 구분선만 표시 (가독성을 위해 시작 지점 제거)
          const endX = leftMargin + ((month.end - startDate.getTime()) / timeRange) * chartWidth
          ctx.strokeStyle = '#d1d5db' // 연한 회색
          ctx.lineWidth = 1
          ctx.setLineDash([4, 4]) // 점선 패턴
          ctx.beginPath()
          ctx.moveTo(endX, 0)
          ctx.lineTo(endX, 80)
          ctx.stroke()
          
          // 점선 패턴 리셋
          ctx.setLineDash([])
        })
      } else {
        // 주별 헤더
        const weeks = []
        const currentWeek = new Date(startDate)
        const dayOfWeek = currentWeek.getDay()
        
        // 해당 주의 월요일로 이동
        currentWeek.setDate(currentWeek.getDate() - dayOfWeek + 1)
        
        while (currentWeek <= endDate) {
          const weekStart = currentWeek.getTime()
          const nextWeek = new Date(currentWeek)
          nextWeek.setDate(nextWeek.getDate() + 7)
          const weekEnd = Math.min(nextWeek.getTime(), endDate.getTime())
          
          weeks.push({
            start: weekStart,
            end: weekEnd,
            label: `${currentWeek.getMonth() + 1}/${currentWeek.getDate()}`
          })
          
          currentWeek.setDate(currentWeek.getDate() + 7)
        }
        
        ctx.font = '12px Arial'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillStyle = '#1f2937'
        
        weeks.forEach((week, index) => {
          const x = leftMargin + ((week.start - startDate.getTime()) / timeRange) * chartWidth
          const width = ((week.end - week.start) / timeRange) * chartWidth
          ctx.fillText(week.label, x + width / 2, 40)
          
          // 구분선
          ctx.strokeStyle = index % 2 === 0 ? '#d1d5db' : '#9ca3af'
          ctx.lineWidth = index % 2 === 0 ? 2 : 1
          ctx.beginPath()
          ctx.moveTo(x, 0)
          ctx.lineTo(x, 80)
          ctx.stroke()
        })
      }
      
      // 오늘 날짜 표시 (월별, 주별 모두)
      const today = new Date()
      today.setHours(0, 0, 0, 0) // 시간을 00:00:00으로 설정하여 정확한 비교
      
      if (today >= startDate && today <= endDate) {
        const todayX = leftMargin + ((today.getTime() - startDate.getTime()) / timeRange) * chartWidth
        
        // 오늘 날짜 세로선
        ctx.strokeStyle = '#ef4444' // 빨간색
        ctx.lineWidth = 2
        ctx.setLineDash([]) // 실선
        ctx.beginPath()
        ctx.moveTo(todayX, 0)
        ctx.lineTo(todayX, 80)
        ctx.stroke()
        
        // 오늘 날짜 표시
        ctx.fillStyle = '#ef4444'
        ctx.font = 'bold 10px Arial'
        ctx.textAlign = 'center'
        ctx.fillText('오늘', todayX, 70)
      }
    }
  }

  // 스크롤 이벤트 핸들러
  useEffect(() => {
    const container = scrollRef.current
    if (!container) return

    const handleScroll = () => {
      // 스크롤 시 헤더 다시 렌더링
      if (renderTimeoutRef.current) {
        clearTimeout(renderTimeoutRef.current)
      }
      
      renderTimeoutRef.current = setTimeout(() => {
        renderHeader()
      }, 16) // 60fps로 제한
    }

    container.addEventListener('scroll', handleScroll)
    return () => {
      container.removeEventListener('scroll', handleScroll)
      if (renderTimeoutRef.current) {
        clearTimeout(renderTimeoutRef.current)
      }
    }
  }, [displayTasks, dateUnit, expandedNodesSize])

  // 초기 렌더링 및 props 변경 시 재렌더링
  useEffect(() => {
    renderHeader()
  }, [displayTasks, dateUnit, expandedNodesSize])

  return (
    <div 
      ref={scrollRef}
      className={`${styles.ganttChartHeader} flex-shrink-0`}
    >
      <canvas 
        ref={canvasRef}
        key={`header-${displayTasks.length}-${expandedNodesSize}`}
        style={{ display: 'block' }}
      />
    </div>
  )
}

export default GanttHeader

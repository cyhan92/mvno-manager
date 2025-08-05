'use client'
import React, { useEffect, useRef } from 'react'
import { Task, DateUnit } from '../../types/task'
import { styles } from '../../styles'
import { calculateDateRange, calculateCanvasDimensions } from '../../utils/canvas'

// 월별 헤더 생성 함수
const generateMonthHeaders = (startDate: Date, endDate: Date) => {
  const months = []
  const current = new Date(startDate.getFullYear(), startDate.getMonth(), 1)
  
  while (current <= endDate) {
    const monthStart = new Date(current)
    const monthEnd = new Date(current.getFullYear(), current.getMonth() + 1, 0)
    
    const monthLabel = current.toLocaleDateString('ko-KR', { 
      year: 'numeric', 
      month: 'short' 
    })
    
    months.push({
      label: monthLabel,
      start: monthStart.getTime(),
      end: monthEnd.getTime()
    })
    
    current.setMonth(current.getMonth() + 1)
  }
  
  return months
}

// 주별 헤더 생성 함수 (개선된 구현)
const generateWeekHeaders = (startDate: Date, endDate: Date) => {
  const weeks = []
  const current = new Date(startDate)
  
  // 시작 날짜를 주의 시작일(월요일)로 조정
  const dayOfWeek = current.getDay()
  const adjustedStart = new Date(current)
  adjustedStart.setDate(current.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1))
  
  let weekStart = new Date(adjustedStart)
  let weekNumber = 1
  
  while (weekStart < endDate) {
    const weekEnd = new Date(weekStart)
    weekEnd.setDate(weekStart.getDate() + 6) // 일주일 끝
    
    // 더 명확한 주별 라벨 생성
    const startMonth = weekStart.getMonth() + 1
    const startDay = weekStart.getDate()
    const endMonth = weekEnd.getMonth() + 1
    const endDay = weekEnd.getDate()
    
    let weekLabel = ''
    if (startMonth === endMonth) {
      // 같은 달 내의 주
      weekLabel = `${startMonth}/${startDay}-${endDay}`
    } else {
      // 월을 넘나드는 주
      weekLabel = `${startMonth}/${startDay}~${endMonth}/${endDay}`
    }
    
    weeks.push({
      label: weekLabel,
      start: weekStart.getTime(),
      end: weekEnd.getTime(),
      weekNumber: weekNumber
    })
    
    // 다음 주로 이동
    weekStart = new Date(weekStart)
    weekStart.setDate(weekStart.getDate() + 7)
    weekNumber++
  }
  
  return weeks
}

interface GanttHeaderProps {
  displayTasks: Task[]
  dateUnit: DateUnit
  expandedNodesSize: number
  scrollRef: React.RefObject<HTMLDivElement | null>
  renderTrigger: number
  containerRef?: React.RefObject<HTMLDivElement | null>
  chartWidth?: number // 메인 차트에서 계산된 최종 너비
  onScroll?: (e: React.UIEvent<HTMLDivElement>) => void // 스크롤 핸들러 추가
}

const GanttHeader: React.FC<GanttHeaderProps> = ({
  displayTasks,
  dateUnit,
  expandedNodesSize,
  scrollRef,
  renderTrigger,
  containerRef,
  chartWidth, // 메인 차트에서 전달받은 최종 너비
  onScroll // 스크롤 핸들러 추가
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const observerRef = useRef<MutationObserver | null>(null)
  const renderTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // 헤더 렌더링 함수
  const renderHeader = () => {
    console.log(`🎯 [DEBUG] GanttHeader renderHeader called - dateUnit: ${dateUnit}, tasks: ${displayTasks.length}`)
    
    const canvas = canvasRef.current
    const container = scrollRef.current
    if (!canvas || !container) {
      console.log('❌ [DEBUG] GanttHeader early return - missing canvas or container')
      return
    }

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // 메인 차트에서 전달받은 chartWidth가 있으면 우선 사용
    let finalChartWidth: number
    
    if (chartWidth && chartWidth > 0) {
      // 메인 차트에서 이미 계산된 최종 너비 사용 (중복 확장 방지)
      finalChartWidth = chartWidth
      console.log(`🎯 [DEBUG] GanttHeader using provided chartWidth: ${finalChartWidth}, dateUnit: ${dateUnit}`)
    } else {
      // fallback: 자체 계산 - 고정 너비 사용 (메인 차트와 동일한 로직)
      if (dateUnit === 'month') {
        // 월별 모드: 고정된 최소 너비 사용 (1000px)
        finalChartWidth = 1000
        console.log(`🎯 [DEBUG] GanttHeader MONTH fallback - using fixed width: ${finalChartWidth}px`)
      } else {
        // 주별 모드: 기본 너비를 확장할 예정이므로 1200px 사용
        finalChartWidth = 1200
        console.log(`🎯 [DEBUG] GanttHeader WEEK fallback - using fixed width: ${finalChartWidth}px`)
      }
    }

    canvas.width = finalChartWidth
    canvas.height = 80

    // 모든 스타일을 강제로 초기화 (매우 중요!)
    canvas.removeAttribute('style')
    
    // 기본 스타일 설정
    canvas.style.width = `${finalChartWidth}px`
    canvas.style.height = '80px'

    if (dateUnit === 'week') {
      canvas.style.minWidth = '1800px'
      canvas.style.maxWidth = 'none'
      console.log(`🎯 [DEBUG] GanttHeader applying week styles - width: ${finalChartWidth}px`)
    } else {
      canvas.style.minWidth = `${finalChartWidth}px` // 고정 최소 너비 설정
      canvas.style.maxWidth = 'none'
      console.log(`🎯 [DEBUG] GanttHeader applying month styles - width: ${finalChartWidth}px (fixed width)`)
    }

    const validTasks = displayTasks.filter(task => task.start && task.end)
    if (validTasks.length === 0) return

    const dateRange = calculateDateRange(validTasks)
    if (!dateRange) return

    const { startDate, endDate, timeRange } = dateRange

    if (timeRange <= 0) return

    // 배경 그리기
    ctx.fillStyle = '#f7f7f7'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    const leftMargin = 0

    // 월별/주별 구분선과 라벨 그리기
    let headers = []
    if (dateUnit === 'month') {
      headers = generateMonthHeaders(startDate, endDate)
    } else {
      headers = generateWeekHeaders(startDate, endDate)
    }
    
    ctx.font = dateUnit === 'week' ? '12px Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' : '14px Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
    ctx.fillStyle = '#374151'
    ctx.textAlign = 'center'

    headers.forEach((header) => {
        const x = leftMargin + ((header.start - startDate.getTime()) / timeRange) * finalChartWidth
        const width = ((header.end - header.start) / timeRange) * finalChartWidth
        
        // 헤더 라벨 그리기
        ctx.fillText(header.label, x + width / 2, dateUnit === 'week' ? 30 : 40)

        // 세로선 그리기 - 구간 끝에만 (모든 모드에서 점선 사용)
        const endX = leftMargin + ((header.end - startDate.getTime()) / timeRange) * finalChartWidth
        ctx.strokeStyle = dateUnit === 'week' ? '#d1d5db' : '#e5e7eb' // 주별도 연한 회색으로 변경
        ctx.lineWidth = 1 // 주별도 1px로 변경
        
        // 모든 모드에서 점선 사용
        ctx.setLineDash([2, 2]) // 주별도 점선 패턴
        
        ctx.beginPath()
        ctx.moveTo(endX, 0)
        ctx.lineTo(endX, canvas.height)
        ctx.stroke()
        
        // 점선 패턴 리셋
        ctx.setLineDash([])
    })

    // 오늘 날짜 세로선
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    if (today >= startDate && today <= endDate) {
      const todayX = leftMargin + ((today.getTime() - startDate.getTime()) / timeRange) * finalChartWidth
      ctx.strokeStyle = '#ef4444'
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(todayX, 0)
      ctx.lineTo(todayX, canvas.height)
      ctx.stroke()
    }
  }

  // 초기 렌더링
  useEffect(() => {
    const syncRender = () => {
      requestAnimationFrame(() => {
        renderHeader()
      })
    }
    
    const timer = setTimeout(syncRender, 120)
    
    return () => {
      clearTimeout(timer)
    }
  }, [displayTasks.length, dateUnit, expandedNodesSize, renderTrigger, chartWidth]) // 배열 대신 길이 사용

  // DOM 변경 감지
  useEffect(() => {
    const container = scrollRef.current
    if (!container) return

    let renderTimeout: NodeJS.Timeout | null = null
    
    observerRef.current = new MutationObserver((mutations) => {
      let shouldRerender = false
      
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          if (mutation.addedNodes.length > 0 || mutation.removedNodes.length > 0) {
            shouldRerender = true
          }
        }
      })
      
      if (shouldRerender) {
        if (renderTimeout) {
          clearTimeout(renderTimeout)
        }
        
        renderTimeout = setTimeout(() => {
          requestAnimationFrame(() => {
            renderHeader()
          })
        }, 150)
      }
    })

    const ganttContainer = container.closest('[class*="gantt"]')
    const actionItemList = ganttContainer?.querySelector('[class*="action-item"]') || 
                          ganttContainer?.querySelector('[class*="task-list"]') ||
                          ganttContainer
    
    if (actionItemList) {
      observerRef.current.observe(actionItemList, {
        childList: true,
        subtree: true
      })
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
      if (renderTimeout) {
        clearTimeout(renderTimeout)
      }
      if (renderTimeoutRef.current) {
        clearTimeout(renderTimeoutRef.current)
      }
    }
  }, [scrollRef])

  // 렌더링 트리거 변경 시
  useEffect(() => {
    if (renderTimeoutRef.current) {
      clearTimeout(renderTimeoutRef.current)
    }
    
    renderTimeoutRef.current = setTimeout(() => {
      requestAnimationFrame(() => {
        renderHeader()
      })
    }, 100)
  }, [renderTrigger])

  return (
    <div 
      ref={scrollRef}
      className={`${styles.ganttChartHeader} flex-shrink-0`}
      onScroll={onScroll} // 스크롤 핸들러 적용
    >
      <canvas 
        ref={canvasRef}
        key={`header-${displayTasks.length}-${expandedNodesSize}-${dateUnit}`}
        className="block"
      />
    </div>
  )
}

export default GanttHeader

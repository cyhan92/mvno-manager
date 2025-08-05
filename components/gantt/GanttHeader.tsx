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
}

const GanttHeader: React.FC<GanttHeaderProps> = ({
  displayTasks,
  dateUnit,
  expandedNodesSize,
  scrollRef,
  renderTrigger,
  containerRef
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

    // 핵심 수정: 메인 차트와 동일한 컨테이너 너비 사용
    let containerWidth = container.clientWidth
    
    // containerRef가 있으면 메인 차트 컨테이너 너비를 우선 사용
    if (containerRef?.current) {
      containerWidth = containerRef.current.clientWidth
    }
    
    const dimensions = calculateCanvasDimensions(containerWidth, displayTasks.length, dateUnit)
    console.log(`🎯 [DEBUG] GanttHeader dimensions - width: ${dimensions.chartWidth}, dateUnit: ${dateUnit}`)

    canvas.width = dimensions.chartWidth
    canvas.height = 80

    canvas.style.width = `${dimensions.chartWidth}px`
    canvas.style.height = '80px'

    if (dateUnit === 'week') {
      canvas.style.minWidth = '1800px'
      canvas.style.maxWidth = 'none'
      console.log('🎯 [DEBUG] GanttHeader applying week styles')
    } else {
      canvas.style.minWidth = 'auto'
      canvas.style.maxWidth = '100%'
      console.log('🎯 [DEBUG] GanttHeader applying month styles')
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
    const chartWidth = dimensions.chartWidth

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
        const x = leftMargin + ((header.start - startDate.getTime()) / timeRange) * chartWidth
        const width = ((header.end - header.start) / timeRange) * chartWidth
        
        // 헤더 라벨 그리기
        ctx.fillText(header.label, x + width / 2, dateUnit === 'week' ? 30 : 40)

        // 세로선 그리기 - 구간 끝에만
        const endX = leftMargin + ((header.end - startDate.getTime()) / timeRange) * chartWidth
        ctx.strokeStyle = dateUnit === 'week' ? '#9ca3af' : '#e5e7eb'
        ctx.lineWidth = dateUnit === 'week' ? 1.5 : 1
        
        if (dateUnit === 'week') {
          ctx.setLineDash([]) // 주별은 실선
        } else {
          ctx.setLineDash([4, 4]) // 월별은 점선
        }
        
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
      const todayX = leftMargin + ((today.getTime() - startDate.getTime()) / timeRange) * chartWidth
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
  }, [displayTasks, dateUnit, expandedNodesSize, renderTrigger, containerRef])

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

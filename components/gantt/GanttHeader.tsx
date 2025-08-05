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
    const canvas = canvasRef.current
    const container = scrollRef.current
    if (!canvas || !container) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // 핵심 수정: 메인 차트와 동일한 컨테이너 너비 사용
    let containerWidth = container.clientWidth
    
    // containerRef가 있으면 메인 차트 컨테이너 너비를 우선 사용
    if (containerRef?.current) {
      containerWidth = containerRef.current.clientWidth
    }
    
    const dimensions = calculateCanvasDimensions(containerWidth, displayTasks.length, dateUnit)

    canvas.width = dimensions.chartWidth
    canvas.height = 80

    canvas.style.width = `${dimensions.chartWidth}px`
    canvas.style.height = '80px'

    if (dateUnit === 'week') {
      canvas.style.minWidth = '1200px'
      canvas.style.maxWidth = 'none'
    } else {
      canvas.style.minWidth = 'auto'
      canvas.style.maxWidth = '100%'
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

    // 월별 구분선과 라벨 그리기
    const months = generateMonthHeaders(startDate, endDate)
    
    ctx.font = '14px Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
    ctx.fillStyle = '#374151'
    ctx.textAlign = 'center'

    months.forEach((month) => {
        const x = leftMargin + ((month.start - startDate.getTime()) / timeRange) * chartWidth
        const width = ((month.end - month.start) / timeRange) * chartWidth
        ctx.fillText(month.label, x + width / 2, 40)

        // 세로선 그리기
        const endX = leftMargin + ((month.end - startDate.getTime()) / timeRange) * chartWidth
        ctx.strokeStyle = '#e5e7eb'
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.moveTo(endX, 0)
        ctx.lineTo(endX, canvas.height)
        ctx.stroke()
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

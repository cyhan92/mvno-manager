'use client'
import React, { useEffect, useRef } from 'react'
import { Task, DateUnit } from '../../types/task'
import { styles } from '../../styles'
import { calculateDateRange } from '../../utils/canvas'
import { generateMonthHeaders, generateWeekHeaders } from '../../utils/canvas/headers/headerGenerators'

interface GanttHeaderProps {
  displayTasks: Task[]
  dateUnit: DateUnit
  expandedNodesSize: number
  scrollRef: React.RefObject<HTMLDivElement | null>
  renderTrigger: number
  containerRef?: React.RefObject<HTMLDivElement | null>
  chartWidth?: number // 메인 차트에서 계산된 최종 너비
  dateRange?: { startDate: Date; endDate: Date; timeRange: number }
  todayX?: number
  todayDate?: Date
  onScroll?: (e: React.UIEvent<HTMLDivElement>) => void // 스크롤 핸들러 추가
  onAfterRender?: () => void // 렌더 완료 후 동기화 콜백
}

const GanttHeader: React.FC<GanttHeaderProps> = ({
  displayTasks,
  dateUnit,
  expandedNodesSize,
  scrollRef,
  renderTrigger,
  containerRef,
  chartWidth, // 메인 차트에서 전달받은 최종 너비
  dateRange,
  todayX,
  todayDate,
  onScroll, // 스크롤 핸들러 추가
  onAfterRender
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const observerRef = useRef<MutationObserver | null>(null)
  const renderTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const isRenderingRef = useRef(false) // 렌더링 중복 방지
  const lastRenderConfigRef = useRef<string>('') // 마지막 렌더링 설정 캐시

  // 헤더 렌더링 함수 (성능 최적화)
  const renderHeader = () => {
    // 중복 렌더링 방지
    if (isRenderingRef.current) {
      return
    }
    
    const canvas = canvasRef.current
    const container = scrollRef.current
    if (!canvas || !container) {
      return
    }

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // 현재 렌더링 설정 생성
    const rangeKey = dateRange ? `${dateRange.startDate.getTime()}-${dateRange.endDate.getTime()}-${dateRange.timeRange}` : 'auto'
    const todayKey = typeof todayX === 'number' ? `${todayX}` : 'auto'
    const currentConfig = `${displayTasks.length}-${dateUnit}-${expandedNodesSize}-${chartWidth}-${rangeKey}-${todayKey}-${renderTrigger}`
    
    // 동일한 설정이면 렌더링 스킵 (불필요한 재렌더링 방지)
    if (lastRenderConfigRef.current === currentConfig) {
      return
    }

    isRenderingRef.current = true

    // 메인 차트에서 전달받은 chartWidth가 있으면 우선 사용
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

    // DPR 고려한 Canvas 크기 및 스타일 최적화
    const dpr = (typeof window !== 'undefined' && window.devicePixelRatio) ? window.devicePixelRatio : 1
    const targetCssWidth = finalChartWidth
    const targetCssHeight = 80
    const targetPixelWidth = Math.floor(targetCssWidth * dpr)
    const targetPixelHeight = Math.floor(targetCssHeight * dpr)
    const needsResize = canvas.width !== targetPixelWidth || canvas.height !== targetPixelHeight
    const needsStyleInit = !canvas.style.width || canvas.style.width === ''
    
  if (needsResize || needsStyleInit) {
      // Canvas 속성 및 스타일을 한번에 설정 (DOM 조작 최소화)
      canvas.width = targetPixelWidth
      canvas.height = targetPixelHeight
      
      // 스타일 일괄 설정 (reflow 최소화)
      const styleUpdates = {
    width: `${targetCssWidth}px`,
        height: `${targetCssHeight}px`,
        minWidth: dateUnit === 'week' ? '1800px' : `${finalChartWidth}px`,
        maxWidth: 'none',
        display: 'block'
      }
      
      Object.assign(canvas.style, styleUpdates)
    }
    // 매 렌더마다 변환 초기화 후 DPR 스케일 적용
    ctx.setTransform(1, 0, 0, 1, 0, 0)
    if (dpr !== 1) {
      ctx.scale(dpr, dpr)
    }

    let effectiveRange = dateRange
    if (!effectiveRange) {
      const validTasks = displayTasks.filter(task => task.start && task.end)
      if (validTasks.length === 0) return
      effectiveRange = calculateDateRange(validTasks)
      if (!effectiveRange) return
    }

    const { startDate, endDate, timeRange } = effectiveRange

    if (timeRange <= 0) return

    // 배경 그리기
    ctx.fillStyle = '#f7f7f7'
  ctx.fillRect(0, 0, targetCssWidth, targetCssHeight)

    const leftMargin = 0

    // 월별/주별 구분선과 라벨 그리기
    let headers = [] as Array<{ start: number; end: number; label: string; weekNumber?: number }>
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

  // 세로선 그리기 - 구간 끝에만 (그리드와 동일한 점선 패턴 사용)
  const endXRaw = leftMargin + ((header.end - startDate.getTime()) / timeRange) * finalChartWidth
  const endX = Math.round(endXRaw) + 0.5
  ctx.strokeStyle = '#d1d5db'
  ctx.lineWidth = 1
  // 월별은 [4,4], 주별은 [2,2] 패턴으로 통일
  ctx.setLineDash(dateUnit === 'month' ? [4, 4] : [2, 2])
        
        ctx.beginPath()
        ctx.moveTo(endX, 0)
        ctx.lineTo(endX, canvas.height)
        ctx.stroke()
        
        // 점선 패턴 리셋
        ctx.setLineDash([])
    })

    // 오늘 날짜 세로선 (차트가 전달한 좌표 우선, 없으면 차트 정보가 완전할 때만 fallback)
    if (typeof todayX === 'number') {
      // DPR 보정된 정확한 좌표 계산 (차트와 동일한 방식)
      const dpr = window.devicePixelRatio || 1
      const exactX = todayX * dpr
      
      ctx.strokeStyle = '#ef4444'
      ctx.lineWidth = 2 * dpr
      ctx.beginPath()
      ctx.moveTo(exactX, 0)
      ctx.lineTo(exactX, canvas.height)
      ctx.stroke()
      try { console.log('Header today line drawn at (prop):', todayX, 'DPR-adjusted:', exactX, 'DPR:', dpr) } catch {}
    } else if (chartWidth && chartWidth > 0 && dateRange && todayDate) {
      // 차트 정보가 완전히 준비된 경우에만 fallback 계산 허용
      const today = todayDate
      if (today >= startDate && today <= endDate) {
        const todayXRaw = leftMargin + ((today.getTime() - startDate.getTime()) / timeRange) * finalChartWidth
        const dpr = window.devicePixelRatio || 1
        const alignedX = Math.round(todayXRaw) + 0.5
        const exactX = alignedX * dpr
        
        ctx.strokeStyle = '#ef4444'
        ctx.lineWidth = 2 * dpr
        ctx.beginPath()
        ctx.moveTo(exactX, 0)
        ctx.lineTo(exactX, canvas.height)
        ctx.stroke()
        try { console.log('Header today line drawn at (fallback):', alignedX, 'DPR-adjusted:', exactX, 'chartWidth:', chartWidth, 'DPR:', dpr) } catch {}
      }
    } else {
      // 차트 정보가 아직 준비되지 않은 경우 오늘 날짜선을 그리지 않음
      try { console.log('Header today line skipped - waiting for chart data:', { todayX, chartWidth, hasDateRange: !!dateRange, hasTodayDate: !!todayDate }) } catch {}
    }

    // 렌더링 완료 처리
    lastRenderConfigRef.current = currentConfig
    isRenderingRef.current = false
    if (onAfterRender) {
      try {
        requestAnimationFrame(() => onAfterRender())
      } catch {}
    }
  }

  // 최적화된 헤더 렌더링 useEffect (디바운싱 및 중복 방지)
  useEffect(() => {
    let renderTimeout: NodeJS.Timeout | null = null
    
    const executeRender = () => {
      if (renderTimeout) {
        clearTimeout(renderTimeout)
      }
      
      // 렌더링 지연을 최소화하고 requestAnimationFrame으로 부드럽게 처리
      renderTimeout = setTimeout(() => {
        if (!isRenderingRef.current) {
          requestAnimationFrame(() => {
            renderHeader()
          })
        }
      }, 10) // 극도로 짧은 지연 시간
    }
    
    executeRender()
    
  return () => {
      if (renderTimeout) {
        clearTimeout(renderTimeout)
      }
      isRenderingRef.current = false
    }
  }, [
    displayTasks.length,
    dateUnit,
    expandedNodesSize,
    renderTrigger,
    chartWidth,
    dateRange?.startDate?.getTime(),
    dateRange?.endDate?.getTime(),
    dateRange?.timeRange,
    todayX
  ])

  // DOM 변경 감지 (최적화된 디바운싱)
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
      
      if (shouldRerender && !isRenderingRef.current) {
        if (renderTimeout) {
          clearTimeout(renderTimeout)
        }
        
        renderTimeout = setTimeout(() => {
          if (!isRenderingRef.current) {
            requestAnimationFrame(() => {
              renderHeader()
            })
          }
        }, 100) // DOM 변경 감지는 조금 더 긴 지연
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
      isRenderingRef.current = false
    }
  }, [scrollRef])

  // 렌더링 트리거 변경 시 (제거 - 위의 통합된 useEffect에서 처리)
  // useEffect(() => {
  //   if (renderTimeoutRef.current) {
  //     clearTimeout(renderTimeoutRef.current)
  //   }
  //   
  //   renderTimeoutRef.current = setTimeout(() => {
  //     requestAnimationFrame(() => {
  //       renderHeader()
  //     })
  //   }, 100)
  // }, [renderTrigger])

  return (
    <div 
      ref={scrollRef}
  className={`${styles.ganttChartHeader} flex-shrink-0`}
      onScroll={onScroll} // 스크롤 핸들러 적용
    >
      <canvas 
        ref={canvasRef}
        key={`header-stable-${dateUnit}`} // 안정적인 key로 변경 (불필요한 재마운트 방지)
        className="block"
      />
    </div>
  )
}

export default GanttHeader

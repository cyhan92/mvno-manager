import { useRef, useCallback } from 'react'

export const useGanttScroll = () => {
  const actionItemScrollRef = useRef<HTMLDivElement>(null)
  const ganttChartScrollRef = useRef<HTMLDivElement>(null)
  const headerScrollRef = useRef<HTMLDivElement>(null)
  const isScrollingSyncRef = useRef(false)

  // Action Item 스크롤과 Gantt Chart 스크롤 동기화
  const handleActionItemScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    if (isScrollingSyncRef.current) return
    
    const scrollTop = e.currentTarget.scrollTop
    
    if (ganttChartScrollRef.current) {
      isScrollingSyncRef.current = true
      ganttChartScrollRef.current.scrollTop = scrollTop
      
      requestAnimationFrame(() => {
        isScrollingSyncRef.current = false
      })
    }
  }, [])

  const handleGanttChartScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    if (isScrollingSyncRef.current) return
    
    const scrollTop = e.currentTarget.scrollTop
    // 진행률 기반 동기화: 뷰포트 폭 차이(세로 스크롤바 유무)에도 일관된 위치 유지
    const source = e.currentTarget
    const sourceMax = Math.max(1, source.scrollWidth - source.clientWidth)
    const ratio = sourceMax > 0 ? source.scrollLeft / sourceMax : 0
    
    isScrollingSyncRef.current = true
    
    // 세로 스크롤 동기화 (Action Item과)
    if (actionItemScrollRef.current) {
      actionItemScrollRef.current.scrollTop = scrollTop
    }
    
    // 가로 스크롤 동기화 (헤더와)
    if (headerScrollRef.current) {
      const target = headerScrollRef.current
      const targetMax = Math.max(0, target.scrollWidth - target.clientWidth)
      const targetLeft = Math.round(ratio * targetMax)
      target.scrollLeft = targetLeft
    }
    
    requestAnimationFrame(() => {
      isScrollingSyncRef.current = false
    })
  }, [])

  // 헤더 스크롤과 간트차트 가로 스크롤 동기화 (새로 추가)
  const handleHeaderScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    if (isScrollingSyncRef.current) return
    
    const source = e.currentTarget
    const sourceMax = Math.max(1, source.scrollWidth - source.clientWidth)
    const ratio = sourceMax > 0 ? source.scrollLeft / sourceMax : 0
    
    if (ganttChartScrollRef.current) {
      isScrollingSyncRef.current = true
      const target = ganttChartScrollRef.current
      const targetMax = Math.max(0, target.scrollWidth - target.clientWidth)
      const targetLeft = Math.round(ratio * targetMax)
      target.scrollLeft = targetLeft
      
      requestAnimationFrame(() => {
        isScrollingSyncRef.current = false
      })
    }
  }, [])

  // 초기 스크롤 위치 설정 함수
  const setInitialScrollPosition = useCallback((scrollLeft: number) => {
    console.log('setInitialScrollPosition called with:', scrollLeft)
    // 절대 픽셀 대신 진행률 기반으로 동기화 (컨테이너 뷰포트 차이 대응)
    const desiredLeftPx = Math.max(0, scrollLeft)
    
    // 여러 번 시도하여 DOM 요소가 준비될 때까지 기다림
    const attemptScroll = (attempts = 0) => {
      console.log(`Scroll attempt ${attempts}, refs exist:`, {
        gantt: !!ganttChartScrollRef.current,
        header: !!headerScrollRef.current
      })
      
      if (attempts > 20) {
        console.log('Max scroll attempts reached, giving up')
        return // 최대 20번 시도
      }
      
      if (ganttChartScrollRef.current && headerScrollRef.current) {
        console.log('DOM elements found, setting scroll position')
        // 동기화 플래그 설정하여 무한 루프 방지
        isScrollingSyncRef.current = true
        
        // requestAnimationFrame을 사용하여 브라우저 렌더링 사이클에 맞춤
        requestAnimationFrame(() => {
          if (ganttChartScrollRef.current && headerScrollRef.current) {
            // gantt 기준으로 진행률 산출
            const g = ganttChartScrollRef.current
            const h = headerScrollRef.current
            const gMax = Math.max(1, g.scrollWidth - g.clientWidth)
            const ratio = Math.min(1, desiredLeftPx / gMax)
            const gLeft = Math.round(ratio * gMax)
            const hMax = Math.max(0, h.scrollWidth - h.clientWidth)
            const hLeft = Math.round(ratio * hMax)

            console.log('Actually setting scroll ratio:', { ratio, desiredLeftPx, gMax, hMax, gLeft, hLeft })
            // 두 스크롤을 각각의 최대치에 맞춰 설정
            g.scrollLeft = gLeft
            h.scrollLeft = hLeft
            console.log('Scroll position set! Current values:', {
              gantt: g.scrollLeft,
              header: h.scrollLeft
            })
            
            // 동기화 플래그 해제 및 최종 검증
            requestAnimationFrame(() => {
              isScrollingSyncRef.current = false
              
              // 추가 검증: 스크롤 위치가 정확히 동기화되었는지 확인
              if (ganttChartScrollRef.current && headerScrollRef.current) {
                const g2 = ganttChartScrollRef.current
                const h2 = headerScrollRef.current
                const g2Max = Math.max(1, g2.scrollWidth - g2.clientWidth)
                const h2Max = Math.max(1, h2.scrollWidth - h2.clientWidth)
                const rG = g2.scrollLeft / g2Max
                const rH = h2.scrollLeft / h2Max
                if (Math.abs(rG - rH) > 0.005) { // 0.5% 이내 오차 허용
                  const avg = (rG + rH) / 2
                  g2.scrollLeft = Math.round(avg * g2Max)
                  h2.scrollLeft = Math.round(avg * h2Max)
                  console.log('Re-synced by ratio avg:', { rG, rH, avg })
                }
              }
            })
          }
        })
      } else {
        console.log('DOM elements not ready, retrying in 50ms')
        // DOM 요소가 준비되지 않았으면 50ms 후 재시도 (100ms에서 50ms로 단축)
        setTimeout(() => attemptScroll(attempts + 1), 50)
      }
    }
    
    // 즉시 시도하여 더 빠른 스크롤 설정 (100ms 지연 제거)
    attemptScroll()
  }, [])

  return {
    actionItemScrollRef,
    ganttChartScrollRef,
    headerScrollRef,
    handleActionItemScroll,
    handleGanttChartScroll,
    handleHeaderScroll, // 새로 추가된 헤더 스크롤 핸들러
    setInitialScrollPosition // 초기 스크롤 위치 설정 함수
  }
}

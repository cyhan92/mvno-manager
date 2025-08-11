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
    const scrollLeft = e.currentTarget.scrollLeft
    
    isScrollingSyncRef.current = true
    
    // 세로 스크롤 동기화 (Action Item과)
    if (actionItemScrollRef.current) {
      actionItemScrollRef.current.scrollTop = scrollTop
    }
    
    // 가로 스크롤 동기화 (헤더와)
    if (headerScrollRef.current) {
      headerScrollRef.current.scrollLeft = scrollLeft
    }
    
    requestAnimationFrame(() => {
      isScrollingSyncRef.current = false
    })
  }, [])

  // 헤더 스크롤과 간트차트 가로 스크롤 동기화 (새로 추가)
  const handleHeaderScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    if (isScrollingSyncRef.current) return
    
    const scrollLeft = e.currentTarget.scrollLeft
    
    if (ganttChartScrollRef.current) {
      isScrollingSyncRef.current = true
      ganttChartScrollRef.current.scrollLeft = scrollLeft
      
      requestAnimationFrame(() => {
        isScrollingSyncRef.current = false
      })
    }
  }, [])

  // 초기 스크롤 위치 설정 함수
  const setInitialScrollPosition = useCallback((scrollLeft: number) => {
    console.log('setInitialScrollPosition called with:', scrollLeft)
    
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
            console.log('Actually setting scroll position to:', scrollLeft)
            // 두 스크롤을 동시에 설정하여 동기화 보장
            ganttChartScrollRef.current.scrollLeft = scrollLeft
            headerScrollRef.current.scrollLeft = scrollLeft
            console.log('Scroll position set! Current values:', {
              gantt: ganttChartScrollRef.current.scrollLeft,
              header: headerScrollRef.current.scrollLeft
            })
            
            // 동기화 플래그 해제 및 최종 검증
            requestAnimationFrame(() => {
              isScrollingSyncRef.current = false
              
              // 추가 검증: 스크롤 위치가 정확히 동기화되었는지 확인
              if (ganttChartScrollRef.current && headerScrollRef.current) {
                const ganttScroll = ganttChartScrollRef.current.scrollLeft
                const headerScroll = headerScrollRef.current.scrollLeft
                
                if (Math.abs(ganttScroll - headerScroll) > 1) {
                  console.log('Scroll sync verification failed, re-syncing:', {
                    gantt: ganttScroll,
                    header: headerScroll,
                    target: scrollLeft
                  })
                  // 동기화가 어긋났으면 다시 맞춤
                  ganttChartScrollRef.current.scrollLeft = scrollLeft
                  headerScrollRef.current.scrollLeft = scrollLeft
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

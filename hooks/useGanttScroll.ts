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
    // 여러 번 시도하여 DOM 요소가 준비될 때까지 기다림
    const attemptScroll = (attempts = 0) => {
      if (attempts > 20) return // 최대 20번 시도
      
      if (ganttChartScrollRef.current && headerScrollRef.current) {
        // requestAnimationFrame을 사용하여 브라우저 렌더링 사이클에 맞춤
        requestAnimationFrame(() => {
          if (ganttChartScrollRef.current && headerScrollRef.current) {
            ganttChartScrollRef.current.scrollLeft = scrollLeft
            headerScrollRef.current.scrollLeft = scrollLeft
            console.log('Initial scroll position set to:', scrollLeft)
          }
        })
      } else {
        // DOM 요소가 준비되지 않았으면 100ms 후 재시도
        setTimeout(() => attemptScroll(attempts + 1), 100)
      }
    }
    
    // 약간의 지연 후 시도하여 DOM이 완전히 준비되도록 함
    setTimeout(() => attemptScroll(), 100)
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

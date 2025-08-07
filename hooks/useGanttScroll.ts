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
    if (ganttChartScrollRef.current && headerScrollRef.current) {
      ganttChartScrollRef.current.scrollLeft = scrollLeft
      headerScrollRef.current.scrollLeft = scrollLeft
    }
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

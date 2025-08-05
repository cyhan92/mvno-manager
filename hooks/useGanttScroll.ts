import { useRef } from 'react'

export const useGanttScroll = () => {
  const actionItemScrollRef = useRef<HTMLDivElement>(null)
  const ganttChartScrollRef = useRef<HTMLDivElement>(null)
  const headerScrollRef = useRef<HTMLDivElement>(null)
  const isScrollingSyncRef = useRef(false)

  // Action Item 스크롤과 Gantt Chart 스크롤 동기화
  const handleActionItemScroll = (e: React.UIEvent<HTMLDivElement>) => {
    if (isScrollingSyncRef.current) return
    
    const scrollTop = e.currentTarget.scrollTop
    if (ganttChartScrollRef.current) {
      isScrollingSyncRef.current = true
      ganttChartScrollRef.current.scrollTop = scrollTop
      
      // 다음 프레임에서 플래그 리셋
      requestAnimationFrame(() => {
        isScrollingSyncRef.current = false
      })
    }
  }

  const handleGanttChartScroll = (e: React.UIEvent<HTMLDivElement>) => {
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
    
    // 다음 프레임에서 플래그 리셋
    requestAnimationFrame(() => {
      isScrollingSyncRef.current = false
    })
  }

  return {
    actionItemScrollRef,
    ganttChartScrollRef,
    headerScrollRef,
    handleActionItemScroll,
    handleGanttChartScroll
  }
}

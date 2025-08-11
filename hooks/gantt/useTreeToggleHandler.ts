import { useCallback } from 'react'

interface UseTreeToggleHandlerProps {
  treeState: {
    toggleNode: (nodeId: string) => void
  }
  scrollRefs: {
    actionItemScrollRef: React.RefObject<HTMLDivElement | null>
    ganttChartScrollRef: React.RefObject<HTMLDivElement | null>
    headerScrollRef?: React.RefObject<HTMLDivElement | null> // 헤더 스크롤 ref 추가
  }
  renderChart?: () => void
  triggerRender: () => void
}

export const useTreeToggleHandler = ({
  treeState,
  scrollRefs,
  renderChart,
  triggerRender
}: UseTreeToggleHandlerProps) => {
  // 최적화된 트리 노드 토글 핸들러 (세로바 동기화 포함)
  const handleTreeToggle = useCallback((nodeId: string) => {
    // 현재 스크롤 위치 저장 (세로 + 가로 모두)
    const currentScrollTop = scrollRefs.actionItemScrollRef.current?.scrollTop || 0
    const currentScrollLeft = scrollRefs.ganttChartScrollRef.current?.scrollLeft || 0
    
    // 트리 상태 토글
    treeState.toggleNode(nodeId)
    
    // 즉시 렌더링으로 깜빡임 방지 (지연 최소화)
    requestAnimationFrame(() => {
      // 메인 차트 즉시 렌더링
      if (renderChart) {
        renderChart()
      }
      
      // 헤더 렌더링을 최소 지연으로 처리
      requestAnimationFrame(() => {
        triggerRender()
        
        // 스크롤 위치 즉시 복원 (세로 + 가로 모두)
        if (scrollRefs.actionItemScrollRef.current) {
          scrollRefs.actionItemScrollRef.current.scrollTop = currentScrollTop
        }
        if (scrollRefs.ganttChartScrollRef.current) {
          scrollRefs.ganttChartScrollRef.current.scrollTop = currentScrollTop
          scrollRefs.ganttChartScrollRef.current.scrollLeft = currentScrollLeft // 가로 스크롤 복원
        }
        if (scrollRefs.headerScrollRef?.current) {
          scrollRefs.headerScrollRef.current.scrollLeft = currentScrollLeft // 헤더 가로 스크롤 복원
        }
      })
    })
  }, [treeState, scrollRefs, renderChart, triggerRender])

  return { handleTreeToggle }
}

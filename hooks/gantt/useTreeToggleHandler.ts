import { useCallback } from 'react'

interface UseTreeToggleHandlerProps {
  treeState: {
    toggleNode: (nodeId: string) => void
  }
  scrollRefs: {
    actionItemScrollRef: React.RefObject<HTMLDivElement | null>
    ganttChartScrollRef: React.RefObject<HTMLDivElement | null>
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
  // 트리 노드 토글 핸들러
  const handleTreeToggle = useCallback((nodeId: string) => {
    // 현재 스크롤 위치 저장
    const currentScrollTop = scrollRefs.actionItemScrollRef.current?.scrollTop || 0
    
    // 트리 상태 토글
    treeState.toggleNode(nodeId)
    
    // 부드러운 단일 동기화 렌더링
    requestAnimationFrame(() => {
      // 메인 차트 렌더링
      if (renderChart) {
        renderChart()
      }
      
      // 헤더 렌더링 (한 번만, 적절한 지연으로)
      setTimeout(() => {
        triggerRender() // 디바운싱된 함수 사용
        
        // 스크롤 위치 복원
        setTimeout(() => {
          if (scrollRefs.actionItemScrollRef.current) {
            scrollRefs.actionItemScrollRef.current.scrollTop = currentScrollTop
          }
          if (scrollRefs.ganttChartScrollRef.current) {
            scrollRefs.ganttChartScrollRef.current.scrollTop = currentScrollTop
          }
        }, 30) // 빠른 스크롤 복원
      }, 100) // 메인 차트 렌더링 완료 후
    })
  }, [treeState, scrollRefs, renderChart, triggerRender])

  return { handleTreeToggle }
}

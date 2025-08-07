import { useCallback } from 'react'

interface UseGanttTreeToggleProps {
  actionItemScrollRef: React.RefObject<HTMLDivElement | null>
  ganttChartScrollRef: React.RefObject<HTMLDivElement | null>
  toggleNode: (nodeId: string) => void
  renderChart?: () => void
  triggerRender: () => void
}

export const useGanttTreeToggle = ({
  actionItemScrollRef,
  ganttChartScrollRef,
  toggleNode,
  renderChart,
  triggerRender
}: UseGanttTreeToggleProps) => {
  // 트리 노드 토글 핸들러
  const handleTreeToggle = useCallback((nodeId: string) => {
    // 현재 스크롤 위치 저장
    const currentScrollTop = actionItemScrollRef.current?.scrollTop || 0
    
    // 트리 상태 토글
    toggleNode(nodeId)
    
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
          if (actionItemScrollRef.current) {
            actionItemScrollRef.current.scrollTop = currentScrollTop
          }
          if (ganttChartScrollRef.current) {
            ganttChartScrollRef.current.scrollTop = currentScrollTop
          }
        }, 30) // 빠른 스크롤 복원
      }, 100) // 메인 차트 렌더링 완료 후
    })
  }, [actionItemScrollRef, ganttChartScrollRef, toggleNode, renderChart, triggerRender])

  return {
    handleTreeToggle
  }
}

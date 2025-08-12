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
  // 소수점 스크롤로 인한 어긋남 방지: 정수로 반올림해서 저장
  const currentScrollLeft = Math.round(scrollRefs.ganttChartScrollRef.current?.scrollLeft || 0)
    
    console.log('트리 토글 전 스크롤 위치:', { scrollTop: currentScrollTop, scrollLeft: currentScrollLeft })
    
    // 트리 상태 토글
    treeState.toggleNode(nodeId)
    
    // 더 안정적인 스크롤 복원을 위해 여러 단계로 처리
    requestAnimationFrame(() => {
      // 메인 차트 즉시 렌더링
      if (renderChart) {
        renderChart()
      }
      
      // 헤더와 메인 차트의 렌더링을 분리하여 처리
      requestAnimationFrame(() => {
        triggerRender()
        
        // 첫 번째 스크롤 위치 복원 시도
        setTimeout(() => {
          if (scrollRefs.actionItemScrollRef.current) {
            scrollRefs.actionItemScrollRef.current.scrollTop = currentScrollTop
          }
          if (scrollRefs.ganttChartScrollRef.current) {
            scrollRefs.ganttChartScrollRef.current.scrollTop = currentScrollTop
            scrollRefs.ganttChartScrollRef.current.scrollLeft = currentScrollLeft
          }
          if (scrollRefs.headerScrollRef?.current) {
            scrollRefs.headerScrollRef.current.scrollLeft = currentScrollLeft
          }
          
          console.log('첫 번째 스크롤 복원 완료')
          
          // 두 번째 검증 및 보정
          setTimeout(() => {
            const ganttScrollLeft = scrollRefs.ganttChartScrollRef.current?.scrollLeft || 0
            const headerScrollLeft = scrollRefs.headerScrollRef?.current?.scrollLeft || 0
            
            console.log('스크롤 동기화 검증:', { 
              target: currentScrollLeft,
              gantt: ganttScrollLeft, 
              header: headerScrollLeft,
              diff: Math.abs(ganttScrollLeft - headerScrollLeft)
            })
            
            // 동기화가 어긋났으면 강제로 맞춤
            if (Math.abs(ganttScrollLeft - headerScrollLeft) > 0) {
              console.log('스크롤 재동기화 실행')
              if (scrollRefs.ganttChartScrollRef.current) {
                scrollRefs.ganttChartScrollRef.current.scrollLeft = currentScrollLeft
              }
              if (scrollRefs.headerScrollRef?.current) {
                scrollRefs.headerScrollRef.current.scrollLeft = currentScrollLeft
              }
            }
          }, 50) // 50ms 후 재검증
        }, 10) // 10ms 후 첫 번째 복원
      })
    })
  }, [treeState, scrollRefs, renderChart, triggerRender])

  return { handleTreeToggle }
}
